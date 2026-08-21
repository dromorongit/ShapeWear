'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { state, removeItem, updateQuantity, subtotal, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]" aria-hidden={!isOpen}>
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-ink/5 bg-white shadow-soft flex flex-col">
        <div className="flex items-center justify-between border-b border-ink/5 px-4 py-4">
          <h2 className="font-display text-h3 font-semibold text-ink">
            Your Cart ({totalItems})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-body text-body text-ink/60">Your cart is empty</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 font-body text-base font-medium text-pink hover:text-pink/80"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => (
                <li key={item.sku} className="flex gap-4 border-b border-ink/5 pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-blush">
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
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
                      GHS {item.price}
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
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-ink/5 px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-body font-medium text-ink">Subtotal</span>
              <span className="font-mono text-price text-ink">GHS {subtotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
