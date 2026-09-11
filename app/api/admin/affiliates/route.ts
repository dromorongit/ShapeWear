import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { requireAdmin } from '@/lib/admin'
import { getPagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()
  const { page, limit, skip } = getPagination(request, { defaultLimit: 50, maxLimit: 200 })

  const [affiliates, totalCount] = await Promise.all([
    Affiliate.aggregate([
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'pending'] }, then: 0 },
                { case: { $eq: ['$status', 'approved'] }, then: 1 },
                { case: { $eq: ['$status', 'rejected'] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      { $sort: { statusPriority: 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]).exec(),
    Affiliate.countDocuments({}),
  ])

  return NextResponse.json({
    data: affiliates.map((a: Record<string, unknown>) => ({
      ...a,
      id: (a._id as { toString(): string }).toString(),
    })),
    meta: {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
  })
}
