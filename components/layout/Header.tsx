'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { BUSINESS_NAME } from '@/lib/constants'
import { FaShoppingCart } from 'react-icons/fa'
import SearchBar from '@/components/layout/SearchBar'

const Header = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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
          <SearchBar />

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            aria-label="Open cart"
          >
            <FaShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-[11px] font-medium text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden border-b border-ink/5 bg-white px-4 py-4 shadow-sm" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            <li><Link href="/" className="font-body text-body font-medium text-ink/70 hover:text-pink">Home</Link></li>
            <li><Link href="/shop" className="font-body text-body font-medium text-ink/70 hover:text-pink">Shop</Link></li>
            <li><Link href="/about" className="font-body text-body font-medium text-ink/70 hover:text-pink">About</Link></li>
            <li><Link href="/contact" className="font-body text-body font-medium text-ink/70 hover:text-pink">Contact</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
