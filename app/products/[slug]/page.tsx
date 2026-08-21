import { notFound } from 'next/navigation'
import Link from 'next/link'
import ImageGallery from '@/components/product/ImageGallery'
import VariantSelector from '@/components/product/VariantSelector'
import ReviewsSection from '@/components/product/ReviewsSection'
import ProductCard from '@/components/product/ProductCard'
import { mockProducts } from '@/lib/mockProducts'
import { BUSINESS_NAME } from '@/lib/constants'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | ${BUSINESS_NAME}`,
    description: product.shortDescription,
  }
}

const ProductPage = ({ params }: ProductPageProps) => {
  const product = mockProducts.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const displayProducts = relatedProducts.length >= 3 ? relatedProducts : mockProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-small text-ink/60">
            <li>
              <Link href="/" className="hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#product-grid" className="hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ImageGallery
              mainImage={product.mainImage}
              additionalImages={product.additionalImages}
              productName={product.name}
            />
          </div>

          <div>
            <h1 className="font-display text-h1 font-semibold text-ink">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="font-mono text-price text-ink">GHS {product.salePrice}</span>
                  <span className="font-mono text-small text-ink/50 line-through">GHS {product.price}</span>
                </>
              ) : (
                <span className="font-mono text-price text-ink">GHS {product.price}</span>
              )}
            </div>

             <p className="mt-4 font-body text-body text-ink/70">{product.description}</p>

             <p className="mt-4 font-body text-small text-ink/50">Category: {product.category}</p>

             <div className="mt-6">
              <VariantSelector
                shapes={product.shapes}
                sizes={product.sizes}
                variants={product.variants}
              />
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection product={product} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-h2 font-semibold text-ink">You May Also Like</h2>
          <p className="mt-2 font-body text-body text-ink/60">Similar pieces you might love.</p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductPage
