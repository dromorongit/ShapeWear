import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const reviews = await Review.find({})
    .lean()
    .select('_id productId reviewerName rating comment status createdAt')
    .sort({ createdAt: -1 })
    .exec()

  return NextResponse.json(
    reviews.map((r) => ({
      ...r,
      id: r._id.toString(),
      productId: r.productId.toString(),
    }))
  )
}
