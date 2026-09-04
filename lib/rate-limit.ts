import type { NextRequest } from 'next/server'

const windows = new Map<string, number[]>()

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = windows.get(key) || []
  const recent = timestamps.filter((t) => now - t < windowMs)
  windows.set(key, recent)
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
