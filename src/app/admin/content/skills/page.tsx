'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

type Skill = {
  id: number
  name: string
  author: string | null
  category: string
  description: string | null
  install_url: string | null
  is_active: boolean
}

type FormState = Omit<Skill, 'id'> & { id?: number }

const EMPTY: FormState = { name: '', author: '', category: '', description: '', install_url: '', is_active: true }

function Modal({ item, onClose, onSave }: { item: FormState; onClose: () => void; onSave: (data: FormState) => Promise<void> }) {
  const [form, setForm] = useState<FormState>(item)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(k: keyof FormState, v: string | boolean) { setForm(prev => ({ ...prev, [k]: v })) }

  async function handleSave() {
    if (!form.name || !form.category) { setError('Name and category are required.'); return }
    setSaving(true); setError('')
    try { await onSave(form); onClose() }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-md rounded-[14px] p-6" style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: '#f0f0f0', color: '#6b7280' }}><X size={14} /></button>
        <h2 className="font-bold mb-5" style={{ fontSize: 17, color: '#4d4d4d' }}>{form.id ? 'Edit Skill' : 'Add Skill'}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-[12px] font-semibold" style={{ color: '#6b7280' }}>Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full rounded-[8px] px-3 py-2 text-sm outline-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }} />
            </div>
            <div>
              <label className="block mb-1 text-[12px] font-semibold" style={{ color: '#6b7280' }}>Author</label>
              <input value={form.author ?? ''} onChange={e => set('author', e.target.value)} className="w-full rounded-[8px] px-3 py-2 text-sm outline-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }} />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-[12px] font-semibold" style={{ color: '#6b7280' }}>Category *</label>
            <input value={form.category} onChange={e => set('category', e.target.value)} className="w-full rounded-[8px] px-3 py-2 text-sm outline-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }} />
          </div>
          <div>
            <label className="block mb-1 text-[12px] font-semibold" style={{ color: '#6b7280' }}>Description</label>
            <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={3} className="w-full rounded-[8px] px-3 py-2 text-sm outline-none resize-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }} />
          </div>
          <div>
            <label className="block mb-1 text-[12px] font-semibold" style={{ color: '#6b7280' }}>Install URL</label>
            <input value={form.install_url ?? ''} onChange={e => set('install_url', e.target.value)} className="w-full rounded-[8px] px-3 py-2 text-sm outline-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
            <span style={{ color: '#4d4d4d' }}>Active (visible to users)</span>
          </label>
        </div>
        {error && <p className="mt-3 text-sm" style={{ color: '#ef4444' }}>{error}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-sm font-semibold" style={{ background: '#f0f0f0', color: '#6b7280' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-[8px] text-sm font-semibold" style={{ background: '#ffc107', color: '#4d4d4d', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminContentSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FormState | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/skills')
    const json = await res.json()
    setSkills(json.skills ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(data: FormState) {
    const method = data.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/skills', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) throw new Error((await res.json()).error)
    await load()
  }

  async function handleDelete(id: number) {
    await fetch('/api/admin/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setConfirmDelete(null)
    await load()
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Skills</h1>
          <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>{skills.length} skills in the library</p>
        </div>
        <button onClick={() => setEditing(EMPTY)} className="flex items-center gap-2 px-4 py-2 rounded-[8px] font-semibold text-sm" style={{ background: '#ffc107', color: '#4d4d4d' }}>
          <Plus size={15} /> Add Skill
        </button>
      </div>
      <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['Name', 'Author', 'Category', 'Active', ''].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>Loading…</td></tr>
            ) : skills.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>No skills yet.</td></tr>
            ) : skills.map((s, i) => (
              <tr key={s.id} style={{ borderTop: i > 0 ? '1px solid #e8e8e8' : 'none', background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: '#4d4d4d', height: 48 }}>{s.name}</td>
                <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>{s.author ?? '—'}</td>
                <td className="px-4 py-3 text-[12px] font-semibold" style={{ color: '#6b7280' }}>{s.category}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={s.is_active ? { background: '#f0fdf4', color: '#10b981' } : { background: '#f7f7f7', color: '#9ca3af' }}>
                    {s.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditing({ ...s })} className="p-1.5 rounded-[6px]" style={{ background: '#f0f2f7', color: '#4d4d4d' }}><Pencil size={13} /></button>
                    <button onClick={() => setConfirmDelete(s.id)} className="p-1.5 rounded-[6px]" style={{ background: '#fef2f2', color: '#ef4444' }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <Modal item={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-[14px] p-6 w-80" style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p className="font-bold mb-2" style={{ fontSize: 16, color: '#4d4d4d' }}>Delete skill?</p>
            <p className="mb-5 text-sm" style={{ color: '#6b7280' }}>This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-[8px] text-sm font-semibold" style={{ background: '#f0f0f0', color: '#6b7280' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 rounded-[8px] text-sm font-semibold" style={{ background: '#ef4444', color: '#ffffff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
