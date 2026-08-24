import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import Product from '@/lib/db/models/Product'
import ReviewTableClient from './ReviewTableClient'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  await connectDb()
  const reviews = await Review.find({})
    .lean()
    .select('_id productId reviewerName rating comment status createdAt')
    .sort({ createdAt: -1 })
    .exec()

  const products = await Product.find({})
    .lean()
    .select('_id name')
    .exec()

  const productMap = new Map(products.map((p) => [p._id.toString(), p.name]))

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
        reviews={reviews.map((r) => ({
          ...r,
          id: r._id.toString(),
          productId: r.productId.toString(),
          productName: productMap.get(r.productId.toString()) ?? 'Unknown Product',
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        }))}
      />
    </div>
  )
}
