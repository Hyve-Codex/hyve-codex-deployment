import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET() {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('category', { ascending: true })
    .order('title', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prompts: data })
}

export async function POST(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { category, subcategory, title, description, tip, prompt, is_active } = body
  if (!category || !title || !prompt) {
    return NextResponse.json({ error: 'category, title, and prompt are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prompts')
    .insert({ category, subcategory, title, description, tip, prompt, is_active: is_active ?? true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prompt: data })
}

export async function PATCH(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('prompts').update(updates).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('prompts').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
