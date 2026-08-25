'use client'

import { useState } from 'react'

interface ReviewFormProps {
  productId: string
}

const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className="p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= value ? '#F0B429' : 'none'}
            stroke={star <= value ? '#F0B429' : '#0B0B0D'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || rating === 0 || !comment.trim()) {
      setError('Please fill in all fields and select a rating.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          reviewerName: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit review. Please try again.')
        setIsSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-pink/20 bg-blush/50 p-6">
        <p className="font-body text-body text-ink">Thanks - your review will appear after approval.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="font-body text-body text-red-700">{error}</p>
        </div>
      )}
      <div>
        <label htmlFor={`review-name-${productId}`} className="mb-1.5 block font-body text-small font-medium text-ink">
          Name
        </label>
        <input
          id={`review-name-${productId}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
          placeholder="Your name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-body text-small font-medium text-ink">Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor={`review-comment-${productId}`} className="mb-1.5 block font-body text-small font-medium text-ink">
          Comment
        </label>
        <textarea
          id={`review-comment-${productId}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
          placeholder="Share your experience with this product..."
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default ReviewForm
