'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { BUSINESS_NAME, PHONE } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatCurrency'

interface DeliveryDetails {
  fullName: string
  phone: string
  email: string
  deliveryAddress: string
  note: string
}

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'not_found'

interface OrderStatusResponse {
  status: PaymentStatus
  orderId: string
  customerName: string
  phone: string
  email?: string
  deliveryAddress: string
  items: Array<{
    productName: string
    slug: string
    mainImage: string
    shape: string
    size: string
    sku: string
    price: number
    quantity: number
  }>
  subtotal: number
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || ''
  const { state, clearCart } = useCart()
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    const stored = sessionStorage.getItem('deliveryDetails')
    if (stored) {
      try {
        setDeliveryDetails(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
  }, [])

  const fetchStatus = useCallback(async () => {
    if (!reference) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/checkout/status/${encodeURIComponent(reference)}`)
      if (!res.ok) {
        setOrderStatus({ status: 'not_found', orderId: '', customerName: '', phone: '', deliveryAddress: '', items: [], subtotal: 0 })
        setLoading(false)
        return
      }
      const data = (await res.json()) as OrderStatusResponse
      setOrderStatus(data)

      if (data.status === 'paid') {
        setLoading(false)
        clearCart()
        sessionStorage.removeItem('deliveryDetails')
      } else if (data.status === 'failed') {
        setLoading(false)
      } else {
        setPollCount((c) => c + 1)
      }
    } catch {
      setPollCount((c) => c + 1)
    }
  }, [reference, clearCart])

  useEffect(() => {
    if (!reference) {
      setLoading(false)
      return
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [reference, fetchStatus])

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const mappedCartItems = state.items.map((item) => ({
    productName: item.name,
    slug: item.slug,
    mainImage: item.mainImage,
    shape: item.shape,
    size: item.size,
    sku: item.sku,
    price: item.price,
    quantity: item.quantity,
  }))
  const displayItems = orderStatus?.items?.length ? orderStatus.items : mappedCartItems
  const displaySubtotal = orderStatus?.subtotal ?? subtotal

  const whatsappMessage = encodeURIComponent(
    `Hello ${BUSINESS_NAME}, I just placed an order.\n\nOrder ID: ${orderStatus?.orderId || reference}\n\nItems:\n${displayItems.map(item => {
      const variant = item.shape && item.size ? ` (${item.shape}/${item.size})` : ''
      return `- ${item.productName}${variant} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
    }).join('\n')}\n\nSubtotal: ${formatCurrency(displaySubtotal)}\n\nDelivery to: ${orderStatus?.deliveryAddress || deliveryDetails?.deliveryAddress || 'N/A'}\n\nPlease confirm my order.`
  )

  const whatsappUrl = `https://wa.me/${PHONE}?text=${whatsappMessage}`

  if (loading && pollCount === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-body text-body text-ink/60">Loading order status...</p>
      </div>
    )
  }

  if (orderStatus?.status === 'paid') {
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
              Thank you for your order! Your order ID is <span className="font-mono text-pink">{orderStatus.orderId}</span>
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
              <h2 className="font-display text-h3 font-semibold text-ink mb-4">Order Summary</h2>
              {displayItems.length === 0 ? (
                <p className="font-body text-small text-ink/60">Your cart was empty.</p>
              ) : (
                <ul className="space-y-3">
                  {displayItems.map((item) => (
                    <li key={item.sku} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-blush">
                        <Image
                          src={item.mainImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-body text-body font-medium text-ink truncate">
                           {item.productName}
                         </p>
                         {item.shape && item.size && (
                           <p className="font-body text-small text-ink/60">
                             {item.shape} / {item.size} x {item.quantity}
                           </p>
                         )}
                       </div>
                       <p className="font-mono text-small text-ink">
                         {formatCurrency(item.price * item.quantity)}
                       </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4">
                <span className="font-body text-body font-medium text-ink">Subtotal</span>
                 <span className="font-mono text-price text-ink">{formatCurrency(displaySubtotal)}</span>
              </div>
            </div>

            <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
              <h2 className="font-display text-h3 font-semibold text-ink mb-4">Delivery Details</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="font-body text-small text-ink/60">Full Name</dt>
                  <dd className="font-body text-body text-ink">{orderStatus.customerName}</dd>
                </div>
                <div>
                  <dt className="font-body text-small text-ink/60">Phone</dt>
                  <dd className="font-body text-body text-ink">{orderStatus.phone}</dd>
                </div>
                {orderStatus.email && (
                  <div>
                    <dt className="font-body text-small text-ink/60">Email</dt>
                    <dd className="font-body text-body text-ink">{orderStatus.email}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-body text-small text-ink/60">Delivery Address</dt>
                  <dd className="font-body text-body text-ink">{orderStatus.deliveryAddress}</dd>
                </div>
              </dl>
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

  if (orderStatus?.status === 'failed') {
    return (
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-h1 font-semibold text-ink">Payment Failed</h1>
          <p className="mt-2 font-body text-body text-ink/60">
            Your payment could not be processed. Please try again.
          </p>
          <Link
            href="/checkout"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Retry Checkout
          </Link>
        </div>
      </div>
    )
  }

  if (orderStatus?.status === 'not_found') {
    return (
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-h1 font-semibold text-ink">Order Not Found</h1>
          <p className="mt-2 font-body text-body text-ink/60">
            We could not find this order. Please contact support if you believe this is an error.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-h1 font-semibold text-ink">Confirming your payment...</h1>
        <p className="mt-2 font-body text-body text-ink/60">
          Please wait while we verify your payment. This usually takes a few seconds.
        </p>
        {pollCount >= 5 && (
          <p className="mt-4 font-body text-small text-ink/60">
            This is taking longer than expected. We will confirm your order via WhatsApp shortly.
          </p>
        )}
        <div className="mt-8">
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

