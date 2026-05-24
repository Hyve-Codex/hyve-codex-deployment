import { createClient } from '@/lib/supabase/server'
import CommandsClient from '@/components/platform/CommandsClient'

export default async function CommandsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('commands')
    .select('id, category, keys, description, platform')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return <CommandsClient commands={data ?? []} />
}
