import { createClient } from '@/lib/supabase/server'
import PromptsClient from '@/components/platform/PromptsClient'
import type { Prompt } from '@/types'

export default async function PromptsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('prompts')
    .select('id, category, subcategory, title, description, tip, prompt')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const prompts: Prompt[] = (data ?? []).map(p => ({
    id: p.id,
    category: p.category,
    subcategory: p.subcategory,
    title: p.title,
    description: p.description ?? '',
    tip: p.tip ?? '',
    prompt: p.prompt,
  }))

  return <PromptsClient prompts={prompts} />
}
