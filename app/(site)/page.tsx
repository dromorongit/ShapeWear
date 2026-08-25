import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ContourLine from '@/components/ui/ContourLine'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/lib/db/queries/products'
import { TAGLINE } from '@/lib/constants'
import Hero from '@/components/home/Hero'

export const revalidate = 3600

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  return (
    <>
      <Hero />

      <section id="product-grid" className="py-20 md:py-28 bg-ink/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-body text-small font-medium uppercase tracking-wider text-pink mb-3">Curated Selection</p>
              <h2 className="font-display text-h2 font-semibold text-ink">Featured Products</h2>
              <p className="mt-3 font-body text-body text-ink/60">Our most-loved pieces, chosen for fit and everyday confidence.</p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 80}>
                <ProductCard product={product} priority={index < 4} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md border border-ink/10 bg-white px-6 py-3 font-body text-base font-medium text-ink transition-colors hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
              >
                View All Products
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-plum py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <ContourLine color="gold" className="h-full w-1/2 translate-x-1/3" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-h2 font-semibold text-white">Ready to feel the difference?</h2>
            <p className="mt-4 font-body text-body text-pinkSoft/80 max-w-xl mx-auto">
              {TAGLINE}. Browse the full collection and find your perfect fit today.
            </p>
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md bg-pink px-8 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
              >
                Shop the Collection
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
