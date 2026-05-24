import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function POST(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, status, plan, trial_started_at, current_period_end, admin_notes } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const supabase = await createClient()
  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (plan !== undefined) updates.plan = plan
  if (trial_started_at !== undefined) updates.trial_started_at = trial_started_at || null
  if (current_period_end !== undefined) updates.current_period_end = current_period_end || null
  if (admin_notes !== undefined) updates.admin_notes = admin_notes

  const { error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
