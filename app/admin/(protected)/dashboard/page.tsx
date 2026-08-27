import { connectDb } from '@/lib/db/connect'
import Product from '@/lib/db/models/Product'
import Review from '@/lib/db/models/Review'
import Order from '@/lib/db/models/Order'
import Card from '@/components/ui/Card'
import AdminDashboardActions from './AdminDashboardActions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await connectDb()

  const [totalProducts, pendingReviews, totalOrders, lowStockAlerts] =
    await Promise.all([
      Product.countDocuments().exec(),
      Review.countDocuments({ status: 'pending' }).exec(),
      Order.countDocuments().exec(),
      Product.countDocuments({ stockStatus: 'low-stock' }).exec(),
    ])

  const stats = [
    { label: 'Total Products', value: String(totalProducts) },
    { label: 'Pending Reviews', value: String(pendingReviews) },
    { label: 'Total Orders', value: String(totalOrders) },
    { label: 'Low Stock Alerts', value: String(lowStockAlerts) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Dashboard
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Overview of your store at a glance.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="font-body text-small text-ink/60">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            Recent Activity
          </h3>
          <p className="mt-2 font-body text-small text-ink/60">
            No real activity yet. This will populate once orders and reviews are
            connected in later phases.
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            Quick Actions
          </h3>
          <AdminDashboardActions />
        </Card>
      </div>
    </div>
  )
}
