import { Metadata } from 'next'
import ContourLine from '@/components/ui/ContourLine'
import ProductGrid from '@/components/product/ProductGrid'
import { getAllActiveProducts } from '@/lib/db/queries/products'

export const metadata: Metadata = {
  title: 'Shop - Shapewear Closet',
  description: 'Browse the full Shapewear Closet catalog. Waist trainers, body shapers, tummy control, and more.',
}

export const revalidate = 3600

const ShopPage = async () => {
  const products = await getAllActiveProducts()
  return (
    <div>
      <section className="relative overflow-hidden bg-ink/[0.02] py-16 md:py-20">
        <div className="absolute inset-0 md:hidden pointer-events-none">
          <ContourLine color="pink" opacity={0.1} className="h-full w-full translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <ContourLine color="pink" opacity={0.08} className="h-full w-1/2 translate-x-1/3" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-h1 font-semibold text-ink">Shop All Products</h1>
            <p className="mt-3 font-body text-body text-ink/60">
              Every piece engineered to shape, support, and move with you.
            </p>
          </div>
        </div>
      </section>
      <ProductGrid products={products} />
    </div>
  )
}

export default ShopPage
