'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AffiliateRegisterForm from '@/components/affiliate/AffiliateRegisterForm'

function RegisterContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  if (success) {
    return (
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-soft text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Registration Submitted
        </h1>
        <p className="mt-4 font-body text-small text-ink/70">
          Thanks for registering! Your account is pending approval. You will be able
          to log in and access your referral link once approved.
        </p>
        <div className="mt-6">
          <a
            href="/affiliate/login"
            className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return <AffiliateRegisterForm />
}

export default function AffiliateRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-soft text-center">
            <p className="font-body text-small text-ink/60">Loading...</p>
          </div>
        }
      >
        <RegisterContent />
      </Suspense>
    </div>
  )
}
