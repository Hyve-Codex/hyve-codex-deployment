'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  user: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
  }
  subscription: {
    status: string
    plan: string
    trial_started_at: string | null
    current_period_end: string | null
    admin_notes: string | null
  } | null
  onClose: () => void
  onSave: () => void
}

const STATUS_OPTIONS = ['trial', 'active', 'canceled', 'past_due', 'inactive']
const PLAN_OPTIONS = ['trial', 'full_codex']

export default function EditUserModal({ user, subscription, onClose, onSave }: Props) {
  const [status, setStatus] = useState(subscription?.status ?? 'inactive')
  const [plan, setPlan] = useState(subscription?.plan ?? 'trial')
  const [trialStartedAt, setTrialStartedAt] = useState(
    subscription?.trial_started_at ? subscription.trial_started_at.slice(0, 10) : ''
  )
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(
    subscription?.current_period_end ? subscription.current_period_end.slice(0, 10) : ''
  )
  const [adminNotes, setAdminNotes] = useState(subscription?.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/update-user-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          status,
          plan,
          trial_started_at: trialStartedAt || null,
          current_period_end: currentPeriodEnd || null,
          admin_notes: adminNotes || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save')
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

        <h2 className="font-bold mb-0.5" style={{ fontSize: 17, color: '#4d4d4d' }}>Edit User</h2>
        <p className="mb-5" style={{ fontSize: 13, color: '#9ca3af' }}>
          {user.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : user.email}
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
                Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
              >
                {PLAN_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Trial Started
            </label>
            <input
              type="date"
              value={trialStartedAt}
              onChange={(e) => setTrialStartedAt(e.target.value)}
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Access Ends / Period End
            </label>
            <input
              type="date"
              value={currentPeriodEnd}
              onChange={(e) => setCurrentPeriodEnd(e.target.value)}
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this user…"
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
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-[8px] text-sm font-semibold"
            style={{ background: '#ffc107', color: '#4d4d4d', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
