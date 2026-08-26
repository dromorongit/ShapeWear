import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import Order from '@/lib/db/models/Order'
import Affiliate from '@/lib/db/models/Affiliate'

interface CheckoutItem {
  sku: string
  quantity: number
}

interface CheckoutBody {
  customerName: string
  phone: string
  email?: string
  deliveryAddress: string
  orderNote?: string
  items: CheckoutItem[]
  subtotal: number
}

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomUUID().slice(0, 8).toUpperCase()
  return `SC-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    await connectDb()

    const body = (await request.json()) as CheckoutBody

    const { customerName, phone, email, deliveryAddress, orderNote, items, subtotal } = body

    if (!customerName || !phone || !deliveryAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required checkout fields' }, { status: 400 })
    }

    const validatedItems = []
    let computedSubtotal = 0

    for (const item of items) {
      if (!item.sku || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: `Invalid item: ${JSON.stringify(item)}` }, { status: 400 })
      }

      const product = await Product.findOne({ 'variants.sku': item.sku, isActive: true }).lean().exec()

      if (!product) {
        return NextResponse.json({ error: `Product not found for SKU: ${item.sku}` }, { status: 400 })
      }

      const variant = product.variants.find((v) => v.sku === item.sku)

      if (!variant) {
        return NextResponse.json({ error: `Variant not found for SKU: ${item.sku}` }, { status: 400 })
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name} (${variant.shape}/${variant.size}). Only ${variant.stock} left.` },
          { status: 400 }
        )
      }

      const effectivePrice = product.salePrice ?? product.price
      computedSubtotal += effectivePrice * item.quantity

      validatedItems.push({
        productId: product._id.toString(),
        productName: product.name,
        slug: product.slug,
        mainImage: product.mainImage,
        shape: variant.shape,
        size: variant.size,
        sku: variant.sku,
        price: effectivePrice,
        quantity: item.quantity,
      })
    }

    if (Math.abs(computedSubtotal - subtotal) > 0.01) {
      return NextResponse.json(
        { error: 'Price mismatch. Please refresh and try again.', computedSubtotal },
        { status: 400 }
      )
    }

    let affiliateId: string | undefined
    let referralCode: string | undefined
    let commissionRate: number | undefined
    let commissionAmount: number | undefined
    let commissionStatus: 'pending' | 'confirmed' | 'none' = 'none'

    const scRef = request.cookies.get('sc_ref')?.value
    if (scRef) {
      const affiliate = await Affiliate.findOne({ referralCode: scRef, status: 'approved' }).lean().exec()
      if (affiliate) {
        affiliateId = affiliate._id.toString()
        referralCode = affiliate.referralCode
        commissionRate = affiliate.commissionRate
        commissionAmount = computedSubtotal * (affiliate.commissionRate / 100)
        commissionStatus = 'pending'
      }
    }

    const reference = generateReference()

    await Order.create({
      customerName,
      phone,
      email,
      deliveryAddress,
      orderNote: orderNote || '',
      items: validatedItems,
      subtotal: computedSubtotal,
      status: 'pending',
      paystackReference: reference,
      affiliateId,
      referralCode,
      commissionRate,
      commissionAmount,
      commissionStatus,
    })

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 })
    }

    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const callbackUrl = `${protocol}://${host}/order-confirmation?reference=${reference}`

    const amountInKobo = Math.round(computedSubtotal * 100)

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || customerName.replace(/\s+/g, '.').toLowerCase() + '@shapewear-closet.local',
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialize error', paystackData)
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
      reference,
    })
  } catch (error) {
    console.error('Checkout initiate error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
