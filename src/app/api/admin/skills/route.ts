import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET() {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skills: data })
}

export async function POST(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, author, category, description, install_url, is_active } = body
  if (!name || !category) {
    return NextResponse.json({ error: 'name and category are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .insert({ name, author, category, description, install_url, is_active: is_active ?? true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skill: data })
}

export async function PATCH(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('skills').update(updates).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
