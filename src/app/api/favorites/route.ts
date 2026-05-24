import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — return the current user's favorited prompt IDs
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ favorites: [] })
  }

  try {
    const { data } = await supabase
      .from('prompt_favorites')
      .select('prompt_id')
      .eq('user_id', user.id)

    return NextResponse.json({ favorites: (data ?? []).map((r: { prompt_id: number }) => r.prompt_id) })
  } catch {
    return NextResponse.json({ favorites: [] })
  }
}

// POST — toggle a favorite
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { prompt_id } = await req.json()
  if (!prompt_id) {
    return NextResponse.json({ error: 'Missing prompt_id' }, { status: 400 })
  }

  try {
    const { data: existing } = await supabase
      .from('prompt_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', prompt_id)
      .single()

    if (existing) {
      await supabase
        .from('prompt_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', prompt_id)
      return NextResponse.json({ favorited: false })
    } else {
      await supabase
        .from('prompt_favorites')
        .insert({ user_id: user.id, prompt_id })
      return NextResponse.json({ favorited: true })
    }
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
