import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''

  const supabase = await createClient()

  let query = supabase
    .from('suggestions')
    .select('id, type, title, description, status, created_at, user_id')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: suggestions, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const userIds = [...new Set((suggestions ?? []).map(s => s.user_id).filter(Boolean))]
  let emailMap: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds)
    emailMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.email]))
  }

  const result = (suggestions ?? []).map(s => ({
    ...s,
    user_email: s.user_id ? (emailMap[s.user_id] ?? null) : null,
  }))

  return NextResponse.json({ suggestions: result })
}
