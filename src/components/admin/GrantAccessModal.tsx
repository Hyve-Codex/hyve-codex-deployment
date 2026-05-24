'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  onClose: () => void
  onSave: () => void
}

export default function GrantAccessModal({ onClose, onSave }: Props) {
  const [email, setEmail] = useState('')
  const [accessEndsAt, setAccessEndsAt] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleGrant() {
    if (!email.trim() || !accessEndsAt) {
      setError('Email and access end date are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          access_ends_at: accessEndsAt,
          notes: notes || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to grant access')
      onSave()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-md rounded-[14px] p-6"
        style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: '#f0f0f0', color: '#6b7280' }}
        >
          <X size={14} />
        </button>

        <h2 className="font-bold mb-1" style={{ fontSize: 17, color: '#4d4d4d' }}>Grant Access</h2>
        <p className="mb-5" style={{ fontSize: 13, color: '#9ca3af' }}>
          Grant full platform access to any email address.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Access Ends
            </label>
            <input
              type="date"
              value={accessEndsAt}
              onChange={(e) => setAccessEndsAt(e.target.value)}
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Notes <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Why is this access being granted?"
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none resize-none"
              style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm" style={{ color: '#ef4444' }}>{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] text-sm font-semibold"
            style={{ background: '#f0f0f0', color: '#6b7280' }}
          >
            Cancel
          </button>
          <button
            onClick={handleGrant}
            disabled={saving}
            className="px-4 py-2 rounded-[8px] text-sm font-semibold"
            style={{ background: '#ffc107', color: '#4d4d4d', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Granting…' : 'Grant Access'}
          </button>
        </div>
      </div>
    </div>
  )
}
