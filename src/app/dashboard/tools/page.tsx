import { createClient } from '@/lib/supabase/server'
import ToolsClient from '@/components/platform/ToolsClient'

export default async function ToolsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ai_tools')
    .select('id, name, category, tagline, description, we_use_this, referral_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return <ToolsClient tools={data ?? []} />
}
