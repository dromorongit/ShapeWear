'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/components/admin/useAdminAuth'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { mockProducts } from '@/lib/mockProducts'

const stockStatusVariant = {
  'in-stock': 'inStock' as const,
  'low-stock': 'lowStock' as const,
  'out-of-stock': 'outOfStock' as const,
}

export default function AdminProductsPage() {
  useAdminAuth()
  const [products, setProducts] = useState(mockProducts)

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Products
          </h2>
          <p className="mt-1 font-body text-small text-ink/60">
            Manage your product catalog.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((product) => (
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
                      GHS {product.salePrice ?? product.price}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={stockStatusVariant[product.stockStatus]}>
                      {product.stockStatus.replace('-', ' ')}
                    </Badge>
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
    </div>
  )
}