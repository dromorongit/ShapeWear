'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const tempPassword = process.env.NEXT_PUBLIC_ADMIN_TEMP_PASSWORD

    if (!tempPassword) {
      setError('Admin password is not configured on the server.')
      return
    }

    if (password === tempPassword) {
      sessionStorage.setItem('adminAuth', 'true')
      router.replace('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-soft">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Admin Login
          </h1>
          <p className="mt-2 font-body text-small text-ink/60">
            Enter the admin password to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            error={error}
          />
          <Button type="submit" fullWidth>
            Sign In
          </Button>
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
