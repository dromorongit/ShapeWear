import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Category from '@/lib/db/models/Category'
import Product from '@/lib/db/models/Product'
import { requireAdmin } from '@/lib/admin'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const category = await Category.findById(params.id).lean().exec()

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const productCount = await Product.countDocuments({ category: category.name }).exec()

  if (productCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${productCount} product${productCount === 1 ? '' : 's'} use this category` },
      { status: 409 }
    )
  }

  await Category.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
