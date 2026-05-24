'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, UserPlus } from 'lucide-react'
import EditUserModal from '@/components/admin/EditUserModal'
import GrantAccessModal from '@/components/admin/GrantAccessModal'

type UserRow = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  subscription: {
    status: string
    plan: string
    trial_started_at: string | null
    current_period_end: string | null
    admin_notes: string | null
  } | null
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  trial:    { bg: '#fdf3d0', color: '#b45309', label: 'Trial' },
  active:   { bg: '#f0fdf4', color: '#10b981', label: 'Active' },
  canceled: { bg: '#f7f7f7', color: '#6b7280', label: 'Canceled' },
  past_due: { bg: '#fef3c7', color: '#d97706', label: 'Past Due' },
  inactive: { bg: '#f7f7f7', color: '#9ca3af', label: 'Inactive' },
}

const FILTER_OPTIONS = ['all', 'trial', 'active', 'canceled', 'past_due', 'inactive']
const PAGE_SIZE = 25

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.inactive
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [showGrant, setShowGrant] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filter !== 'all') params.set('status', filter)
      params.set('page', String(page))
      const res = await fetch(`/api/admin/users?${params}`)
      const json = await res.json()
      setUsers(json.users ?? [])
    } finally {
      setLoading(false)
    }
  }, [search, filter, page])

  useEffect(() => { loadUsers() }, [loadUsers])

  function handleSearchChange(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleFilterChange(val: string) {
    setFilter(val)
    setPage(1)
  }

  const totalPages = Math.ceil(users.length / PAGE_SIZE)
  const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Users</h1>
          <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>
            Manage user accounts and subscriptions.
          </p>
        </div>
        <button
          onClick={() => setShowGrant(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-[8px] font-semibold text-sm"
          style={{ background: '#ffc107', color: '#4d4d4d' }}
        >
          <UserPlus size={15} />
          Grant Access
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-[8px] text-sm outline-none"
            style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => handleFilterChange(opt)}
              className="px-3 py-1.5 rounded-[6px] text-[12px] font-semibold capitalize"
              style={{
                background: filter === opt ? '#ffc107' : '#ffffff',
                color: filter === opt ? '#4d4d4d' : '#6b7280',
                border: `1px solid ${filter === opt ? '#ffc107' : '#e8e8e8'}`,
              }}
            >
              {opt === 'all' ? 'All' : opt.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['Name', 'Email', 'Joined', 'Status', 'Plan', 'Period End', ''].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>
                  Loading…
                </td>
              </tr>
            ) : pagedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#9ca3af' }}>
                  No users found.
                </td>
              </tr>
            ) : pagedUsers.map((u, i) => {
              const sub = u.subscription
              return (
                <tr
                  key={u.id}
                  style={{ borderTop: i > 0 ? '1px solid #e8e8e8' : 'none', background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  <td className="px-4 py-3 font-semibold text-[13px]" style={{ color: '#4d4d4d', height: 48 }}>
                    {u.first_name || u.last_name
                      ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#4d4d4d', opacity: 0.7, maxWidth: 200 }}>
                    <span className="truncate block">{u.email}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#4d4d4d', opacity: 0.55 }}>
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub?.status ?? 'inactive'} />
                  </td>
                  <td className="px-4 py-3 text-[13px] capitalize" style={{ color: '#6b7280' }}>
                    {sub?.plan?.replace('_', ' ') ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
                    {sub?.current_period_end
                      ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditUser(u)}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-[6px]"
                      style={{ background: '#f0f2f7', color: '#4d4d4d' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[13px]" style={{ color: '#9ca3af' }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-[6px] text-[12px] font-semibold"
              style={{ background: '#f0f0f0', color: '#4d4d4d', opacity: page === 1 ? 0.4 : 1 }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-[6px] text-[12px] font-semibold"
              style={{ background: '#f0f0f0', color: '#4d4d4d', opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          subscription={editUser.subscription}
          onClose={() => setEditUser(null)}
          onSave={() => { setEditUser(null); loadUsers() }}
        />
      )}

      {showGrant && (
        <GrantAccessModal
          onClose={() => setShowGrant(false)}
          onSave={() => { setShowGrant(false); loadUsers() }}
        />
      )}
    </div>
  )
}
