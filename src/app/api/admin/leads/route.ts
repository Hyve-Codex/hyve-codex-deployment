import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'

export async function GET() {
  const admin = await isUserAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = await createClient()
  const { data: leads, error } = await supabase
    .from('lead_magnet_access')
    .select('id, email, first_name, quiz_answers, is_active, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads })
}
