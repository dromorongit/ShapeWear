import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'
import ImageGallery from '@/components/product/ImageGallery'
import VariantSelector from '@/components/product/VariantSelector'
import ReviewsSection from '@/components/product/ReviewsSection'
import ProductCard from '@/components/product/ProductCard'
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  getAllActiveProducts,
} from '@/lib/db/queries/products'
import { BUSINESS_NAME } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatCurrency'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const title = `${product.name} | ${BUSINESS_NAME}`
  const description = product.shortDescription
  const imageUrl = product.mainImage.startsWith('http') ? product.mainImage : `https://shapewearcloset.com${product.mainImage}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/products/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  }
}

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  let relatedProducts = await getRelatedProducts(product.category, product.slug, 4)

  if (relatedProducts.length < 3) {
    const all = await getAllActiveProducts()
    relatedProducts = all
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
  }

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
                   <span className="font-mono text-price text-ink">{formatCurrency(product.salePrice)}</span>
                   <span className="font-mono text-small text-ink/50 line-through">{formatCurrency(product.price)}</span>
                 </>
               ) : (
                 <span className="font-mono text-price text-ink">{formatCurrency(product.price)}</span>
               )}
             </div>

             <p className="mt-4 font-body text-body text-ink/70">{product.description}</p>

             <p className="mt-4 font-body text-small text-ink/50">Category: {product.category}</p>

                <div className="mt-6">
                 <VariantSelector
                   shapes={product.shapes}
                   sizes={product.sizes}
                   variants={product.variants}
                   product={{
                     id: product.id,
                     slug: product.slug,
                     name: product.name,
                     mainImage: product.mainImage,
                     price: product.price,
                     salePrice: product.salePrice,
                     stock: product.stock,
                     stockStatus: product.stockStatus,
                   }}
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
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.mainImage.startsWith('http') ? product.mainImage : `https://shapewearcloset.com${product.mainImage}`,
            offers: {
              '@type': 'Offer',
              price: product.salePrice ?? product.price,
              priceCurrency: 'GHS',
              availability: product.stockStatus === 'out-of-stock'
                ? 'https://schema.org/OutOfStock'
                : product.stockStatus === 'low-stock'
                  ? 'https://schema.org/LimitedAvailability'
                  : 'https://schema.org/InStock',
              url: `https://shapewearcloset.com/products/${product.slug}`,
            },
          }),
        }}
      />
    </div>
  )
}

export default ProductPage
