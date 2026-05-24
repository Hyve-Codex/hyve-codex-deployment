'use client'

import { useEffect, useState, useCallback } from 'react'
import { X } from 'lucide-react'

type Suggestion = {
  id: string
  type: string
  title: string
  description: string | null
  status: string
  created_at: string
  user_email: string | null
}

const STATUS_OPTIONS = ['new', 'in_review', 'planned', 'declined', 'done']
const FILTER_TABS = ['all', 'new', 'in_review', 'planned', 'declined', 'done']

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: '#fdf3d0', color: '#b45309' },
  in_review: { bg: '#e0f2fe', color: '#0369a1' },
  planned:   { bg: '#f0fdf4', color: '#10b981' },
  declined:  { bg: '#fef2f2', color: '#ef4444' },
  done:      { bg: '#f7f7f7', color: '#6b7280' },
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/suggestions?${params}`)
      const json = await res.json()
      setSuggestions(json.suggestions ?? [])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    try {
      await fetch('/api/admin/update-suggestion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId: id, status }),
      })
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    } finally {
      setUpdatingId(null)
    }
  }

  const counts = FILTER_TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab] = tab === 'all' ? suggestions.length : suggestions.filter(s => s.status === tab).length
    return acc
  }, {})

  const displayed = filter === 'all' ? suggestions : suggestions.filter(s => s.status === filter)

  return (
    <div className="flex gap-5 h-full">
      {/* Main panel */}
      <div className="flex-1 min-w-0">
        <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Suggestions</h1>
        <p className="mb-5" style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>
          Review and triage user-submitted prompt and skill requests.
        </p>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold capitalize"
              style={{
                background: filter === tab ? '#ffc107' : '#ffffff',
                color: filter === tab ? '#4d4d4d' : '#6b7280',
                border: `1px solid ${filter === tab ? '#ffc107' : '#e8e8e8'}`,
              }}
            >
              {tab.replace('_', ' ')}
              {counts[tab] > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: filter === tab ? 'rgba(0,0,0,0.12)' : '#f0f0f0',
                    color: filter === tab ? '#4d4d4d' : '#9ca3af',
                  }}
                >
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                {['Type', 'Title', 'Submitted', 'Status', ''].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>Loading…</td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>No suggestions here.</td>
                </tr>
              ) : displayed.map((s, i) => {
                const sc = STATUS_COLORS[s.status] ?? STATUS_COLORS.new
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderTop: i > 0 ? '1px solid #e8e8e8' : 'none',
                      background: selected?.id === s.id ? '#fffbeb' : i % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelected(s)}
                  >
                    <td className="px-4 py-3 text-[12px] font-semibold capitalize" style={{ color: '#6b7280', height: 48 }}>
                      {s.type}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: '#4d4d4d', maxWidth: 260 }}>
                      <span className="truncate block">{s.title}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: sc.bg, color: sc.color }}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(s.id, e.target.value) }}
                        disabled={updatingId === s.id}
                        className="text-[12px] rounded-[6px] px-2 py-1 outline-none"
                        style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div
          className="rounded-[12px] p-5 flex-shrink-0"
          style={{ width: 300, background: '#ffffff', border: '1px solid #e8e8e8', alignSelf: 'flex-start', position: 'sticky', top: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: STATUS_COLORS[selected.status]?.bg ?? '#fdf3d0', color: STATUS_COLORS[selected.status]?.color ?? '#b45309' }}
            >
              {selected.status.replace('_', ' ')}
            </span>
            <button onClick={() => setSelected(null)} style={{ color: '#9ca3af' }}>
              <X size={16} />
            </button>
          </div>

          <p className="font-bold mb-1" style={{ fontSize: 14, color: '#4d4d4d' }}>{selected.title}</p>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
            {selected.type}
          </p>

          {selected.description && (
            <p className="mb-4 text-[13px]" style={{ color: '#4d4d4d', lineHeight: 1.6 }}>
              {selected.description}
            </p>
          )}

          <div className="mb-4 space-y-1.5">
            {selected.user_email && (
              <p className="text-[12px]" style={{ color: '#9ca3af' }}>
                From: <span style={{ color: '#4d4d4d' }}>{selected.user_email}</span>
              </p>
            )}
            <p className="text-[12px]" style={{ color: '#9ca3af' }}>
              Submitted: <span style={{ color: '#4d4d4d' }}>{new Date(selected.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>

          <label className="block mb-1.5 font-semibold" style={{ fontSize: 12, color: '#6b7280' }}>Update Status</label>
          <select
            value={selected.status}
            onChange={(e) => updateStatus(selected.id, e.target.value)}
            disabled={updatingId === selected.id}
            className="w-full rounded-[8px] px-3 py-2 text-sm outline-none"
            style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
