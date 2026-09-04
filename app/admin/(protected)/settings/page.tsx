'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SiteSettingsData } from '@/lib/db/queries/settings'

type ApiSettings = SiteSettingsData

const DEFAULT_MESSAGE = "We're currently making some updates. Please check back shortly."

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ApiSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [maintenanceEstimatedReturn, setMaintenanceEstimatedReturn] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load settings')
        return res.json()
      })
      .then((data: ApiSettings) => {
        if (cancelled) return
        setSettings(data)
        setIsMaintenanceMode(data.isMaintenanceMode)
        setMaintenanceMessage(data.maintenanceMessage || DEFAULT_MESSAGE)
        setMaintenanceEstimatedReturn(
          data.maintenanceEstimatedReturn ? formatDateTimeLocal(data.maintenanceEstimatedReturn) : ''
        )
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function formatDateTimeLocal(date: Date | string): string {
    const d = new Date(date)
    const tzOffset = d.getTimezoneOffset() * 60000
    const local = new Date(d.getTime() - tzOffset)
    return local.toISOString().slice(0, 16)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isMaintenanceMode,
          maintenanceMessage: maintenanceMessage.trim() || DEFAULT_MESSAGE,
          maintenanceEstimatedReturn: maintenanceEstimatedReturn || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save settings')
      }

      const updated = await res.json()
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Settings</h2>
          <p className="mt-1 font-body text-small text-ink/60">
            Manage site-wide settings.
          </p>
        </div>
        <Card className="p-6">
          <p className="font-body text-small text-ink/60">Loading settings...</p>
        </Card>
      </div>
    )
  }

  const statusColor = isMaintenanceMode
    ? 'bg-gold/10 text-gold'
    : 'bg-green-50 text-green-700'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Site Settings
        </h2>
        <p className="mt-1 font-body text-small text-ink/60">
          Control site-wide behavior and maintenance mode.
        </p>
      </div>

      <Card className="p-4">
        <div className={`rounded-md px-4 py-2.5 font-body text-small ${statusColor}`}>
          {isMaintenanceMode
            ? 'Site is in MAINTENANCE MODE — customers currently see the maintenance page.'
            : 'Site is LIVE — customers can browse and purchase normally.'}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between">
              <div>
                <span className="font-body text-small font-medium text-ink">
                  Maintenance Mode
                </span>
                <p className="mt-1 font-body text-xs text-ink/60">
                  When enabled, visitors see a maintenance page instead of the storefront.
                  Authenticated admins still see the live site. Remember to click Save.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isMaintenanceMode}
                onClick={() => {
                  if (settings?.isMaintenanceMode !== isMaintenanceMode) {
                    setIsMaintenanceMode(!isMaintenanceMode)
                    setSaved(false)
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 ${
                  isMaintenanceMode ? 'bg-pink' : 'bg-ink/20'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    isMaintenanceMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          <div>
            <label
              htmlFor="maintenanceMessage"
              className="block font-body text-small font-medium text-ink"
            >
              Maintenance Message
            </label>
            <textarea
              id="maintenanceMessage"
              rows={4}
              value={maintenanceMessage}
              onChange={(e) => {
                setMaintenanceMessage(e.target.value)
                setSaved(false)
              }}
              className="mt-1 w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
            />
          </div>

          <div>
            <label
              htmlFor="maintenanceEstimatedReturn"
              className="block font-body text-small font-medium text-ink"
            >
              Estimated Return (optional)
            </label>
            <input
              id="maintenanceEstimatedReturn"
              type="datetime-local"
              value={maintenanceEstimatedReturn}
              onChange={(e) => {
                setMaintenanceEstimatedReturn(e.target.value)
                setSaved(false)
              }}
              className="mt-1 w-full rounded-md border border-ink/10 bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20"
            />
            <p className="mt-1 font-body text-xs text-ink/60">
              If set, customers will see an estimated return time on the maintenance page.
            </p>
          </div>

          {error && (
            <p className="font-body text-small text-red-600">{error}</p>
          )}

          {saved && (
            <p className="font-body text-small text-green-700">
              Settings saved successfully.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (settings) {
                  setIsMaintenanceMode(settings.isMaintenanceMode)
                  setMaintenanceMessage(settings.maintenanceMessage || DEFAULT_MESSAGE)
                  setMaintenanceEstimatedReturn(
                    settings.maintenanceEstimatedReturn
                      ? formatDateTimeLocal(settings.maintenanceEstimatedReturn)
                      : ''
                  )
                  setSaved(false)
                  setError(null)
                }
              }}
              disabled={saving || !settings}
            >
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={saving || !settings}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
