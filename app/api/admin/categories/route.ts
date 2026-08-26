import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Category from '@/lib/db/models/Category'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const categories = await Category.find({})
    .lean()
    .select('name slug')
    .exec()

  return NextResponse.json(
    categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    }))
  )
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const body = await request.json()

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
  }

  const existing = await Category.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
    .lean()
    .exec()
  if (existing) {
    return NextResponse.json(
      { error: 'A category with this name already exists' },
      { status: 409 }
    )
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const category = new Category({ name, slug })
  await category.save()

  return NextResponse.json(
    {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    },
    { status: 201 }
  )
}
