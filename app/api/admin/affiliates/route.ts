import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  await connectDb()

  const affiliates = await Affiliate.aggregate([
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
  ]).exec()

  return NextResponse.json(
    affiliates.map((a: Record<string, unknown>) => ({
      ...a,
      id: (a._id as { toString(): string }).toString(),
    }))
  )
}
