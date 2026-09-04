import { cache } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import MaintenancePage from '@/components/site/MaintenancePage'
import { CartProvider } from '@/context/CartContext'
import RefTracker from '@/components/affiliate/RefTracker'
import { getSiteSettings } from '@/lib/db/queries/settings'
import { isAdminAuthenticated } from '@/lib/admin'

const getCachedSiteSettings = cache(getSiteSettings)

const baseMetadata: Metadata = {
  title: 'Shapewear Closet',
  description: 'Confidence starts from underneath',
  openGraph: {
    title: 'Shapewear Closet',
    description: 'Confidence starts from underneath',
    type: 'website',
    locale: 'en_GH',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()
  if (settings.isMaintenanceMode) {
    return { ...baseMetadata, robots: { index: false, follow: false } }
  }
  return baseMetadata
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getCachedSiteSettings()
  const isAdmin = await isAdminAuthenticated()

  if (settings.isMaintenanceMode && !isAdmin) {
    return (
      <MaintenancePage
        message={settings.maintenanceMessage}
        estimatedReturn={settings.maintenanceEstimatedReturn}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {settings.isMaintenanceMode && isAdmin && (
        <div className="bg-gold px-4 py-2 text-center text-sm font-medium text-ink">
          <span>Maintenance mode is ON — customers currently see the maintenance page.</span>
          {' '}
          <a
            href="/admin/settings"
            className="underline underline-offset-2 hover:text-ink/70"
          >
            Manage in admin
          </a>
        </div>
      )}
      <CartProvider>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
        <RefTracker />
      </CartProvider>
    </div>
  )
}
