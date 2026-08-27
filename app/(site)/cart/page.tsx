'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/formatCurrency'

const CartPage = () => {
  const { state, removeItem, updateQuantity, subtotal, totalItems } = useCart()

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-h1 font-semibold text-ink">Your Cart</h1>
        <p className="mt-2 font-body text-body text-ink/60">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>

        {state.items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <p className="font-body text-body text-ink/60">Your cart is empty</p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="space-y-4">
                {state.items.map((item) => (
                  <li key={item.sku} className="flex gap-4 border-b border-ink/5 pb-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-blush">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body font-medium text-ink truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-small text-ink/60">
                        {item.shape} / {item.size}
                      </p>
                       <p className="font-mono text-small text-ink">
                         {formatCurrency(item.price)}
                       </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/10 text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="font-body text-small text-ink w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/10 text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.sku)}
                          className="font-body text-small text-pink hover:text-pink/80"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-md border border-ink/5 bg-white p-6 shadow-soft">
                <h2 className="font-display text-h3 font-semibold text-ink mb-4">Order Summary</h2>
                <div className="flex items-center justify-between">
                  <span className="font-body text-body font-medium text-ink">Subtotal</span>
                  <span className="font-mono text-price text-ink">{formatCurrency(subtotal)}</span>
                </div>
                <p className="mt-2 font-body text-small text-ink/50">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="mt-3 block text-center font-body text-base font-medium text-pink hover:text-pink/80"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
