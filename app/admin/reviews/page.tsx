'use client'

import { useAdminAuth } from '@/components/admin/useAdminAuth'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { mockReviews } from '@/lib/mockReviews'
import { mockProducts } from '@/lib/mockProducts'

export default function AdminReviewsPage() {
  useAdminAuth()
  const [reviews, setReviews] = useState(mockReviews)

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Reviews
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Moderate customer reviews and feedback.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Pending</p>
          <p className="mt-1 font-display text-2xl font-semibold text-gold">
            {pendingCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Approved</p>
          <p className="mt-1 font-display text-2xl font-semibold text-green-600">
            {approvedCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Rejected</p>
          <p className="mt-1 font-display text-2xl font-semibold text-red-600">
            {rejectedCount}
          </p>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Reviewer
                </th>
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Product
                </th>
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Rating
                </th>
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Comment
                </th>
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Status
                </th>
                <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {reviews.map((review) => {
                const product = mockProducts.find((p) => p.id === review.productId)
                return (
                  <tr key={review.id} className="hover:bg-blush/50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-body text-body font-medium text-ink">
                        {review.reviewerName}
                      </span>
                      <span className="block font-body text-small text-ink/50">
                        {review.createdAt}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-small text-ink/70">
                        {product?.name ?? 'Unknown Product'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-small text-ink/70">
                        {'★'.repeat(review.rating)}{' '}
                        <span className="text-ink/40">
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="font-body text-small text-ink/70 truncate">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          review.status === 'approved'
                            ? 'inStock'
                            : review.status === 'rejected'
                            ? 'outOfStock'
                            : 'lowStock'
                        }
                      >
                        {review.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatus(review.id, 'approved')}
                          disabled={review.status === 'approved'}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => updateStatus(review.id, 'rejected')}
                          disabled={review.status === 'rejected'}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
