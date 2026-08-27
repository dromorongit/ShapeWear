import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const products = await Product.find({})
    .lean()
    .select(
      'slug name mainImage price salePrice stock stockStatus variants isActive isFeatured category tags description shortDescription additionalImages shapes sizes'
    )
    .exec()

  return NextResponse.json(
    products.map((p) => ({
      ...p,
      id: p._id.toString(),
    }))
  )
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const body = await request.json()

  const {
    name,
    slug,
    description,
    shortDescription,
    price,
    salePrice,
    stock,
    category,
    mainImage,
    variants,
    isActive,
    isFeatured,
    tags,
  } = body

  const missingFields = []
  if (!name) missingFields.push('name')
  if (!slug) missingFields.push('slug')
  if (!description) missingFields.push('description')
  if (!shortDescription) missingFields.push('shortDescription')
  if (!price) missingFields.push('price')
  if (!stock && stock !== 0) missingFields.push('stock')
  if (!category) missingFields.push('category')
  if (!mainImage) missingFields.push('mainImage')

  if (missingFields.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 })
  }

  const safeVariants = Array.isArray(variants) ? variants : []

  let finalSlug = String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  let counter = 2
  while (await Product.exists({ slug: finalSlug })) {
    finalSlug = `${String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${counter}`
    counter++
  }

  const shapes = Array.from(new Set(safeVariants.map((v: { shape: string }) => v.shape)))
  const sizes = Array.from(new Set(safeVariants.map((v: { size: string }) => v.size)))
  const totalStock = safeVariants.reduce((sum: number, v: { stock: number }) => sum + (Number(v.stock) || 0), 0)
  const stockStatus = totalStock === 0 ? 'out-of-stock' : totalStock <= 5 ? 'low-stock' : 'in-stock'

  const product = new Product({
    name,
    slug: finalSlug,
    description,
    shortDescription,
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : null,
    stock: Number(stock),
    category,
    mainImage,
    variants: safeVariants,
    isActive: isActive ?? true,
    isFeatured: isFeatured ?? false,
    tags: tags ? String(tags).split(',').map((t: string) => t.trim()) : [],
    shapes,
    sizes,
    stockStatus,
  })

  await product.save()
  return NextResponse.json({ id: product._id.toString() }, { status: 201 })
}
