import { createClient } from '@/lib/supabase/server'

function StatCard({ icon, label, value, sub, highlight }: {
  icon: string; label: string; value: number; sub?: string; highlight?: boolean
}) {
  return (
    <div
      className="rounded-[12px] p-6"
      style={{
        background: '#ffffff',
        border: `1px solid ${highlight ? '#ffc107' : '#e8e8e8'}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <p className="font-extrabold" style={{ fontSize: 32, color: '#4d4d4d', lineHeight: 1 }}>
        {value.toLocaleString()}
      </p>
      <p className="font-semibold mt-1" style={{ fontSize: 13, color: '#4d4d4d' }}>
        {label}
      </p>
      {sub && (
        <p className="mt-1" style={{ fontSize: 11, color: '#4d4d4d', opacity: 0.5 }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    trial:    { bg: '#fdf3d0', color: '#b45309', label: 'Trial' },
    active:   { bg: '#f0fdf4', color: '#10b981', label: 'Active' },
    canceled: { bg: '#f7f7f7', color: '#6b7280', label: 'Canceled' },
    past_due: { bg: '#fef3c7', color: '#d97706', label: 'Past Due' },
    inactive: { bg: '#f7f7f7', color: '#9ca3af', label: 'Inactive' },
  }
  const s = map[status] ?? map.inactive
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export default async function AdminOverview() {
  const supabase = await createClient()

  const [
    { data: profiles },
    { data: subscriptions },
    { data: leads },
    { count: newSuggestions },
  ] = await Promise.all([
    supabase.from('profiles').select('id, first_name, email, created_at').eq('is_admin', false).order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, status, trial_started_at, current_period_end'),
    supabase.from('lead_magnet_access').select('id, is_active'),
    supabase.from('suggestions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const subMap = new Map((subscriptions ?? []).map(s => [s.user_id, s]))
  const now = Date.now()
  const TRIAL_MS = 14 * 24 * 60 * 60 * 1000

  const totalUsers = (profiles ?? []).length
  const activeTrials = (subscriptions ?? []).filter(s =>
    s.status === 'trial' && s.trial_started_at && (now - new Date(s.trial_started_at).getTime()) < TRIAL_MS
  ).length
  const paying = (subscriptions ?? []).filter(s => s.status === 'active').length
  const expiredTrials = (subscriptions ?? []).filter(s =>
    s.status === 'trial' && s.trial_started_at && (now - new Date(s.trial_started_at).getTime()) >= TRIAL_MS
  ).length
  const canceled = (subscriptions ?? []).filter(s => s.status === 'canceled').length
  const totalLeads = (leads ?? []).length
  const activeLeads = (leads ?? []).filter(l => l.is_active).length

  const recentProfiles = (profiles ?? []).slice(0, 10)

  return (
    <div>
      <h1 className="font-extrabold mb-1" style={{ fontSize: 22, color: '#4d4d4d' }}>Overview</h1>
      <p className="mb-8" style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>
        Platform metrics at a glance.
      </p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon="👤" label="Total Users" value={totalUsers} />
        <StatCard icon="⏳" label="Active Trials" value={activeTrials} sub="In 14-day trial" />
        <StatCard icon="💳" label="Paying Subscribers" value={paying} sub={`$${paying * 47} MRR`} />
        <StatCard icon="📉" label="Expired (Not Converted)" value={expiredTrials} />
        <StatCard icon="✕" label="Canceled" value={canceled} />
        <StatCard icon="📧" label="Lead Magnet Signups" value={totalLeads} />
        <StatCard icon="✅" label="Active Lead Magnet" value={activeLeads} />
        <StatCard icon="💬" label="New Suggestions" value={newSuggestions ?? 0} highlight={(newSuggestions ?? 0) > 0} />
      </div>

      {/* Recent signups */}
      <h2 className="font-bold mb-3" style={{ fontSize: 16, color: '#4d4d4d' }}>Recent Signups</h2>
      <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['Name', 'Email', 'Joined', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentProfiles.map((p, i) => {
              const sub = subMap.get(p.id)
              return (
                <tr
                  key={p.id}
                  style={{ borderTop: i > 0 ? '1px solid #e8e8e8' : 'none', background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  <td className="px-4 py-3 font-semibold text-[13px]" style={{ color: '#4d4d4d', height: 44 }}>
                    {p.first_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#4d4d4d', opacity: 0.7 }}>
                    {p.email}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#4d4d4d', opacity: 0.55 }}>
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub?.status ?? 'inactive'} />
                  </td>
                </tr>
              )
            })}
            {recentProfiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[13px]" style={{ color: '#9ca3af' }}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
