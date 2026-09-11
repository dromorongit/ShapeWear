import type { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'

const windows = new LRUCache<string, number[]>({
  max: 5000,
  ttl: 3_600_000,
})

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = windows.get(key) || []
  const recent = timestamps.filter((t) => now - t < windowMs)
  if (recent.length === 0) {
    windows.delete(key)
  } else {
    windows.set(key, recent)
  }
  return recent.length >= maxRequests
}

export function recordRequest(key: string): void {
  const timestamps = windows.get(key) || []
  timestamps.push(Date.now())
  windows.set(key, timestamps)
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
