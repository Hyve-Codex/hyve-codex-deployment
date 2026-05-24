import { createClient } from '@/lib/supabase/server'
import SkillsClient from '@/components/platform/SkillsClient'

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skills')
    .select('id, name, author, category, description, install_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return <SkillsClient skills={data ?? []} />
}
