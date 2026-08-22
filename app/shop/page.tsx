import { Metadata } from 'next'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Shop - Shapewear Closet',
  description: 'Browse the full Shapewear Closet catalog. Waist trainers, body shapers, tummy control, and more.',
}

const ShopPage = () => {
  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-h1 font-semibold text-ink">Shop All Products</h1>
        <p className="mt-2 font-body text-body text-ink/60">
          Every piece engineered to shape, support, and move with you.
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}

export default ShopPage
