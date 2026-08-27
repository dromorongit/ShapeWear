'use client'

import Button from '@/components/ui/Button'

export default function AdminDashboardActions() {
  return (
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
  )
}
