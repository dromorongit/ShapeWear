'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface ReviewRow {
  id: string
  reviewerName: string
  rating: number
  comment: string
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
  productName: string
}

export default function ReviewTableClient({ reviews }: { reviews: ReviewRow[] }) {
  const [reviewList, setReviewList] = useState<ReviewRow[]>(reviews)

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )

    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {
      setReviewList(reviews)
    })
  }

  const pendingCount = reviewList.filter((r) => r.status === 'pending').length
  const approvedCount = reviewList.filter((r) => r.status === 'approved').length
  const rejectedCount = reviewList.filter((r) => r.status === 'rejected').length

  const statusVariant: Record<string, 'inStock' | 'lowStock' | 'outOfStock'> = {
    approved: 'inStock',
    pending: 'lowStock',
    rejected: 'outOfStock',
  }

  return (
    <>
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

      {/* Mobile: stacked cards */}
      <Card className="overflow-hidden">
        <div className="block md:hidden">
          {reviewList.length === 0 ? (
            <p className="p-6 font-body text-small text-ink/50">No reviews yet.</p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {reviewList.map((review) => (
                <li key={review.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-body text-body font-medium text-ink">
                        {review.reviewerName}
                      </p>
                      <p className="font-body text-small text-ink/50">
                        {review.productName}
                      </p>
                    </div>
                    <Badge variant={statusVariant[review.status] || 'lowStock'}>
                      {review.status}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <span className="font-body text-small text-ink/70">
                      {'★'.repeat(review.rating)}
                      <span className="text-ink/40">
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </span>
                  </div>
                  <p className="font-body text-small text-ink/70 mb-3">
                    {review.comment}
                  </p>
                  <p className="font-body text-xss text-ink/50 mb-3">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ''}
                  </p>
                  <div className="flex flex-col gap-2 pt-2 border-t border-ink/5">
                    <Button
                      size="sm"
                      className="min-h-[44px]"
                      onClick={() => updateStatus(review.id, 'approved')}
                      disabled={review.status === 'approved'}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 min-h-[44px]"
                      onClick={() => updateStatus(review.id, 'rejected')}
                      disabled={review.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
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
            {reviewList.map((review) => (
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
                    {review.productName}
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
            ))}
          </tbody>
        </table>
      </div>
      </Card>
    </>
  )
}
