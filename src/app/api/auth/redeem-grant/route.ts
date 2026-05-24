import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ redeemed: false })

  const email = user.email?.toLowerCase()
  if (!email) return NextResponse.json({ redeemed: false })

  const { data: grant } = await supabase
    .from('admin_granted_subscriptions')
    .select('id, plan, access_ends_at, redeemed')
    .eq('email', email)
    .eq('redeemed', false)
    .single()

  if (!grant) return NextResponse.json({ redeemed: false })

  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      plan: grant.plan ?? 'full_codex',
      current_period_end: grant.access_ends_at,
    })
    .eq('user_id', user.id)

  await supabase
    .from('admin_granted_subscriptions')
    .update({ redeemed: true, redeemed_by_user_id: user.id })
    .eq('id', grant.id)

  return NextResponse.json({ redeemed: true })
}
