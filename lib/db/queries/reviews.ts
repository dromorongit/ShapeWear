import { Types } from 'mongoose'
import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import type { MockReview } from '@/lib/mockReviews'

interface RawReview {
  _id: Types.ObjectId
  productId: Types.ObjectId
  reviewerName: string
  rating: number
  comment: string
  status: 'approved' | 'pending' | 'rejected'
  createdAt: Date
}

function toReview(doc: RawReview): MockReview {
  return {
    id: doc._id.toString(),
    productId: doc.productId.toString(),
    reviewerName: doc.reviewerName,
    rating: doc.rating as MockReview['rating'],
    comment: doc.comment,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function getApprovedReviewsForProduct(productId: string): Promise<MockReview[]> {
  await connectDb()
  const docs = (await Review.find({ productId, status: 'approved' })
    .lean()
    .select('_id productId reviewerName rating comment status createdAt')
    .sort({ createdAt: -1 })
    .exec()) as unknown as RawReview[]
  return docs.map(toReview)
}

export async function getPendingReviews(): Promise<MockReview[]> {
  await connectDb()
  const docs = (await Review.find({ status: 'pending' })
    .lean()
    .select('_id productId reviewerName rating comment status createdAt')
    .sort({ createdAt: -1 })
    .exec()) as unknown as RawReview[]
  return docs.map(toReview)
}
