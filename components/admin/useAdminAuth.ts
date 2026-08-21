'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true'
    if (!isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [router])
}
