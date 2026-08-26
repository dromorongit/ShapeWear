'use client'

import { useEffect } from 'react'

export default function RefTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (!ref) return

    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ref }),
      keepalive: true,
    })
  }, [])

  return null
}
