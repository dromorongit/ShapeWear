'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-small text-pink uppercase tracking-wider">Something went wrong</p>
        <h1 className="mt-4 font-display text-h1 font-semibold text-ink">Unexpected error</h1>
        <p className="mt-4 font-body text-body text-ink/60 max-w-md mx-auto">
          We are sorry, something unexpected happened. Please try again or return to the shop.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md border border-ink/10 bg-white px-6 py-3 font-body text-base font-medium text-ink transition-colors hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}