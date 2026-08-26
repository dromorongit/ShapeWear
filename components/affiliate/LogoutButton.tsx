'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/affiliate/auth/logout', { method: 'POST' })
    router.replace('/affiliate/login')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="font-body text-small font-medium text-ink/70 hover:text-pink"
    >
      Logout
    </button>
  )
}
