import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import Product from '@/lib/db/models/Product'
import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const body = await request.json()
  const { status } = body

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const existingReview = await Review.findById(params.id).lean().exec()
  if (!existingReview) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  const previousStatus = existingReview.status
  const shouldRecalculate = status === 'approved' || previousStatus === 'approved'

  const review = await Review.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  )
    .lean()
    .exec()

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  if (shouldRecalculate) {
    const stats = await Review.aggregate([
      { $match: { productId: existingReview.productId, status: 'approved' } },
      {
        $group: {
          _id: '$productId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])

    const productUpdate: { averageRating: number; reviewCount: number } = {
      averageRating: 0,
      reviewCount: 0,
    }
    if (stats.length > 0) {
      productUpdate.averageRating = Math.round(stats[0].averageRating * 10) / 10
      productUpdate.reviewCount = stats[0].reviewCount
    }

    await Product.findByIdAndUpdate(existingReview.productId, productUpdate)
  }

  if (status === 'approved') {
    const product = await Product.findById(review.productId).lean().exec()
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`)
    }
  }

  return NextResponse.json({
    ...review,
    id: review._id.toString(),
    productId: review.productId.toString(),
  })
}
