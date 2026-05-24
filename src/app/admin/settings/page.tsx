'use client'

import { useEffect, useState } from 'react'

type Settings = Record<string, string>

const SETTING_LABELS: Record<string, { label: string; description: string; type?: string }> = {
  trial_days:          { label: 'Trial Duration (days)', description: 'How many days a new user gets for their free trial.', type: 'number' },
  monthly_price_cents: { label: 'Monthly Price (cents)', description: 'Price in cents for monthly billing (e.g. 4700 = $47).', type: 'number' },
  annual_price_cents:  { label: 'Annual Price (cents)', description: 'Price in cents for annual billing (e.g. 56400 = $564).', type: 'number' },
  support_email:       { label: 'Support Email', description: 'Email shown to users for support requests.' },
  platform_name:       { label: 'Platform Name', description: 'Displayed name of this platform.' },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [edits, setEdits] = useState<Settings>({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(({ settings: s }) => {
        setSettings(s ?? {})
        setEdits(s ?? {})
        setLoading(false)
      })
  }, [])

  async function saveSetting(key: string) {
    setSaving(key)
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: edits[key] ?? '' }),
    })
    if (res.ok) {
      setSettings(prev => ({ ...prev, [key]: edits[key] ?? '' }))
      setSaved(key)
      setTimeout(() => setSaved(k => k === key ? null : k), 2000)
    }
    setSaving(null)
  }

  const settingKeys = Object.keys(SETTING_LABELS)

  return (
    <div>
      <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Settings</h1>
      <p className="mb-8" style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>Platform-wide configuration.</p>

      {/* Platform Settings */}
      <h2 className="font-bold mb-4" style={{ fontSize: 15, color: '#4d4d4d' }}>Platform Settings</h2>
      <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
        {loading ? (
          <div className="px-6 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>Loading…</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#e8e8e8' }}>
            {settingKeys.map(key => {
              const meta = SETTING_LABELS[key]
              const isDirty = edits[key] !== settings[key]
              return (
                <div key={key} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px]" style={{ color: '#4d4d4d' }}>{meta.label}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#9ca3af' }}>{meta.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type={meta.type ?? 'text'}
                      value={edits[key] ?? ''}
                      onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
                      className="rounded-[8px] px-3 py-2 text-sm outline-none"
                      style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', width: 180 }}
                    />
                    <button
                      onClick={() => saveSetting(key)}
                      disabled={!isDirty || saving === key}
                      className="px-3 py-2 rounded-[8px] text-[12px] font-semibold"
                      style={{
                        background: saved === key ? '#f0fdf4' : isDirty ? '#ffc107' : '#f0f0f0',
                        color: saved === key ? '#10b981' : isDirty ? '#4d4d4d' : '#9ca3af',
                        opacity: saving === key ? 0.7 : 1,
                        minWidth: 56,
                      }}
                    >
                      {saved === key ? 'Saved' : saving === key ? '…' : 'Save'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <h2 className="font-bold mb-4" style={{ fontSize: 15, color: '#ef4444' }}>Danger Zone</h2>
      <div className="rounded-[12px] p-5" style={{ border: '1px solid #fecaca', background: '#fff5f5' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: '#4d4d4d' }}>All destructive database actions</p>
        <p className="text-[13px] mb-4" style={{ color: '#6b7280' }}>
          Any irreversible changes to platform data must be done directly in the Supabase dashboard.
          There are no one-click wipe buttons here by design.
        </p>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 rounded-[8px] text-sm font-semibold"
          style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}
        >
          Open Supabase Dashboard →
        </a>
      </div>
    </div>
  )
}
