'use client'

import { useState, useEffect } from 'react'
import Badge from '@/components/ui/Badge'
import { useCart } from '@/context/CartContext'
import { ProductVariant } from '@/lib/mockProducts'

interface VariantSelectorProps {
  shapes: string[]
  sizes: string[]
  variants: ProductVariant[]
  product?: {
    id: string
    slug: string
    name: string
    mainImage: string
    price: number
    salePrice: number | null
    stock?: number
    stockStatus?: string
  }
}

type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

const VariantSelector = ({ shapes, sizes, variants, product }: VariantSelectorProps) => {
  const firstInStockVariant = variants.find((v) => v.stock > 0)
  const defaultShape = firstInStockVariant?.shape ?? shapes[0] ?? ''
  const defaultSize = firstInStockVariant?.size ?? sizes[0] ?? ''
  const [selectedShape, setSelectedShape] = useState<string>(defaultShape)
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [quantity, setQuantity] = useState<number>(1)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const { addItem } = useCart()

  const variantMap = new Map<string, ProductVariant>()
  variants.forEach((v) => {
    variantMap.set(`${v.shape}-${v.size}`, v)
  })

  const getVariant = (shape: string, size: string) => variantMap.get(`${shape}-${size}`)

  const getVariantStock = (variant?: ProductVariant) => {
    if (variant && variant.stock > 0) return variant.stock
    if (product?.stock && product.stock > 0) return product.stock
    return 0
  }

  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) return 'out-of-stock'
    if (stock <= 3) return 'low-stock'
    return 'in-stock'
  }

  const currentVariant = getVariant(selectedShape, selectedSize)
  const currentStock = getVariantStock(currentVariant)
  const currentStatus = getStockStatus(currentStock)
  const isOutOfStock = currentStatus === 'out-of-stock'

  useEffect(() => {
    if (!currentVariant && shapes.length > 0 && sizes.length > 0) {
      const fallback = variants.find((v) => v.stock > 0) || variants[0]
      if (fallback) {
        setSelectedShape(fallback.shape)
        setSelectedSize(fallback.size)
      }
    }
  }, [currentVariant, shapes, sizes, variants])

  const handleAddToCart = () => {
    if (isOutOfStock || !currentVariant || !product) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      mainImage: product.mainImage,
      shape: selectedShape,
      size: selectedSize,
      sku: currentVariant.sku,
      price: product.salePrice ?? product.price,
      quantity,
    })
    setCartMessage(`Added ${selectedShape} / ${selectedSize} to cart`)
    setTimeout(() => setCartMessage(null), 3000)
    setQuantity(1)
  }

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape)
    const inStockSize = sizes.find((s) => {
      const variant = getVariant(shape, s)
      return variant !== undefined && variant.stock > 0
    }) ?? sizes[0] ?? ''
    setSelectedSize(inStockSize)
    setQuantity(1)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    setQuantity(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-body text-small font-medium text-ink">Shape</label>
        <div className="flex flex-wrap gap-2">
          {shapes.map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => handleShapeChange(shape)}
              className={`rounded-pill px-4 py-2 font-body text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 ${
                selectedShape === shape
                  ? 'bg-pink text-white'
                  : 'bg-blush text-ink hover:bg-pink/10'
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-body text-small font-medium text-ink">Size</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const variant = getVariant(selectedShape, size)
            const isDisabled = !variant || variant.stock === 0

            return (
              <button
                key={size}
                type="button"
                onClick={() => !isDisabled && handleSizeChange(size)}
                disabled={isDisabled}
                className={`rounded-pill px-4 py-2 font-body text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 ${
                  selectedSize === size && !isDisabled
                    ? 'bg-pink text-white'
                    : isDisabled
                      ? 'cursor-not-allowed bg-ink/5 text-ink/30 line-through'
                      : 'bg-blush text-ink hover:bg-pink/10'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={currentStatus === 'in-stock' ? 'inStock' : currentStatus === 'low-stock' ? 'lowStock' : 'outOfStock'}>
          {currentStatus === 'in-stock' ? 'In Stock' : currentStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
        </Badge>
        {!isOutOfStock && (
          <span className="font-body text-small text-ink/60">{currentStock} available</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="font-body text-small font-medium text-ink">Quantity</label>
        <div className="flex items-center rounded-md border border-ink/10 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 font-body text-small text-ink hover:bg-blush disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            -
          </button>
          <span className="px-4 py-2 font-mono text-small text-ink min-w-[3rem] text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            disabled={quantity >= currentStock || isOutOfStock}
            className="px-3 py-2 font-body text-small text-ink hover:bg-blush disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            +
          </button>
        </div>
      </div>

      <p className="font-body text-small text-ink/60">
        Selected: {selectedShape} / {selectedSize}
        {currentVariant && ` — SKU: ${currentVariant.sku}`}
      </p>

      <div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {cartMessage && (
          <p className="mt-2 font-body text-small text-pink">{cartMessage}</p>
        )}
      </div>
    </div>
  )
}

export default VariantSelector
