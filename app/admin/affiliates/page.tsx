import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import AffiliateTableClient from './AffiliateTableClient'

interface AffiliateRow {
  id: string
  name: string
  email: string
  referralCode: string
  status: 'pending' | 'approved' | 'rejected'
  commissionRate: number
  totalClicks: number
  totalSales: number
  totalCommissionEarned: number
  totalCommissionPaid: number
  createdAt: string
}

export const dynamic = 'force-dynamic'

export default async function AdminAffiliatesPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Affiliates
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Manage affiliate applications and payouts.
        </p>
      </div>
      <AffiliateTableClient
        affiliates={affiliates.map((a: Record<string, unknown>) => ({
          id: (a._id as { toString(): string }).toString(),
          name: String(a.name ?? ''),
          email: String(a.email ?? ''),
          referralCode: String(a.referralCode ?? ''),
          status: (a.status as AffiliateRow['status']) || 'pending',
          commissionRate: Number(a.commissionRate ?? 0),
          totalClicks: Number(a.totalClicks ?? 0),
          totalSales: Number(a.totalSales ?? 0),
          totalCommissionEarned: Number(a.totalCommissionEarned ?? 0),
          totalCommissionPaid: Number(a.totalCommissionPaid ?? 0),
          createdAt: (a.createdAt as Date).toISOString(),
        })) as AffiliateRow[]}
      />
    </div>
  )
}
