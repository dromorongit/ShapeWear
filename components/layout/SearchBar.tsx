'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SearchBar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setValue('')
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = value.trim()
    if (!query) {
      close()
      return
    }
    router.push(`/search?q=${encodeURIComponent(query)}`)
    close()
  }

  return (
    <div className="relative flex items-center">
      {isOpen ? (
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            placeholder="Search shapewear..."
            aria-label="Search products"
            className="h-10 w-40 sm:w-56 rounded-full border border-ink/15 bg-white px-4 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={open}
          aria-label="Open search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar
