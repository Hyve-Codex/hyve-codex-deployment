'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TrialBanner({ daysRemaining }: { daysRemaining: number }) {
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (dismissed) return null

  const isUrgent = daysRemaining <= 3
  const bg = isUrgent ? '#fef3c7' : '#fdf3d0'

  const message = daysRemaining === 0
    ? '⚠️ Your free trial ends today.'
    : daysRemaining === 1
    ? '⚠️ Your free trial ends tomorrow.'
    : `⏳ Your free trial ends in ${daysRemaining} days.`

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) router.push(url)
    else setLoading(false)
  }

  return (
    <div
      className="relative flex items-center justify-center gap-3 px-10"
      style={{ height: 40, background: bg, borderBottom: '1px solid #ffc107' }}
    >
      <p className="text-[13px] text-[#4d4d4d] text-center">{message}</p>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="flex-shrink-0 text-[11px] font-bold px-3 py-1 rounded-full transition-colors duration-150"
        style={{ background: '#ffc107', color: '#4d4d4d', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? '…' : 'Upgrade →'}
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 text-[#4d4d4d] transition-opacity duration-150 hover:opacity-60"
        style={{ opacity: 0.4 }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
