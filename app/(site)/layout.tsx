import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import { CartProvider } from '@/context/CartContext'
import RefTracker from '@/components/affiliate/RefTracker'

export const metadata: Metadata = {
  title: 'Shapewear Closet',
  description: 'Confidence starts from underneath',
  openGraph: {
    title: 'Shapewear Closet',
    description: 'Confidence starts from underneath',
    type: 'website',
    locale: 'en_GH',
  },
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
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
