import Image from 'next/image'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { ProductCardData } from '@/lib/db/queries/products'
import { formatCurrency } from '@/lib/formatCurrency'

interface ProductCardProps {
  product: ProductCardData
  priority?: boolean
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={star <= rating ? '#F0B429' : 'none'}
        stroke={star <= rating ? '#F0B429' : '#CBD5E1'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
)

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const stockVariant =
    product.stockStatus === 'in-stock'
      ? 'inStock'
      : product.stockStatus === 'low-stock'
        ? 'lowStock'
        : 'outOfStock'

  const stockLabel =
    product.stockStatus === 'in-stock'
      ? 'In Stock'
      : product.stockStatus === 'low-stock'
        ? 'Low Stock'
        : 'Out of Stock'

  const shapeCount = new Set(product.variants.map((v) => v.shape)).size
  const sizeCount = new Set(product.variants.map((v) => v.size)).size

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="product-card overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
        <div className="relative aspect-[4/5] overflow-hidden bg-blush">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.salePrice && (
            <div className="absolute left-2.5 top-2.5">
              <Badge variant="sale">Sale</Badge>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-body text-small font-semibold text-ink group-hover:text-pink transition-colors leading-snug">
            {product.name}
          </h3>

          {product.reviewCount > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <StarRating rating={product.averageRating} />
              <span className="font-body text-small text-ink/50">
                ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="font-mono text-small font-medium text-ink">{formatCurrency(product.salePrice)}</span>
                <span className="font-mono text-small text-ink/50 line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="font-mono text-small font-medium text-ink">{formatCurrency(product.price)}</span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge variant={stockVariant}>{stockLabel}</Badge>
            <span className="font-body text-small text-ink/60">
              {shapeCount} shape{shapeCount !== 1 ? 's' : ''}, {sizeCount} size{sizeCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
