'use client'

import { useState } from 'react'

interface CopyLinkButtonProps {
  code: string
}

export default function CopyLinkButton({ code }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const href = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${code}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <code className="flex-1 rounded-md border border-ink/10 bg-blush px-3 py-2 font-mono text-small text-ink break-all">
        {href}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center rounded-md bg-pink px-4 py-2 font-body text-base font-medium text-white transition-colors hover:bg-pink/90"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
