import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, title, description } = await req.json()
  if (!type || !title) {
    return NextResponse.json({ error: 'type and title are required' }, { status: 400 })
  }

  const { error } = await supabase.from('suggestions').insert({
    user_id: user.id,
    type,
    title,
    description: description || null,
    status: 'new',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
