'use client'

import { useEffect, useState } from 'react'

export default function AdminNav() {
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const [pendingCount, setPendingCount] = useState(0)

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

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-ink/5 bg-white md:block">
        <div className="flex h-16 items-center border-b border-ink/5 px-6">
          <span className="font-display text-lg font-semibold text-ink">
            Shapewear Closet
          </span>
        </div>
        <nav className="p-4" aria-label="Admin">
          <ul className="space-y-1">
            <li>
              <a
                href="/admin/dashboard"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admin/products"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/admin/categories"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Categories
              </a>
            </li>
            <li>
              <a
                href="/admin/reviews"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="/admin/affiliates"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Affiliates
                {pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-pink px-2 py-0.5 font-body text-xs font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </a>
            </li>
            <li className="pt-4 border-t border-ink/5 mt-4">
              <a
                href="/"
                className="flex items-center rounded-md px-3 py-2 font-body text-body font-medium text-ink/70 hover:bg-blush hover:text-pink transition-colors"
              >
                Back to Site
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 font-body text-body font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <nav className="flex items-center gap-4 md:hidden" aria-label="Admin mobile">
        <a
          href="/"
          className="font-body text-small font-medium text-ink/70 hover:text-pink"
        >
          Back
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="font-body text-small font-medium text-red-600 hover:text-red-700"
        >
          Logout
        </button>
      </nav>
    </>
  )
}
