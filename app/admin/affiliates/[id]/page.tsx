import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import AffiliatePayout from '@/lib/db/models/AffiliatePayout'
import AffiliateDetailClient from './AffiliateDetailClient'

export const dynamic = 'force-dynamic'

export default async function AdminAffiliateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await connectDb()

  const affiliate = await Affiliate.findById(params.id).lean().exec()

  if (!affiliate) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Affiliate Not Found</h2>
        <p className="font-body text-small text-ink/60">The requested affiliate does not exist.</p>
      </div>
    )
  }

  const payouts = await AffiliatePayout.find({ affiliateId: params.id })
    .lean()
    .sort({ paidAt: -1 })
    .exec()

  return (
    <div className="space-y-6">
      <AffiliateDetailClient
        affiliate={{
          ...affiliate,
          id: affiliate._id.toString(),
          createdAt: affiliate.createdAt instanceof Date ? affiliate.createdAt.toISOString() : String(affiliate.createdAt),
        }}
        payouts={payouts.map((p) => ({
          ...p,
          id: p._id.toString(),
          affiliateId: p.affiliateId.toString(),
          paidAt: p.paidAt instanceof Date ? p.paidAt.toISOString() : String(p.paidAt),
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
          updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
          note: p.note || '',
        }))}
      />
    </div>
  )
}
