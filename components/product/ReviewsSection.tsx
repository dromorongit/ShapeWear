import { mockReviews } from '@/lib/mockReviews'
import ReviewForm from './ReviewForm'
import { MockProduct } from '@/lib/mockProducts'

interface ReviewsSectionProps {
  product: MockProduct
}

const ReviewsSection = ({ product }: ReviewsSectionProps) => {
  const approvedReviews = mockReviews.filter(
    (review) => review.productId === product.id && review.status === 'approved'
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#F0B429' : 'none'}
            stroke={star <= rating ? '#F0B429' : '#0B0B0D'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-h2 font-semibold text-ink">Reviews</h2>

        {approvedReviews.length === 0 ? (
          <p className="mt-4 font-body text-body text-ink/60">No reviews yet. Be the first to share your experience.</p>
        ) : (
          <div className="mt-8 space-y-8">
            {approvedReviews.map((review) => (
              <div key={review.id} className="border-b border-ink/5 pb-8 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-h3 font-semibold text-ink">{review.reviewerName}</p>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>
                  <time className="font-body text-small text-ink/50" dateTime={review.createdAt}>
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <p className="mt-3 font-body text-body text-ink/80">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h3 className="font-display text-h3 font-semibold text-ink">Write a Review</h3>
          <p className="mt-1 font-body text-small text-ink/60">Your review will be published after moderation.</p>
          <div className="mt-6">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
