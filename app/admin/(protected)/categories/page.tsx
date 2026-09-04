'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products'),
      ])
      if (!catRes.ok) throw new Error('Failed to load categories')
      if (!prodRes.ok) throw new Error('Failed to load products')
      const cats = await catRes.json()
      const products = await prodRes.json()
      setCategories(cats)
      const counts: Record<string, number> = {}
      for (const p of products) {
        counts[p.category] = (counts[p.category] || 0) + 1
      }
      setProductCounts(counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAdding(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add category')
      setSuccess('Category added')
      setNewName('')
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    setSuccess('')
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete category')
      setSuccess('Category deleted')
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-ink">Categories</h2>

      {error && (
        <div className="rounded-md bg-red-50 p-4 font-body text-body text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-blush p-4 font-body text-body text-pink">{success}</div>
      )}

      <Card className="p-5">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <Input
            label="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. New Collection"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={adding} className="self-end">
            {adding ? 'Adding...' : 'Add Category'}
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 font-body text-ink/60">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-6 font-body text-ink/60">No categories yet.</div>
        ) : (
          <ul className="divide-y divide-ink/5">
            {categories.map((cat) => {
              const count = productCounts[cat.name] || 0
              return (
                <li key={cat.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-body text-body font-medium text-ink">{cat.name}</p>
                    <p className="font-body text-small text-ink/50">
                      {count} product{count === 1 ? '' : 's'} in use
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="md"
                    disabled={count > 0 || deletingId === cat.id}
                    onClick={() => handleDelete(cat.id)}
                  >
                    {deletingId === cat.id ? 'Deleting...' : count > 0 ? 'In Use' : 'Delete'}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
