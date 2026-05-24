import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — return global reaction counts + user's reacted skill IDs
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  try {
    // Global counts per skill
    const { data: counts } = await supabase
      .from('skill_reactions')
      .select('skill_id')

    const countMap: Record<number, number> = {}
    for (const row of counts ?? []) {
      countMap[row.skill_id] = (countMap[row.skill_id] ?? 0) + 1
    }

    // User's own reactions
    let userReacted: number[] = []
    if (user) {
      const { data: mine } = await supabase
        .from('skill_reactions')
        .select('skill_id')
        .eq('user_id', user.id)
      userReacted = (mine ?? []).map((r: { skill_id: number }) => r.skill_id)
    }

    return NextResponse.json({ counts: countMap, userReacted })
  } catch {
    return NextResponse.json({ counts: {}, userReacted: [] })
  }
}

// POST — toggle a reaction
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { skill_id } = await req.json()
  if (!skill_id) {
    return NextResponse.json({ error: 'Missing skill_id' }, { status: 400 })
  }

  try {
    const { data: existing } = await supabase
      .from('skill_reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('skill_id', skill_id)
      .single()

    if (existing) {
      await supabase
        .from('skill_reactions')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skill_id)
      return NextResponse.json({ reacted: false })
    } else {
      await supabase
        .from('skill_reactions')
        .insert({ user_id: user.id, skill_id })
      return NextResponse.json({ reacted: true })
    }
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
