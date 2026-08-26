'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface AffiliateRow {
  id: string
  name: string
  email: string
  referralCode: string
  status: 'pending' | 'approved' | 'rejected'
  commissionRate: number
  totalClicks: number
  totalSales: number
  totalCommissionEarned: number
  totalCommissionPaid: number
  createdAt: string
}

interface PayoutRow {
  id: string
  amount: number
  note: string
  paidAt: string
  createdAt: string
  updatedAt: string
}

const statusVariant: Record<string, 'inStock' | 'lowStock' | 'outOfStock'> = {
  approved: 'inStock',
  pending: 'lowStock',
  rejected: 'outOfStock',
}

export default function AffiliateDetailClient({
  affiliate: initialAffiliate,
  payouts: initialPayouts,
}: {
  affiliate: AffiliateRow
  payouts: PayoutRow[]
}) {
  const [affiliate, setAffiliate] = useState(initialAffiliate)
  const [payouts, setPayouts] = useState(initialPayouts)
  const [editingRate, setEditingRate] = useState(false)
  const [rateValue, setRateValue] = useState(String(affiliate.commissionRate))
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutNote, setPayoutNote] = useState('')
  const [payoutError, setPayoutError] = useState('')
  const [payoutWarning, setPayoutWarning] = useState('')
  const [loading, setLoading] = useState(false)

  const balance = affiliate.totalCommissionEarned - affiliate.totalCommissionPaid

  const refreshAffiliate = async () => {
    const res = await fetch(`/api/admin/affiliates/${affiliate.id}`)
    if (res.ok) {
      const data = await res.json()
      setAffiliate({ ...data, createdAt: data.createdAt })
    }
  }

  const refreshPayouts = async () => {
    const res = await fetch(`/api/admin/affiliates/${affiliate.id}/payouts`)
    if (res.ok) {
      const data = await res.json()
      setPayouts(data.map((p: PayoutRow) => ({ ...p })))
    }
  }

  const saveCommissionRate = async () => {
    const rate = Number(rateValue)
    if (Number.isNaN(rate) || rate < 0 || rate > 100) return
    setLoading(true)
    await fetch(`/api/admin/affiliates/${affiliate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissionRate: rate }),
    })
    await refreshAffiliate()
    setEditingRate(false)
    setLoading(false)
  }

  const updateStatus = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    await fetch(`/api/admin/affiliates/${affiliate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await refreshAffiliate()
    setLoading(false)
  }

  const recordPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    setPayoutError('')
    setPayoutWarning('')

    const amount = Number(payoutAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setPayoutError('Amount must be a positive number')
      return
    }

    if (amount > balance) {
      setPayoutWarning(`Amount exceeds pending balance (GHS ${balance.toFixed(2)})`)
    }

    setLoading(true)
    const res = await fetch(`/api/admin/affiliates/${affiliate.id}/payouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, note: payoutNote }),
    })

    if (res.ok) {
      setPayoutAmount('')
      setPayoutNote('')
      await Promise.all([refreshAffiliate(), refreshPayouts()])
    } else {
      const data = await res.json().catch(() => ({ error: 'Failed to record payout' }))
      setPayoutError(data.error || 'Failed to record payout')
    }
    setLoading(false)
  }

  useEffect(() => {
    setRateValue(String(affiliate.commissionRate))
  }, [affiliate.commissionRate])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            {affiliate.name}
          </h2>
          <p className="mt-1 font-body text-small text-ink/60">
            {affiliate.email} • Joined {new Date(affiliate.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[affiliate.status] || 'lowStock'}>
            {affiliate.status}
          </Badge>
          <Link href="/admin/affiliates">
            <Button variant="secondary" size="sm">
              Back to List
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Clicks</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {affiliate.totalClicks}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Sales</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {affiliate.totalSales}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Commission Earned</p>
          <p className="mt-1 font-display text-2xl font-semibold text-gold">
            GHS {affiliate.totalCommissionEarned.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-body text-small text-ink/60">Pending Balance</p>
          <p className={`mt-1 font-display text-2xl font-semibold ${balance > 0 ? 'text-pink' : 'text-ink/40'}`}>
            GHS {balance.toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Commission Rate</h3>
            <p className="font-body text-small text-ink/60">
              This rate is snapshotted per order at checkout time. Changing it only affects future orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editingRate ? (
              <>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={rateValue}
                  onChange={(e) => setRateValue(e.target.value)}
                  className="h-10 w-20 rounded-md border border-ink/10 px-3 font-body text-body text-ink"
                />
                <Button size="sm" onClick={saveCommissionRate} disabled={loading}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingRate(false)
                    setRateValue(String(affiliate.commissionRate))
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="font-body text-body font-medium text-ink">
                  {affiliate.commissionRate}%
                </span>
                <Button variant="ghost" size="sm" onClick={() => setEditingRate(true)}>
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {affiliate.status === 'pending' && (
          <div className="flex items-center gap-2 pt-4 border-t border-ink/5">
            <Button onClick={() => updateStatus('approved')} disabled={loading}>
              Approve Affiliate
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => updateStatus('rejected')}
              disabled={loading}
            >
              Reject
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Record Payout</h3>
        <form onSubmit={recordPayout} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <label className="block font-body text-small font-medium text-ink/70 mb-1">
                Amount (GHS)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={payoutAmount}
                onChange={(e) => {
                  setPayoutAmount(e.target.value)
                  setPayoutWarning('')
                }}
                placeholder="0.00"
                className="h-10 w-full rounded-md border border-ink/10 px-3 font-body text-body text-ink"
              />
              <p className="mt-1 font-body text-small text-ink/50">
                Pending balance: GHS {balance.toFixed(2)}
              </p>
            </div>
            <div className="flex-1">
              <label className="block font-body text-small font-medium text-ink/70 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={payoutNote}
                onChange={(e) => setPayoutNote(e.target.value)}
                placeholder="e.g. Monthly payout"
                className="h-10 w-full rounded-md border border-ink/10 px-3 font-body text-body text-ink"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Record Payout
            </Button>
          </div>
          {payoutWarning && (
            <p className="font-body text-small text-gold">{payoutWarning}</p>
          )}
          {payoutError && (
            <p className="font-body text-small text-red-600">{payoutError}</p>
          )}
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/5">
          <h3 className="font-display text-lg font-semibold text-ink">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="px-6 py-3 font-body text-small font-medium text-ink/60">
                  Date
                </th>
                <th className="px-6 py-3 font-body text-small font-medium text-ink/60">
                  Amount
                </th>
                <th className="px-6 py-3 font-body text-small font-medium text-ink/60">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <p className="font-body text-small text-ink/50">No payouts recorded yet.</p>
                  </td>
                </tr>
              )}
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-blush/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-body text-small text-ink/70">
                      {new Date(payout.paidAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-body text-small font-medium text-ink">
                      GHS {payout.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-body text-small text-ink/70">
                      {payout.note || '—'}
                    </span>
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
