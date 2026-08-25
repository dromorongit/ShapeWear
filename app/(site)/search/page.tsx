import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { searchProducts } from '@/lib/db/queries/search'

interface SearchPageProps {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = (searchParams.q ?? '').trim()
  return {
    title: query ? `Search: ${query}` : 'Search',
    description: query
      ? `Search results for "${query}" at Shapewear Closet.`
      : 'Search the Shapewear Closet collection.',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? '').trim()
  const products = query ? await searchProducts(query) : []

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <nav className="font-body text-small text-ink/50">
            <Link href="/" className="hover:text-pink">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            Search
          </nav>
          <h1 className="mt-3 text-h1 text-ink">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          <p className="mt-3 font-body text-body text-ink/60">
            {query
              ? `${products.length} product${products.length === 1 ? '' : 's'} found.`
              : 'Enter a term to search the collection.'}
          </p>
        </div>

        {query && products.length === 0 ? (
          <div className="mt-12 rounded-md border border-ink/10 bg-white px-6 py-16 text-center">
            <p className="font-body text-body text-ink/70">
              No results for &ldquo;{query}&rdquo;.
            </p>
            <p className="mt-2 font-body text-small text-ink/50">
              Try a different term or{' '}
              <Link href="/shop" className="text-pink hover:underline">
                browse all products
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
