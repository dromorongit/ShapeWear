import { Metadata } from 'next'
import Link from 'next/link'
import ContourLine from '@/components/ui/ContourLine'
import ProductGrid from '@/components/product/ProductGrid'
import { getAllActiveProducts, getAllCategories } from '@/lib/db/queries/products'

export const metadata: Metadata = {
  title: 'Shop - Shapewear Closet',
  description: 'Browse the full Shapewear Closet catalog. Waist trainers, body shapers, tummy control, and more.',
}

export const dynamic = 'force-dynamic'

const ShopPage = async ({ searchParams }: { searchParams: { category?: string } }) => {
  const selectedCategory = searchParams.category || ''
  const [products, categories] = await Promise.all([
    getAllActiveProducts(selectedCategory || undefined),
    getAllCategories(),
  ])

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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`inline-flex items-center rounded-full px-4 py-1.5 font-body text-small font-medium transition-colors ${
              !selectedCategory
                ? 'bg-pink text-white'
                : 'bg-white border border-ink/10 text-ink/70 hover:border-pink hover:text-pink'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`inline-flex items-center rounded-full px-4 py-1.5 font-body text-small font-medium transition-colors ${
                  isActive
                    ? 'bg-pink text-white'
                    : 'bg-white border border-ink/10 text-ink/70 hover:border-pink hover:text-pink'
                }`}
              >
                {cat.name}
              </Link>
            )
          })}
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  )
}

export default ShopPage
