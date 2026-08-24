import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const stats = [
  { label: 'Total Products', value: '24' },
  { label: 'Pending Reviews', value: '3' },
  { label: 'Total Orders', value: '0' },
  { label: 'Low Stock Alerts', value: '5' },
]

export default function AdminDashboardPage() {
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
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => {
              window.location.href = '/admin/products/new'
            }}>
              Add Product
            </Button>
            <Button variant="secondary" onClick={() => {
              window.location.href = '/admin/reviews'
            }}>
              Moderate Reviews
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
