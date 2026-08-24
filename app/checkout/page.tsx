'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface FormErrors {
  fullName?: string
  phone?: string
  email?: string
  deliveryAddress?: string
}

const validateEmail = (value: string) => {
  if (!value) return undefined
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) ? undefined : 'Enter a valid email address'
}

const validatePhone = (value: string) => {
  if (!value) return 'Phone number is required'
  const pattern = /^(0[0-9]{9}|\+233[0-9]{9})$/
  return pattern.test(value) ? undefined : 'Enter a valid Ghanaian phone number'
}

const CheckoutPage = () => {
  const router = useRouter()
  const { state, subtotal } = useCart()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    note: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (state.items.length === 0) {
      router.replace('/')
    }
  }, [state.items.length, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    const phoneError = validatePhone(form.phone)
    if (phoneError) newErrors.phone = phoneError

    if (form.email) {
      const emailError = validateEmail(form.email)
      if (emailError) newErrors.email = emailError
    }

    if (!form.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await fetch('/api/checkout/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: form.fullName,
          phone: form.phone,
          email: form.email,
          deliveryAddress: form.deliveryAddress,
          orderNote: form.note,
          items: state.items.map((item) => ({ sku: item.sku, quantity: item.quantity })),
          subtotal,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setApiError(data.error || 'Failed to initiate checkout')
        setIsSubmitting(false)
        return
      }

      sessionStorage.setItem('deliveryDetails', JSON.stringify(form))
      window.location.href = data.authorizationUrl
    } catch {
      setApiError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-body text-body text-ink/60">Your cart is empty. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-h1 font-semibold text-ink">Checkout</h1>
        <p className="mt-2 font-body text-body text-ink/60">
          Guest checkout — no account required.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
              <h2 className="font-display text-h3 font-semibold text-ink mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="233242711007"
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                />
                <Input
                  label="Delivery Address / Location"
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  error={errors.deliveryAddress}
                  required
                />
                <div className="w-full">
                  <label className="mb-1.5 block font-body text-small font-medium text-ink">
                    Order Note (optional)
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
              <h2 className="font-display text-h3 font-semibold text-ink mb-4">Order Summary</h2>
              <ul className="space-y-3">
                {state.items.map((item) => (
                  <li key={item.sku} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-blush">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body font-medium text-ink truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-small text-ink/60">
                        {item.shape} / {item.size} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-small text-ink">
                      GHS {item.price * item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4">
                <span className="font-body text-body font-medium text-ink">Subtotal</span>
                <span className="font-mono text-price text-ink">GHS {subtotal}</span>
              </div>
            </div>

            <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
              <h2 className="font-display text-h3 font-semibold text-ink mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 rounded-md border border-pink/30 bg-blush/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-body font-medium text-ink">Pay with Paystack</p>
                  <p className="font-body text-small text-ink/60">Secure payment via card or mobile money</p>
                </div>
              </div>
              {apiError && (
                <p className="mt-2 font-body text-small text-red-600">{apiError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
            <Link
              href="/"
              className="block text-center font-body text-base font-medium text-pink hover:text-pink/80"
            >
              Continue Shopping
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage

