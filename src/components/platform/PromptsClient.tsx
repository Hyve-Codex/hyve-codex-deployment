'use client'

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, Copy, Check, ExternalLink, Star, Send } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { canCopyPrompts } from '@/lib/utils/access'
import type { Prompt } from '@/types'

function extractBrackets(text: string): string[] {
  const matches = text.match(/\[([^\]]+)\]/g) || []
  const unique = [...new Set(matches.map(m => m.slice(1, -1)))]
  return unique
}

function RequestPromptModal({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'prompt', title: topic, description: details }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const json = await res.json()
        setError(json.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full" style={{ maxWidth: 480, background: '#ffffff', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.16)', padding: 32 }}>
        <button onClick={onClose} className="absolute right-5 top-5 transition-opacity hover:opacity-60" style={{ color: '#9ca3af' }}><X size={18} /></button>
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🙌</div>
            <h2 className="font-extrabold text-[#4d4d4d] mb-2" style={{ fontSize: 20 }}>Request received!</h2>
            <p className="text-[14px] text-[#4d4d4d]" style={{ opacity: 0.6 }}>We review every request and add the best ones to the library.</p>
            <button onClick={onClose} className="mt-6 font-bold text-[#4d4d4d] py-2.5 px-8 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150">Close</button>
          </div>
        ) : (
          <>
            <h2 className="font-extrabold text-[#4d4d4d] mb-1" style={{ fontSize: 20 }}>Request a Prompt</h2>
            <p className="text-[13px] text-[#4d4d4d] mb-6" style={{ opacity: 0.6 }}>Tell us what kind of prompt would help you most.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">Topic or use case</label>
                <input type="text" required value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Instagram caption for a product launch" className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">Extra context <span className="normal-case font-normal opacity-50">(optional)</span></label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="Any specifics about your business, audience, or goal…" className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150 resize-none" />
              </div>
              {error && <p className="text-[13px] text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60">
                {loading ? 'Submitting…' : 'Submit Request →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function PromptModal({
  prompt, canCopy, isFavorited, onClose, onToggleFavorite,
}: {
  prompt: Prompt; canCopy: boolean; isFavorited: boolean; onClose: () => void; onToggleFavorite: (id: number) => void
}) {
  const brackets = useMemo(() => extractBrackets(prompt.prompt), [prompt.prompt])
  const [fills, setFills] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const previewText = useMemo(() => {
    return prompt.prompt.replace(/\[([^\]]+)\]/g, (match, key) => {
      const val = fills[key]?.trim()
      return val || match
    })
  }, [prompt.prompt, fills])

  async function handleCopy() {
    await navigator.clipboard.writeText(previewText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full overflow-y-auto" style={{ maxWidth: 600, maxHeight: '88vh', background: '#ffffff', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.16)' }}>
        <div className="sticky top-0 z-10 px-6 pt-5 pb-4" style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3" style={{ background: '#fdf0f4', color: '#ee9fb5' }}>{prompt.subcategory}</span>
              <h2 className="font-extrabold pr-4" style={{ fontSize: 20, color: '#4d4d4d' }}>{prompt.title}</h2>
              <p className="mt-1" style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.6 }}>{prompt.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
              <button onClick={() => onToggleFavorite(prompt.id)} className="transition-opacity hover:opacity-70 p-1" aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
                <Star size={18} style={{ color: isFavorited ? '#ffc107' : '#9ca3af', fill: isFavorited ? '#ffc107' : 'none', transition: 'color 0.15s, fill 0.15s' }} />
              </button>
              <button onClick={onClose} className="transition-opacity hover:opacity-60 p-1" style={{ color: '#9ca3af' }}><X size={18} /></button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {brackets.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>Fill in the blanks</p>
              <div className="flex flex-col gap-3">
                {brackets.map(key => (
                  <div key={key}>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: '#4d4d4d' }}>{key}</label>
                    {key.length > 40 ? (
                      <textarea value={fills[key] || ''} onChange={e => setFills(prev => ({ ...prev, [key]: e.target.value }))} rows={2} className="w-full rounded-lg px-3 py-2 text-[13px] resize-none" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none' }} placeholder={`Enter ${key.toLowerCase()}…`} />
                    ) : (
                      <input type="text" value={fills[key] || ''} onChange={e => setFills(prev => ({ ...prev, [key]: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-[13px]" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none' }} placeholder={`Enter ${key.toLowerCase()}…`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>Prompt Preview</p>
            <div className="rounded-xl p-4 font-mono text-[12px] whitespace-pre-wrap leading-relaxed" style={{ background: '#f7f7f7', border: '1px solid #e8e8e8', color: '#4d4d4d' }}>
              {prompt.prompt.split(/(\[[^\]]+\])/g).map((part, i) => {
                const bracketMatch = part.match(/^\[([^\]]+)\]$/)
                if (bracketMatch) {
                  const key = bracketMatch[1]
                  const val = fills[key]?.trim()
                  if (val) return <strong key={i} style={{ color: '#ffc107' }}>{val}</strong>
                  return <span key={i} className="rounded px-1 py-0.5" style={{ background: '#fdf3d0', color: '#b45309', fontStyle: 'italic' }}>{part}</span>
                }
                return <span key={i}>{part}</span>
              })}
            </div>
          </div>

          {prompt.tip && (
            <div className="mt-4 rounded-xl px-4 py-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-[12px]" style={{ color: '#166534' }}><span className="mr-1.5">💡</span>{prompt.tip}</p>
            </div>
          )}

          <div className="mt-5">
            {canCopy ? (
              <button onClick={handleCopy} className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all duration-150 hover:opacity-90" style={{ background: '#ffc107', color: '#4d4d4d' }}>
                {copied ? <><Check size={15} style={{ color: '#166534' }} /><span style={{ color: '#166534' }}>Copied!</span></> : <><Copy size={15} />Copy Prompt</>}
              </button>
            ) : (
              <button onClick={handleUpgrade} className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all duration-150 hover:opacity-90" style={{ background: '#ffc107', color: '#4d4d4d' }}>
                <ExternalLink size={15} />Upgrade to Copy →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PromptCard({
  prompt, isFavorited, onClick, onToggleFavorite,
}: {
  prompt: Prompt; isFavorited: boolean; onClick: () => void; onToggleFavorite: (e: React.MouseEvent, id: number) => void
}) {
  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-150 cursor-pointer"
      style={{ background: '#ffffff', border: '1px solid #e8e8e8' }}
      onClick={onClick}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; el.style.borderColor = '#ffc107' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = '#e8e8e8' }}
    >
      <div style={{ height: 3, background: '#ffc107' }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: '#fdf0f4', color: '#ee9fb5' }}>{prompt.subcategory}</span>
          <button onClick={e => onToggleFavorite(e, prompt.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 -mr-0.5" style={{ ...(isFavorited ? { opacity: 1 } : {}) }} aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}>
            <Star size={14} style={{ color: isFavorited ? '#ffc107' : '#9ca3af', fill: isFavorited ? '#ffc107' : 'none', transition: 'color 0.15s, fill 0.15s' }} />
          </button>
        </div>
        <h3 className="font-bold leading-snug mb-1.5" style={{ fontSize: 13, color: '#4d4d4d' }}>{prompt.title}</h3>
        <p className="text-[12px] leading-snug" style={{ color: '#4d4d4d', opacity: 0.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prompt.description}</p>
      </div>
    </div>
  )
}

function PromptsInner({ prompts }: { prompts: Prompt[] }) {
  const { subscription } = useUser()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Prompt | null>(null)
  const [showRequest, setShowRequest] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const canCopy = canCopyPrompts(subscription)
  const activeCategory = searchParams.get('category')
  const activeSubcategory = searchParams.get('subcategory')

  useEffect(() => {
    fetch('/api/favorites').then(r => r.json()).then(({ favorites: ids }) => {
      if (Array.isArray(ids)) setFavorites(new Set(ids))
    }).catch(() => {})
  }, [])

  const toggleFavorite = useCallback(async (id: number) => {
    const optimistic = new Set(favorites)
    if (optimistic.has(id)) optimistic.delete(id)
    else optimistic.add(id)
    setFavorites(optimistic)
    try {
      await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt_id: id }) })
    } catch {
      setFavorites(favorites)
    }
  }, [favorites])

  function handleCardStarClick(e: React.MouseEvent, id: number) { e.stopPropagation(); toggleFavorite(id) }

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      if (showFavoritesOnly && !favorites.has(p.id)) return false
      if (activeSubcategory && p.subcategory !== activeSubcategory) return false
      if (activeCategory && !activeSubcategory && p.category !== activeCategory) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
      }
      return true
    })
  }, [prompts, activeCategory, activeSubcategory, search, showFavoritesOnly, favorites])

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="font-extrabold" style={{ fontSize: 22, color: '#4d4d4d' }}>Prompt Library</h1>
          <span style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.45 }}>{filtered.length} prompt{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={() => setShowRequest(true)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4d4d4d] px-3 py-2 rounded-lg transition-colors duration-150 hover:bg-[#fdf3d0]" style={{ border: '1px solid #e8e8e8' }}>
          <Send size={12} />Request a Prompt
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts…" className="rounded-xl px-4 py-2.5 text-[13px]" style={{ background: '#ffffff', border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none', width: 240 }} />
        <button onClick={() => setShowFavoritesOnly(v => !v)} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2.5 rounded-xl transition-colors duration-150" style={{ border: '1px solid #e8e8e8', background: showFavoritesOnly ? '#fdf3d0' : '#ffffff', color: showFavoritesOnly ? '#ffc107' : '#4d4d4d' }}>
          <Star size={13} style={{ color: showFavoritesOnly ? '#ffc107' : '#9ca3af', fill: showFavoritesOnly ? '#ffc107' : 'none' }} />
          Saved ({favorites.size})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.5 }}>{showFavoritesOnly ? 'No saved prompts yet. Click the star on any prompt to save it.' : 'No prompts match your search.'}</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => <PromptCard key={p.id} prompt={p} isFavorited={favorites.has(p.id)} onClick={() => setSelected(p)} onToggleFavorite={handleCardStarClick} />)}
        </div>
      )}

      {selected && <PromptModal prompt={selected} canCopy={canCopy} isFavorited={favorites.has(selected.id)} onClose={() => setSelected(null)} onToggleFavorite={toggleFavorite} />}
      {showRequest && <RequestPromptModal onClose={() => setShowRequest(false)} />}
    </>
  )
}

export default function PromptsClient({ prompts }: { prompts: Prompt[] }) {
  return (
    <Suspense fallback={null}>
      <PromptsInner prompts={prompts} />
    </Suspense>
  )
}
