import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('platform_settings').select('key, value')

  const settings: Record<string, string> = {}
  for (const row of data ?? []) settings[row.key] = row.value
  return NextResponse.json({ settings })
}

export async function PATCH(req: Request) {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { key, value } = await req.json()
  if (!key || value === undefined) {
    return NextResponse.json({ error: 'key and value are required' }, { status: 400 })
  }

  const supabase = await createClient()
  await supabase
    .from('platform_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })

  return NextResponse.json({ success: true })
}
