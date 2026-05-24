import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function POST(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, access_ends_at, notes } = await req.json()
  if (!email || !access_ends_at) {
    return NextResponse.json({ error: 'email and access_ends_at are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if already granted
  const { data: existing } = await supabase
    .from('admin_granted_subscriptions')
    .select('id, redeemed, redeemed_by_user_id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing?.redeemed && existing.redeemed_by_user_id) {
    // User already signed up — update their subscription directly
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (profile) {
      await supabase
        .from('subscriptions')
        .update({ status: 'active', plan: 'full_codex', current_period_end: access_ends_at })
        .eq('user_id', profile.id)
    }
    return NextResponse.json({ success: true })
  }

  if (existing) {
    // Update existing unredeemed grant
    await supabase
      .from('admin_granted_subscriptions')
      .update({ access_ends_at, notes, granted_by: user?.id })
      .eq('id', existing.id)
  } else {
    // New grant
    await supabase.from('admin_granted_subscriptions').insert({
      email: email.toLowerCase(),
      granted_by: user?.id,
      plan: 'full_codex',
      access_ends_at,
      notes,
    })
  }

  return NextResponse.json({ success: true })
}
