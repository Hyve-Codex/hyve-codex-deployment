/**
 * SEED SCRIPT — run once after creating the content tables
 *
 * HOW TO RUN:
 * 1. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local
 * 2. Run: npx tsx src/lib/supabase/seed.ts
 * 3. After seeding, all content is managed from /admin
 *
 * WARNING: This script uses UPSERT — safe to run multiple times.
 */

import { createClient } from '@supabase/supabase-js'
import { prompts } from '@/lib/data/prompts'
import { skills } from '@/lib/data/skills'
import { commands } from '@/lib/data/commands'
import { tools } from '@/lib/data/tools'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('Seeding prompts…')
  const { error: pe } = await supabase.from('prompts').upsert(
    prompts.map((p, i) => ({
      id: p.id,
      category: p.category,
      subcategory: p.subcategory,
      title: p.title,
      description: p.description,
      tip: p.tip,
      prompt: p.prompt,
      is_active: true,
      sort_order: i,
    }))
  )
  if (pe) console.error('Prompts error:', pe)
  else console.log(`  ✓ ${prompts.length} prompts seeded`)

  console.log('Seeding skills…')
  const { error: se } = await supabase.from('skills').upsert(
    skills.map((s, i) => ({
      id: s.id,
      name: s.name,
      author: s.author,
      category: s.category,
      description: s.description,
      install_url: s.installUrl,
      is_active: true,
      sort_order: i,
    }))
  )
  if (se) console.error('Skills error:', se)
  else console.log(`  ✓ ${skills.length} skills seeded`)

  console.log('Seeding commands…')
  const { error: ce } = await supabase.from('commands').upsert(
    commands.map((c, i) => ({
      id: c.id,
      category: c.category,
      keys: c.keys,
      description: c.description,
      platform: c.platform,
      is_active: true,
      sort_order: i,
    }))
  )
  if (ce) console.error('Commands error:', ce)
  else console.log(`  ✓ ${commands.length} commands seeded`)

  console.log('Seeding tools…')
  const { error: te } = await supabase.from('ai_tools').upsert(
    tools.map((t, i) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      tagline: t.tagline,
      description: t.description,
      we_use_this: t.weUseThis,
      referral_url: t.referralUrl,
      is_active: true,
      sort_order: i,
    }))
  )
  if (te) console.error('Tools error:', te)
  else console.log(`  ✓ ${tools.length} tools seeded`)

  console.log('\nSeed complete.')
}

seed().catch(console.error)
