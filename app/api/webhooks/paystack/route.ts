/**
 * Paystack webhook endpoint for Shapewear Closet.
 *
 * DUAL-SITE ROUTING:
 * This endpoint is the single registered Paystack webhook for both Shapewear Closet
 * and Affordable Wigs Ghana because Paystack only allows one webhook URL per account.
 *
 * Routing logic:
 * - References starting with "SC-" are Shapewear Closet orders and are processed locally.
 * - All other references are forwarded to Affordable Wigs Ghana's webhook endpoint.
 *
 * If the sites ever get separate Paystack accounts:
 * 1. Remove the forwarding logic below.
 * 2. Update the Paystack dashboard to point directly at AWG's own webhook endpoint.
 * 3. Revert this endpoint to handle only Shapewear Closet events.
 */
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
    const contentType = request.headers.get('content-type') || 'application/json'
    const rawBody = await request.text()

    if (!verifyPaystackSignature(rawBody, signature, paystackSecretKey)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as PaystackWebhookBody

    const { reference } = event.data

    if (!reference) {
      console.error('Webhook: missing reference in payload')
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
    }

    if (!reference.startsWith('SC-')) {
      console.log(`Webhook: forwarding non-SC reference ${reference} (event: ${event.event}) to AWG`)

      const awgForwardUrl = process.env.AWG_WEBHOOK_FORWARD_URL

      if (!awgForwardUrl) {
        console.error('Webhook: AWG_WEBHOOK_FORWARD_URL not configured, cannot forward')
        return NextResponse.json({ error: 'Forward target not configured' }, { status: 500 })
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const forwardResponse = await fetch(awgForwardUrl, {
          method: 'POST',
          headers: {
            'x-paystack-signature': signature || '',
            'content-type': contentType,
          },
          body: rawBody,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!forwardResponse.ok) {
          console.error(`Webhook: forward failed with status ${forwardResponse.status} for reference ${reference}`)
          return NextResponse.json({ error: 'Forward failed' }, { status: 502 })
        }

        console.log(`Webhook: forwarded successfully for reference ${reference} (event: ${event.event})`)
        return NextResponse.json({ received: true })
      } catch (forwardError) {
        console.error(`Webhook: forward error for reference ${reference}`, forwardError)
        return NextResponse.json({ error: 'Forward failed' }, { status: 502 })
      }
    }

    if (event.event !== 'charge.success') {
      return NextResponse.json({ received: true })
    }

    const { amount, paid_at, id } = event.data

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
