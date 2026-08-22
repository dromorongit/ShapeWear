import Image from 'next/image'
import Link from 'next/link'
import ContourLine from '@/components/ui/ContourLine'
import ProductCard from '@/components/product/ProductCard'
import { mockProducts } from '@/lib/mockProducts'

const featuredProducts = mockProducts.filter((product) => product.isFeatured)

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 md:hidden">
          <ContourLine color="pink" opacity={0.12} className="h-full w-full translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="hidden md:block absolute inset-0">
          <ContourLine color="pink" opacity={0.1} className="h-full w-1/2 translate-x-1/3" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ minHeight: '60vh' }}>
            <div className="max-w-2xl md:min-h-[70vh] md:flex md:flex-col md:justify-center md:w-1/2">
              <h1 className="font-hero text-ink">
                Confidence starts from underneath
              </h1>
              <p className="mt-4 md:mt-6 font-body text-body text-ink/70 max-w-xl">
                Precision-cut shapewear that supports your silhouette and moves with your life - no squeezing, no slipping, just seamless confidence.
              </p>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2 md:pl-12">
              <div className="relative w-full" style={{ minHeight: '40vh' }}>
                <Image
                  src="/images/shapewearhero.jpg"
                  alt="Shapewear hero"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-grid" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-h2 font-semibold text-ink">Featured Products</h2>
          <p className="mt-2 font-body text-body text-ink/60">Our most-loved pieces, chosen for fit and everyday confidence.</p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-md border border-ink/10 bg-white px-6 py-3 font-body text-base font-medium text-ink transition-colors hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
