import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connectDb } from '@/lib/db/connect'
import Affiliate from '@/lib/db/models/Affiliate'
import { verifyAffiliateToken } from '@/lib/auth'
import Card from '@/components/ui/Card'
import CopyLinkButton from '@/components/affiliate/CopyLinkButton'

export const dynamic = 'force-dynamic'

export default async function AffiliateDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('affiliate_session')?.value

  if (!token) {
    redirect('/affiliate/login')
  }

  let payload: { affiliateId: string; role: string }
  try {
    payload = await verifyAffiliateToken(token)
  } catch {
    redirect('/affiliate/login')
  }

  await connectDb()
  const affiliate = await Affiliate.findById(payload.affiliateId).lean().exec()

  if (!affiliate) {
    redirect('/affiliate/login')
  }

  if (affiliate.status === 'pending') {
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Dashboard
        </h2>
        <Card className="mt-6 p-6 text-center">
          <p className="font-body text-body text-ink/70">
            Your account is pending approval. You will be able to access your
            referral link and stats once an admin reviews your application.
          </p>
        </Card>
      </div>
    )
  }

  if (affiliate.status === 'rejected') {
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Dashboard
        </h2>
        <Card className="mt-6 p-6 text-center">
          <p className="font-body text-body text-ink/70">
            Your affiliate application has been rejected. If you believe this
            was a mistake, please contact support.
          </p>
        </Card>
      </div>
    )
  }

  const pendingBalance =
    (affiliate.totalCommissionEarned || 0) - (affiliate.totalCommissionPaid || 0)

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="font-display text-2xl font-semibold text-ink">
        Dashboard
      </h2>
      <p className="mt-1 font-body text-small text-ink/60">
        Welcome back, {affiliate.name}
      </p>

      <div className="mt-6">
        <h3 className="font-display text-lg font-semibold text-ink">
          Your Referral Link
        </h3>
        <p className="mt-1 font-body text-small text-ink/60">
          Share this link to earn commissions on qualifying purchases.
        </p>
        <div className="mt-3">
          <CopyLinkButton code={affiliate.referralCode} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">Total Clicks</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            {affiliate.totalClicks || 0}
          </p>
        </Card>
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">Total Sales</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            {affiliate.totalSales || 0}
          </p>
        </Card>
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">
            Commission Earned
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            GH₵{affiliate.totalCommissionEarned || 0}
          </p>
        </Card>
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">Commission Paid</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            GH₵{affiliate.totalCommissionPaid || 0}
          </p>
        </Card>
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">Pending Balance</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            GH₵{pendingBalance}
          </p>
        </Card>
        <Card className="p-5">
          <p className="font-body text-small text-ink/60">Commission Rate</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            {affiliate.commissionRate || 10}%
          </p>
        </Card>
      </div>
    </div>
  )
}
