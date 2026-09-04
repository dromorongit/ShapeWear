import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Order from '@/lib/db/models/Order'

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    await connectDb()

    const order = await Order.findOne({ paystackReference: params.reference })
      .select('status items subtotal customerName')
      .lean()
      .exec()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: order.status,
      orderId: order._id.toString(),
      customerName: order.customerName,
      items: order.items.map((item) => ({
        productName: item.productName,
        slug: item.slug,
        mainImage: item.mainImage,
        shape: item.shape,
        size: item.size,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
    })
  } catch (error) {
    console.error('Checkout status error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
