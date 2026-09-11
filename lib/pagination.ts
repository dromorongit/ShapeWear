import { NextRequest } from 'next/server'

export interface PaginationOptions {
  defaultLimit?: number
  maxLimit?: number
}

export interface PaginationResult {
  page: number
  limit: number
  skip: number
}

export function getPagination(
  source: NextRequest | Record<string, string | string[] | undefined>,
  options: PaginationOptions = {}
): PaginationResult {
  const { defaultLimit = 50, maxLimit = 200 } = options

  const getParam = (key: string, fallback: string): string => {
    if (source instanceof NextRequest) {
      return source.nextUrl.searchParams.get(key) || fallback
    }
    const val = source[key]
    if (Array.isArray(val)) return val[0] || fallback
    return val || fallback
  }

  const page = Math.max(1, parseInt(getParam('page', '1'), 10) || 1)
  const rawLimit = parseInt(getParam('limit', String(defaultLimit)), 10)
  const limit = Math.min(maxLimit, Math.max(1, isNaN(rawLimit) ? defaultLimit : rawLimit))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}
