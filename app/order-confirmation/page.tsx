'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { BUSINESS_NAME, PHONE } from '@/lib/constants'

interface DeliveryDetails {
  fullName: string
  phone: string
  email: string
  deliveryAddress: string
  note: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || `ORD-${Date.now().toString(36).toUpperCase()}`
  const { state, clearCart } = useCart()
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('deliveryDetails')
    if (stored) {
      try {
        setDeliveryDetails(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
    clearCart()
    sessionStorage.removeItem('deliveryDetails')
  }, [clearCart])

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, I just placed an order.\n\nOrder ID: ${orderId}\n\nItems:\n${state.items.map(item => `- ${item.name} (${item.shape}/${item.size}) x${item.quantity} = GHS ${item.price * item.quantity}`).join('\n')}\n\nSubtotal: GHS ${subtotal}\n\nDelivery to: ${deliveryDetails?.deliveryAddress || 'N/A'}\n\nPlease confirm my order.`
  )

  const whatsappUrl = `https://wa.me/${PHONE}?text=${whatsappMessage}`

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12l5 5L20 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-h1 font-semibold text-ink">Order Confirmed</h1>
          <p className="mt-2 font-body text-body text-ink/60">
            Thank you for your order! Your order ID is <span className="font-mono text-pink">{orderId}</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
            <h2 className="font-display text-h3 font-semibold text-ink mb-4">Order Summary</h2>
            {state.items.length === 0 ? (
              <p className="font-body text-small text-ink/60">Your cart was empty.</p>
            ) : (
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
            )}
            <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4">
              <span className="font-body text-body font-medium text-ink">Subtotal</span>
              <span className="font-mono text-price text-ink">GHS {subtotal}</span>
            </div>
          </div>

          <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
            <h2 className="font-display text-h3 font-semibold text-ink mb-4">Delivery Details</h2>
            {deliveryDetails ? (
              <dl className="space-y-2">
                <div>
                  <dt className="font-body text-small text-ink/60">Full Name</dt>
                  <dd className="font-body text-body text-ink">{deliveryDetails.fullName}</dd>
                </div>
                <div>
                  <dt className="font-body text-small text-ink/60">Phone</dt>
                  <dd className="font-body text-body text-ink">{deliveryDetails.phone}</dd>
                </div>
                {deliveryDetails.email && (
                  <div>
                    <dt className="font-body text-small text-ink/60">Email</dt>
                    <dd className="font-body text-body text-ink">{deliveryDetails.email}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-body text-small text-ink/60">Delivery Address</dt>
                  <dd className="font-body text-body text-ink">{deliveryDetails.deliveryAddress}</dd>
                </div>
                {deliveryDetails.note && (
                  <div>
                    <dt className="font-body text-small text-ink/60">Note</dt>
                    <dd className="font-body text-body text-ink">{deliveryDetails.note}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="font-body text-small text-ink/60">No delivery details saved.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Confirm Order on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><p className="font-body text-body text-ink/60">Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
