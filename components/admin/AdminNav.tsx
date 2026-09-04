'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaBars, FaTimes } from 'react-icons/fa'

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/affiliates', label: 'Affiliates' },
  { href: '/admin/settings', label: 'Settings' },
]

const linkClass =
  'flex items-center rounded-md px-3 py-3 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors'

const activeLinkClass =
  'flex items-center rounded-md px-3 py-3 font-body text-body font-medium text-pink bg-blush'

export default function AdminNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

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

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/affiliates')
      .then((res) => (res.ok ? res.json() : []))
      .then((affiliates: Array<{ status: string }>) => {
        if (!cancelled) {
          const count = affiliates.filter((a) => a.status === 'pending').length
          setPendingCount(count)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  )

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const drawerContent = (
    <nav className="p-4" aria-label="Admin">
      <ul className="space-y-1">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={isActive(link.href) ? activeLinkClass : linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
              {link.href === '/admin/affiliates' && pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-pink px-2 py-0.5 font-body text-xs font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          </li>
        ))}
        <li className="pt-4 border-t border-ink/5 mt-4">
          <Link
            href="/"
            className={linkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Back to Site
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-3 font-body text-body font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink/5 bg-white md:block">
        <div className="flex h-16 items-center border-b border-ink/5 px-6">
          <span className="font-display text-lg font-semibold text-ink">
            Shapewear Closet
          </span>
        </div>
        {drawerContent}
      </aside>

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-3 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
      >
        <FaBars size={20} />
      </button>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[280px] bg-white shadow-xl overflow-y-auto">
            <div className="flex h-16 items-center justify-between border-b border-ink/5 px-6">
              <span className="font-display text-lg font-semibold text-ink">
                Shapewear Closet
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 hover:bg-blush hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                aria-label="Close menu"
              >
                <FaTimes size={18} />
              </button>
            </div>
            {drawerContent}
          </div>
        </div>
      )}
    </>
  )
}
