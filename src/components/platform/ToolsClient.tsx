'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { canAccessTools } from '@/lib/utils/access'
import TrialExpiredOverlay from '@/components/platform/TrialExpiredOverlay'

type AITool = {
  id: number
  name: string
  category: string
  tagline: string | null
  description: string | null
  we_use_this: boolean
  referral_url: string | null
}

const BRAND: Record<string, { bg: string; fg: string; letters: string }> = {
  Claude:    { bg: '#CC785C', fg: '#ffffff', letters: 'Cl' },
  Canva:     { bg: '#00C4CC', fg: '#ffffff', letters: 'Ca' },
  Metricool: { bg: '#7B3FF6', fg: '#ffffff', letters: 'Mc' },
  CapCut:    { bg: '#000000', fg: '#ffffff', letters: 'CC' },
  Descript:  { bg: '#1B1F3B', fg: '#ffffff', letters: 'De' },
  Kit:       { bg: '#FB6500', fg: '#ffffff', letters: 'Ki' },
  Zapier:    { bg: '#FF4A00', fg: '#ffffff', letters: 'Za' },
  Airtable:  { bg: '#FCAB40', fg: '#1a1a1a', letters: 'At' },
  Zoom:      { bg: '#2D8CFF', fg: '#ffffff', letters: 'Zo' },
  Notion:    { bg: '#1a1a1a', fg: '#ffffff', letters: 'No' },
  Circle:    { bg: '#5A3FE5', fg: '#ffffff', letters: 'Ci' },
  ManyChat:  { bg: '#01B88D', fg: '#ffffff', letters: 'MC' },
}

function ToolLogo({ name }: { name: string }) {
  const brand = BRAND[name] ?? { bg: '#e8e8e8', fg: '#4d4d4d', letters: name.slice(0, 2) }
  return (
    <div className="flex items-center justify-center rounded-lg flex-shrink-0 font-bold" style={{ width: 36, height: 36, background: brand.bg, color: brand.fg, fontSize: 11, letterSpacing: '0.02em' }}>
      {brand.letters}
    </div>
  )
}

function ToolCard({ tool }: { tool: AITool }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150 flex flex-col"
      style={{ background: '#ffffff', border: '1px solid #e8e8e8' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
    >
      <div style={{ height: 3, background: '#ffc107' }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3">
          <ToolLogo name={tool.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold leading-tight" style={{ fontSize: 15, color: '#4d4d4d' }}>{tool.name}</h3>
              {tool.we_use_this && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#f0fdf4', color: '#10b981' }}>We use this ✓</span>
              )}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: '#fdf3d0', color: '#b45309' }}>{tool.category}</span>
          </div>
        </div>
        {tool.tagline && <p className="mb-2 italic" style={{ fontSize: 12, color: '#4d4d4d', opacity: 0.5 }}>{tool.tagline}</p>}
        <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: '#4d4d4d', opacity: 0.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tool.description}</p>
        {tool.referral_url && (
          <a href={tool.referral_url} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[12px] font-medium no-underline transition-colors duration-150 hover:bg-[#f7f7f7]" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}>
            Try it → <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

function ToolsInner({ tools }: { tools: AITool[] }) {
  const { subscription } = useUser()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')

  const locked = !canAccessTools(subscription)
  const activeCategory = searchParams.get('category')

  const filtered = useMemo(() => {
    return tools.filter(t => {
      if (activeCategory && t.category !== activeCategory) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.tagline ?? '').toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
      }
      return true
    })
  }, [tools, activeCategory, search])

  return (
    <div className={`relative ${locked ? 'overflow-hidden' : ''}`}>
      <div style={{ filter: locked ? 'blur(6px)' : 'none', pointerEvents: locked ? 'none' : 'auto' }}>
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="font-extrabold" style={{ fontSize: 22, color: '#4d4d4d' }}>AI Tool Recommendations</h1>
        </div>
        <p className="mb-5" style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>Tools our team uses daily. Every link is a vetted recommendation.</p>
        <div className="mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools…" className="w-full max-w-md rounded-xl px-4 py-2.5 text-[13px]" style={{ background: '#ffffff', border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none' }} />
        </div>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.5 }}>No tools match your search.</p>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </div>
      {locked && <TrialExpiredOverlay />}
    </div>
  )
}

export default function ToolsClient({ tools }: { tools: AITool[] }) {
  return (
    <Suspense fallback={null}>
      <ToolsInner tools={tools} />
    </Suspense>
  )
}
