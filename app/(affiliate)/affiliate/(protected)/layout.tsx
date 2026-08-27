import LogoutButton from '@/components/affiliate/LogoutButton'

export default function AffiliateProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-ink/5 bg-white px-4 sm:px-6">
        <span className="font-display text-lg font-semibold text-ink">
          Shapewear Closet
        </span>
        <LogoutButton />
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
