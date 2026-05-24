'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'

type Lead = {
  id: string
  email: string
  first_name: string | null
  quiz_answers: Record<string, string> | null
  is_active: boolean
  created_at: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/leads')
      const json = await res.json()
      setLeads(json.leads ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function exportCSV() {
    const rows = displayed.map(l => ({
      email: l.email,
      first_name: l.first_name ?? '',
      is_active: l.is_active ? 'yes' : 'no',
      joined: new Date(l.created_at).toLocaleDateString(),
      ...Object.fromEntries(
        Object.entries(l.quiz_answers ?? {}).map(([k, v]) => [`quiz_${k}`, v])
      ),
    }))

    if (rows.length === 0) return
    const headers = Object.keys(rows[0])
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify((r as Record<string,string>)[h] ?? '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const displayed = leads.filter(l => {
    if (filter === 'active') return l.is_active
    if (filter === 'inactive') return !l.is_active
    return true
  })

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Lead Magnet</h1>
          <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>
            All lead magnet signups and their quiz responses.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-[8px] font-semibold text-sm"
          style={{ background: '#f0f0f0', color: '#4d4d4d' }}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 mb-5">
        {(['all', 'active', 'inactive'] as const).map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className="px-3 py-1.5 rounded-[6px] text-[12px] font-semibold capitalize"
            style={{
              background: filter === opt ? '#ffc107' : '#ffffff',
              color: filter === opt ? '#4d4d4d' : '#6b7280',
              border: `1px solid ${filter === opt ? '#ffc107' : '#e8e8e8'}`,
            }}
          >
            {opt}
          </button>
        ))}
        <span className="ml-2 text-[13px] self-center" style={{ color: '#9ca3af' }}>
          {displayed.length} {displayed.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>

      <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['Email', 'Name', 'Joined', 'Active', 'Quiz Answers', ''].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>Loading…</td>
              </tr>
            ) : displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>No leads found.</td>
              </tr>
            ) : displayed.map((l, i) => {
              const isOpen = expanded.has(l.id)
              const hasAnswers = l.quiz_answers && Object.keys(l.quiz_answers).length > 0
              return (
                <>
                  <tr
                    key={l.id}
                    style={{ borderTop: i > 0 ? '1px solid #e8e8e8' : 'none', background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                  >
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#4d4d4d', height: 48 }}>{l.email}</td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>{l.first_name ?? '—'}</td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
                      {new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={l.is_active
                          ? { background: '#f0fdf4', color: '#10b981' }
                          : { background: '#f7f7f7', color: '#9ca3af' }
                        }
                      >
                        {l.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#9ca3af' }}>
                      {hasAnswers ? `${Object.keys(l.quiz_answers!).length} responses` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {hasAnswers && (
                        <button
                          onClick={() => toggleExpand(l.id)}
                          className="flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-[6px]"
                          style={{ background: '#f0f2f7', color: '#4d4d4d' }}
                        >
                          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {isOpen ? 'Hide' : 'View'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {isOpen && hasAnswers && (
                    <tr key={`${l.id}-answers`} style={{ borderTop: '1px solid #f0f0f0', background: '#fffbeb' }}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(l.quiz_answers!).map(([q, a]) => (
                            <div key={q} className="rounded-[8px] px-3 py-2" style={{ background: '#ffffff', border: '1px solid #e8e8e8' }}>
                              <p className="text-[11px] font-semibold mb-0.5" style={{ color: '#9ca3af' }}>{q}</p>
                              <p className="text-[13px]" style={{ color: '#4d4d4d' }}>{a}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
