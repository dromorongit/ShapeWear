import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Review from '@/lib/db/models/Review'
import { requireAdmin } from '@/lib/admin'
import { getPagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const { page, limit, skip } = getPagination(request, { defaultLimit: 50, maxLimit: 200 })

  const [reviews, totalCount] = await Promise.all([
    Review.find({})
      .lean()
      .select('_id productId reviewerName rating comment status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec(),
    Review.countDocuments({}),
  ])

  return NextResponse.json({
    data: reviews.map((r) => ({
      ...r,
      id: r._id.toString(),
      productId: r.productId.toString(),
    })),
    meta: {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
  })
}
