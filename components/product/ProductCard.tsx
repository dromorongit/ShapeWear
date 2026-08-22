import Image from 'next/image'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { ProductCardData } from '@/lib/db/queries/products'

interface ProductCardProps {
  product: ProductCardData
  priority?: boolean
}

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
      <Card className="product-card overflow-hidden">
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
            <div className="absolute left-3 top-3">
              <Badge variant="sale">Sale</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-body text-base font-semibold text-ink group-hover:text-pink transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="font-mono text-price text-ink">GHS {product.salePrice}</span>
                <span className="font-mono text-small text-ink/50 line-through">GHS {product.price}</span>
              </>
            ) : (
              <span className="font-mono text-price text-ink">GHS {product.price}</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
