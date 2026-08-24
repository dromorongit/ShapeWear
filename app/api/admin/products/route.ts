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
      'slug name mainImage price salePrice stockStatus variants isActive isFeatured category tags description shortDescription additionalImages shapes sizes'
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
    category,
    mainImage,
    variants,
    isActive,
    isFeatured,
    tags,
  } = body

  if (!name || !slug || !description || !shortDescription || !price || !category || !mainImage || !variants) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let finalSlug = String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  let counter = 2
  while (await Product.exists({ slug: finalSlug })) {
    finalSlug = `${String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${counter}`
    counter++
  }

  const shapes = Array.from(new Set(variants.map((v: { shape: string }) => v.shape)))
  const sizes = Array.from(new Set(variants.map((v: { size: string }) => v.size)))

  const product = new Product({
    name,
    slug: finalSlug,
    description,
    shortDescription,
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : null,
    category,
    mainImage,
    variants,
    isActive: isActive ?? true,
    isFeatured: isFeatured ?? false,
    tags: tags ? String(tags).split(',').map((t: string) => t.trim()) : [],
    shapes,
    sizes,
  })

  await product.save()
  return NextResponse.json({ id: product._id.toString() }, { status: 201 })
}
