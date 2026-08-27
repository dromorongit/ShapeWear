export default function AffiliateAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-4">
      {children}
    </div>
  )
}
