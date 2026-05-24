import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.toLowerCase() ?? ''
  const status = searchParams.get('status') ?? ''

  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_at')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  const { data: profiles, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('user_id, status, plan, trial_started_at, current_period_end, admin_notes')

  const subMap = new Map((subscriptions ?? []).map(s => [s.user_id, s]))

  let users = (profiles ?? []).map(p => ({
    ...p,
    subscription: subMap.get(p.id) ?? null,
  }))

  if (status) {
    users = users.filter(u => (u.subscription?.status ?? 'inactive') === status)
  }

  return NextResponse.json({ users })
}
