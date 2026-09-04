'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatCurrency'
import { FaRegEye } from 'react-icons/fa'

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
      {/* Mobile: stacked cards */}
      <div className="block md:hidden">
        {list.length === 0 ? (
          <p className="p-6 font-body text-small text-ink/50">No affiliates yet.</p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {list.map((affiliate) => {
              const balance = affiliate.totalCommissionEarned - affiliate.totalCommissionPaid
              return (
                <li key={affiliate.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-body text-body font-medium text-ink">
                        {affiliate.name}
                      </p>
                      <p className="font-body text-small text-ink/50">
                        {affiliate.email}
                      </p>
                      <p className="font-body text-xss text-ink/40 font-mono">
                        {affiliate.referralCode}
                      </p>
                    </div>
                    <Badge variant={statusVariant[affiliate.status] || 'lowStock'}>
                      {affiliate.status}
                    </Badge>
                  </div>
                  <div className="mb-3 grid grid-cols-2 gap-2 font-body text-small text-ink/70">
                    <div>
                      <span className="text-ink/50">Rate</span>
                      <p className="font-medium text-ink">{affiliate.commissionRate}%</p>
                    </div>
                    <div>
                      <span className="text-ink/50">Sales</span>
                      <p className="font-medium text-ink">{affiliate.totalSales}</p>
                    </div>
                    <div>
                      <span className="text-ink/50">Earned</span>
                      <p className="font-medium text-ink">
                        {formatCurrency(affiliate.totalCommissionEarned)}
                      </p>
                    </div>
                    <div>
                      <span className="text-ink/50">Balance</span>
                      <p className={`font-medium ${balance > 0 ? 'text-gold' : 'text-ink/50'}`}>
                        {formatCurrency(balance)}
                      </p>
                    </div>
                  </div>
                  {affiliate.status === 'pending' && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-ink/5 mb-3">
                      <Button
                        size="sm"
                        className="min-h-[44px]"
                        onClick={() => updateStatus(affiliate.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 min-h-[44px]"
                        onClick={() => updateStatus(affiliate.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  <Link href={`/admin/affiliates/${affiliate.id}`}>
                    <Button variant="ghost" size="sm" className="w-full min-h-[44px]">
                      <FaRegEye size={14} className="mr-1" />
                      Manage
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
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
