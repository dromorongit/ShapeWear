import ProductCard from './ProductCard'
import type { ProductCardData } from '@/lib/db/queries/products'

const ProductGrid = ({ products }: { products: ProductCardData[] }) => {
  return (
    <section id="product-grid" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-h2 font-semibold text-ink">Shop All</h2>
        <p className="mt-2 font-body text-body text-ink/60">Every piece engineered to shape, support, and move with you.</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
