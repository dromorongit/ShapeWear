import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { connectDb } from '@/lib/db/connect'
import Order from '@/lib/db/models/Order'
import Product from '@/lib/db/models/Product'
import { revalidatePath } from 'next/cache'

interface PaystackWebhookBody {
  event: string
  data: {
    reference: string
    status: string
    amount: number
    paid_at?: string
    id?: number
    [key: string]: unknown
  }
}

function verifyPaystackSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const hmac = crypto.createHmac('sha512', secret)
  const digest = hmac.update(rawBody).digest('hex')
  if (digest.length !== signature.length) return false
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  try {
    await connectDb()

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const signature = request.headers.get('x-paystack-signature')
    const rawBody = await request.text()

    if (!verifyPaystackSignature(rawBody, signature, paystackSecretKey)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as PaystackWebhookBody

    if (event.event !== 'charge.success') {
      return NextResponse.json({ received: true })
    }

    const { reference, amount, paid_at, id } = event.data

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
    }

    const order = await Order.findOne({ paystackReference: reference }).exec()

    if (!order) {
      console.error(`Webhook: order not found for reference ${reference}`)
      return NextResponse.json({ received: true })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ received: true })
    }

    if (order.status !== 'pending') {
      console.error(`Webhook: unexpected order status ${order.status} for reference ${reference}`)
      return NextResponse.json({ received: true })
    }

    const affectedSlugs: string[] = []
    let stockIssue = false

    for (const item of order.items) {
      const stockUpdateResult = await Product.findOneAndUpdate(
        { 'variants.sku': item.sku, 'variants.stock': { $gte: item.quantity } },
        { $inc: { 'variants.$.stock': -item.quantity } },
        { new: true }
      ).exec()

      if (!stockUpdateResult) {
        stockIssue = true
        console.error(
          `Webhook: stock insufficient for SKU ${item.sku} on order ${order._id}. ` +
          `Order was paid but stock could not be decremented. Manual review required.`
        )
        continue
      }

      affectedSlugs.push(stockUpdateResult.slug)
    }

    order.status = 'paid'
    order.paystackTransactionId = typeof id === 'number' ? String(id) : undefined
    order.paystackAmount = typeof amount === 'number' ? amount / 100 : undefined
    order.paystackPaidAt = paid_at ? new Date(paid_at) : undefined

    await order.save()

    const uniqueSlugs = Array.from(new Set(affectedSlugs))
    uniqueSlugs.forEach((slug) => {
      revalidatePath(`/products/${slug}`)
    })

    if (uniqueSlugs.length > 0) {
      revalidatePath('/shop')
      revalidatePath('/')
    }

    if (stockIssue) {
      console.error(
        `Webhook: order ${order._id} marked paid but had stock issues. ` +
        `Reference: ${reference}. Manual review required.`
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
