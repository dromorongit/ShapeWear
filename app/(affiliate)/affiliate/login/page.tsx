'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AffiliateLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/affiliate/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('Incorrect email or password. Please try again.')
        return
      }

      router.replace('/affiliate/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-soft">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Affiliate Login
          </h1>
          <p className="mt-2 font-body text-small text-ink/60">
            Log in to access your dashboard.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            error={error}
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          {error && (
            <p className="text-center font-body text-small text-red-600">{error}</p>
          )}
        </form>
        <p className="mt-4 text-center font-body text-small text-ink/50">
          <a href="/" className="text-pink hover:underline">
            Back to shop
          </a>
        </p>
      </div>
    </div>
  )
}
