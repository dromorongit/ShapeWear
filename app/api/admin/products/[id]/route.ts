import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import { requireAdmin } from '@/lib/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const product = await Product.findById(params.id).lean().exec()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...product,
    id: product._id.toString(),
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const body = await request.json()

  const product = await Product.findById(params.id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (body.slug && body.slug !== product.slug) {
    let finalSlug = String(body.slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    let counter = 2
    while (await Product.exists({ slug: finalSlug, _id: { $ne: product._id } })) {
      finalSlug = `${String(body.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${counter}`
      counter++
    }
    body.slug = finalSlug
  }

  if (body.price !== undefined) body.price = Number(body.price)
  if (body.salePrice !== undefined && body.salePrice !== '') {
    body.salePrice = Number(body.salePrice)
  } else if (body.salePrice === '') {
    body.salePrice = null
  }
  if (body.stock !== undefined) body.stock = Number(body.stock)

  if (body.variants) {
    body.shapes = Array.from(new Set(body.variants.map((v: { shape: string }) => v.shape)))
    body.sizes = Array.from(new Set(body.variants.map((v: { size: string }) => v.size)))
    const totalStock = body.variants.reduce((sum: number, v: { stock: number }) => sum + (Number(v.stock) || 0), 0)
    body.stockStatus = totalStock === 0 ? 'out-of-stock' : totalStock <= 5 ? 'low-stock' : 'in-stock'
  }

  if (body.tags && typeof body.tags === 'string') {
    body.tags = body.tags.split(',').map((t: string) => t.trim())
  }

  await Product.findByIdAndUpdate(params.id, body, { new: true })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const result = await Product.findByIdAndDelete(params.id)

  if (!result) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
