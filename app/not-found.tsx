import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found - Shapewear Closet',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono text-small text-pink uppercase tracking-wider">404</p>
        <h1 className="mt-4 font-display text-h1 font-semibold text-ink">Page not found</h1>
        <p className="mt-4 font-body text-body text-ink/60 max-w-md mx-auto">
          Sorry, we could not find the page you are looking for. It may have been removed, renamed, or does not exist.
        </p>
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}