import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function PATCH(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { suggestionId, status } = await req.json()
  if (!suggestionId || !status) {
    return NextResponse.json({ error: 'suggestionId and status are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('suggestions')
    .update({ status })
    .eq('id', suggestionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
