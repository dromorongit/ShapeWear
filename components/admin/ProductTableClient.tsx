'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatCurrency'
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'

interface ProductRow {
  id: string
  name: string
  slug: string
  mainImage: string
  category: string
  price: number
  salePrice: number | null
  stock: number
  stockStatus: string
  isActive: boolean
  isFeatured: boolean
}

export default function ProductTableClient({ products }: { products: ProductRow[] }) {
  const [productList, setProductList] = useState<ProductRow[]>(products)

  const toggleActive = async (id: string) => {
    const product = productList.find((p) => p.id === id)
    if (!product) return
    const newStatus = !product.isActive

    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
    )

    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newStatus }),
    }).catch(() => {
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !newStatus } : p))
      )
    })
  }

  const toggleFeatured = async (id: string) => {
    const product = productList.find((p) => p.id === id)
    if (!product) return
    const newStatus = !product.isFeatured

    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: newStatus } : p))
    )

    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: newStatus }),
    }).catch(() => {
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: !newStatus } : p))
      )
    })
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setProductList((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' }).catch(() => {
      setProductList(products)
    })
  }

  return (
    <Card className="overflow-hidden">
      {/* Mobile: stacked cards */}
      <div className="block md:hidden">
        {productList.length === 0 ? (
          <p className="p-6 font-body text-small text-ink/50">No products yet.</p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {productList.map((product) => (
              <li key={product.id} className="p-4">
                <div className="mb-3 flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 rounded-md bg-blush overflow-hidden relative">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-body font-medium text-ink">
                      {product.name}
                    </p>
                    <p className="font-body text-small text-ink/50">
                      {product.slug}
                    </p>
                  </div>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm" className="min-h-[44px]">
                      <FaEdit size={16} />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 font-body text-small text-ink/70 mb-3">
                  <div>
                    <span className="text-ink/50">Category</span>
                    <p className="font-medium text-ink">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-ink/50">Price</span>
                    <p className="font-medium text-ink">
                      {formatCurrency(product.salePrice ?? product.price)}
                    </p>
                  </div>
                  <div>
                    <span className="text-ink/50">Stock</span>
                    <p className="font-medium text-ink">{product.stock}</p>
                  </div>
                  <div>
                    <span className="text-ink/50">Status</span>
                    <Badge
                      variant={
                        product.stockStatus === 'low-stock'
                          ? 'lowStock'
                          : product.stockStatus === 'out-of-stock'
                          ? 'outOfStock'
                          : 'inStock'
                      }
                    >
                      {product.stockStatus}
                    </Badge>
                  </div>
                </div>
                  <div className="flex flex-col gap-2 border-t border-ink/5 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(product.id)}
                    className="flex-1 min-w-[100px] min-h-[44px]"
                  >
                    {product.isActive ? (
                      <>
                        <FaToggleOn size={16} className="mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <FaToggleOff size={16} className="mr-1" />
                        Inactive
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFeatured(product.id)}
                    className="flex-1 min-w-[100px] min-h-[44px]"
                  >
                    {product.isFeatured ? '★ Featured' : 'Feature'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 flex-1 min-w-[100px] min-h-[44px]"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <FaTrash size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Product
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Category
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Price
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Stock
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Active
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Featured
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {productList.map((product) => (
              <tr key={product.id} className="hover:bg-blush/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-blush overflow-hidden relative">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-body text-body font-medium text-ink">
                        {product.name}
                      </p>
                      <p className="font-body text-small text-ink/50">
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-body text-small text-ink/70">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-body text-small text-ink/70">
                    {formatCurrency(product.salePrice ?? product.price)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-body text-small text-ink/70">
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(product.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 ${
                      product.isActive ? 'bg-pink' : 'bg-ink/20'
                    }`}
                    role="switch"
                    aria-checked={product.isActive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        product.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(product.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
                      product.isFeatured ? 'bg-gold' : 'bg-ink/20'
                    }`}
                    role="switch"
                    aria-checked={product.isFeatured}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        product.isFeatured ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
