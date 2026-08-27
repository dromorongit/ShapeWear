'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatCurrency'

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

const statusVariant: Record<string, 'inStock' | 'lowStock' | 'outOfStock'> = {
  approved: 'inStock',
  pending: 'lowStock',
  rejected: 'outOfStock',
}

export default function AffiliateTableClient({ affiliates }: { affiliates: AffiliateRow[] }) {
  const [list, setList] = useState<AffiliateRow[]>(affiliates)

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )

    await fetch(`/api/admin/affiliates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {
      setList(affiliates)
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Affiliate
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Referral Code
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Status
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Rate
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Sales
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Earned
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Paid
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Balance
              </th>
              <th className="px-4 py-3 font-body text-small font-medium text-ink/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {list.map((affiliate) => {
              const balance = affiliate.totalCommissionEarned - affiliate.totalCommissionPaid
              return (
                <tr key={affiliate.id} className="hover:bg-blush/50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-body text-body font-medium text-ink">
                      {affiliate.name}
                    </span>
                    <span className="block font-body text-small text-ink/50">
                      {affiliate.email}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-small text-ink/70 font-mono">
                      {affiliate.referralCode}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusVariant[affiliate.status] || 'lowStock'}>
                      {affiliate.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-small text-ink/70">
                      {affiliate.commissionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-small text-ink/70">
                      {affiliate.totalSales}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                  <span className="font-body text-small text-ink/70">
                    {formatCurrency(affiliate.totalCommissionEarned)}
                  </span>
                  </td>
                  <td className="px-4 py-4">
                  <span className="font-body text-small text-ink/70">
                    {formatCurrency(affiliate.totalCommissionPaid)}
                  </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-body text-small font-medium ${balance > 0 ? 'text-gold' : 'text-ink/50'}`}>
                      {formatCurrency(balance)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/affiliates/${affiliate.id}`}>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </Link>
                      {affiliate.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus(affiliate.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => updateStatus(affiliate.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
