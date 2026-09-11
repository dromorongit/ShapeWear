import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import ReviewTableClient from './ReviewTableClient'
import { getPagination } from '@/lib/pagination'

type ReviewAggResult = {
  _id: { toString(): string }
  productId: { toString(): string }
  reviewerName: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  productName?: string
}

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await connectDb()
  const { page, limit, skip } = getPagination(await searchParams, { defaultLimit: 50, maxLimit: 200 })

  const [reviews, totalCount] = await Promise.all([
    Review.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $addFields: { productName: '$product.name' } },
      { $project: { product: 0 } },
    ]).exec(),
    Review.countDocuments({}),
  ])

  const typedReviews = reviews as ReviewAggResult[]

  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Reviews
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Moderate customer reviews and feedback.
        </p>
      </div>
      <ReviewTableClient
        reviews={typedReviews.map((r) => ({
          ...r,
          id: r._id.toString(),
          productId: r.productId.toString(),
          productName: String(r.productName ?? 'Unknown Product'),
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        }))}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="font-body text-small text-ink/60">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/reviews?page=${page - 1}`}
                className="font-body text-small text-pink hover:underline"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/reviews?page=${page + 1}`}
                className="font-body text-small text-pink hover:underline"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
