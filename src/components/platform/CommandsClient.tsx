'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { canAccessCommands } from '@/lib/utils/access'
import TrialExpiredOverlay from '@/components/platform/TrialExpiredOverlay'

type Command = {
  id: number
  category: string
  keys: string
  description: string
  platform: string
}

function CommandRow({ command }: { command: Command }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(command.keys)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex w-full items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors duration-100"
      style={{ background: 'transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fdf3d0' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <span className="flex-shrink-0 font-mono font-semibold text-[12px] px-2.5 py-1 rounded-md" style={{ background: '#f7f7f7', border: '1px solid #e8e8e8', color: '#4d4d4d', whiteSpace: 'nowrap', minWidth: 'max-content' }}>
        {command.keys}
      </span>
      <span className="flex-1 text-[13px]" style={{ color: '#4d4d4d', opacity: 0.8 }}>{command.description}</span>
      <span className="flex-shrink-0 transition-opacity" style={{ opacity: copied ? 1 : 0 }}>
        {copied && <Check size={13} style={{ color: '#10b981' }} />}
      </span>
    </button>
  )
}

function CommandsInner({ commands }: { commands: Command[] }) {
  const { subscription } = useUser()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')

  const locked = !canAccessCommands(subscription)
  const activeCategory = searchParams.get('category')

  const categories = useMemo(() => [...new Set(commands.map(c => c.category))], [commands])

  const filtered = useMemo(() => {
    return commands.filter(c => {
      if (activeCategory && c.category !== activeCategory) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return c.keys.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      }
      return true
    })
  }, [commands, activeCategory, search])

  const groupedCategories = useMemo(() => {
    const cats = activeCategory ? [activeCategory] : categories
    return cats.map(cat => ({
      category: cat,
      items: filtered.filter(c => c.category === cat),
    })).filter(g => g.items.length > 0)
  }, [filtered, categories, activeCategory])

  return (
    <div className={`relative ${locked ? 'overflow-hidden' : ''}`}>
      <div style={{ filter: locked ? 'blur(6px)' : 'none', pointerEvents: locked ? 'none' : 'auto' }}>
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="font-extrabold" style={{ fontSize: 22, color: '#4d4d4d' }}>Commands &amp; Shortcuts</h1>
        </div>
        <p className="mb-5" style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>The fastest ways to move inside Claude.</p>
        <div className="mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search commands…" className="w-full max-w-md rounded-xl px-4 py-2.5 text-[13px]" style={{ background: '#ffffff', border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groupedCategories.map(({ category, items }) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{category}</span>
                <div className="flex-1" style={{ height: 1, background: '#e8e8e8' }} />
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e8e8e8', background: '#ffffff' }}>
                {items.map((cmd, i) => (
                  <div key={cmd.id} style={{ borderTop: i > 0 ? '1px solid #e8e8e8' : 'none' }}>
                    <CommandRow command={cmd} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {locked && <TrialExpiredOverlay />}
    </div>
  )
}

export default function CommandsClient({ commands }: { commands: Command[] }) {
  return (
    <Suspense fallback={null}>
      <CommandsInner commands={commands} />
    </Suspense>
  )
}
