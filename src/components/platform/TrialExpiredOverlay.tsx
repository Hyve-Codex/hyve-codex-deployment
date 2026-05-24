'use client'

import { useState } from 'react'

export default function TrialExpiredOverlay() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
      <div
        className="bg-white rounded-[16px] p-9 w-full text-center"
        style={{ maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
      >
        <div className="text-[32px] mb-4">🔒</div>
        <h2 className="font-extrabold text-[#4d4d4d] text-[20px] mb-3">
          Your free trial has ended.
        </h2>
        <p
          className="text-[14px] text-[#4d4d4d] leading-[1.6] mb-2"
          style={{ opacity: 0.65 }}
        >
          Upgrade to the Full Codex to continue accessing the Skills Directory, Commands, and AI Tool Recommendations, plus any new content added going forward.
        </p>
        <p className="text-[13px] text-[#4d4d4d] mb-6" style={{ opacity: 0.5 }}>
          $47 / month. Cancel anytime.
        </p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting…' : 'Upgrade Now →'}
        </button>
        <p className="mt-4 text-[11px] text-[#4d4d4d]" style={{ opacity: 0.4 }}>
          Questions? Email us at{' '}
          <a href="mailto:support@thehyvehamptons.com" className="underline" style={{ color: 'inherit' }}>
            support@thehyvehamptons.com
          </a>
        </p>
      </div>
    </div>
  )
}
