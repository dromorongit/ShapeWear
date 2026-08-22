'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BUSINESS_NAME } from '@/lib/constants'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/5 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Shapewear Closet Home">
          <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/Shapewearlogo.jpg"
                alt={BUSINESS_NAME}
                width={32}
                height={32}
                priority
                className="h-full w-full object-contain"
              />
          </div>
          <span className="font-display text-lg font-semibold text-ink">
            {BUSINESS_NAME}
          </span>
        </Link>

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            aria-label="Open cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-xs font-medium text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <details className="md:hidden">
            <summary className="list-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </summary>
            <nav className="absolute left-0 right-0 top-full border-b border-ink/5 bg-white px-4 py-4 shadow-sm" aria-label="Mobile">
              <ul className="flex flex-col gap-4">
                <li><Link href="/" className="font-body text-body font-medium text-ink/70 hover:text-pink">Home</Link></li>
                <li><Link href="/shop" className="font-body text-body font-medium text-ink/70 hover:text-pink">Shop</Link></li>
                <li><Link href="/about" className="font-body text-body font-medium text-ink/70 hover:text-pink">About</Link></li>
                <li><Link href="/contact" className="font-body text-body font-medium text-ink/70 hover:text-pink">Contact</Link></li>
              </ul>
            </nav>
          </details>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

export default Header
