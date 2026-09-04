import type { Metadata } from 'next'
import AdminNav from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Admin - Shapewear Closet',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-blush">
      <AdminNav />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink/5 bg-white px-4 sm:px-6">
          <h1 className="font-display text-xl font-semibold text-ink md:hidden">
            Admin
          </h1>
          <div className="hidden md:block">
            <span className="font-body text-small text-ink/60">
              Admin Panel
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
