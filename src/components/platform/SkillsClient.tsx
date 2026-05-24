'use client'

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Copy, Check, Heart, X, Send } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { canAccessSkills } from '@/lib/utils/access'
import TrialExpiredOverlay from '@/components/platform/TrialExpiredOverlay'

type Skill = {
  id: number
  name: string
  author: string | null
  category: string
  description: string | null
  install_url: string | null
}

function RequestSkillModal({ onClose }: { onClose: () => void }) {
  const [skillName, setSkillName] = useState('')
  const [useCase, setUseCase] = useState('')
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
        body: JSON.stringify({ type: 'skill', title: skillName, description: useCase }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full" style={{ maxWidth: 480, background: '#ffffff', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.16)', padding: 32 }}>
        <button onClick={onClose} className="absolute right-5 top-5 transition-opacity hover:opacity-60" style={{ color: '#9ca3af' }}><X size={18} /></button>
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🙌</div>
            <h2 className="font-extrabold text-[#4d4d4d] mb-2" style={{ fontSize: 20 }}>Request received!</h2>
            <p className="text-[14px] text-[#4d4d4d]" style={{ opacity: 0.6 }}>We review every request and add the best ones to the directory.</p>
            <button onClick={onClose} className="mt-6 font-bold text-[#4d4d4d] py-2.5 px-8 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150">Close</button>
          </div>
        ) : (
          <>
            <h2 className="font-extrabold text-[#4d4d4d] mb-1" style={{ fontSize: 20 }}>Request a Skill</h2>
            <p className="text-[13px] text-[#4d4d4d] mb-6" style={{ opacity: 0.6 }}>Tell us what skill would make your workflow better.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">Skill or tool name</label>
                <input type="text" required value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="e.g. LinkedIn Post Writer" className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">What would you use it for? <span className="normal-case font-normal opacity-50">(optional)</span></label>
                <textarea value={useCase} onChange={e => setUseCase(e.target.value)} rows={3} placeholder="Describe the task or workflow…" className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150 resize-none" />
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

function SkillCard({
  skill, reactionCount, userReacted, onToggleReaction,
}: {
  skill: Skill; reactionCount: number; userReacted: boolean; onToggleReaction: (id: number) => void
}) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  async function handleCopy() {
    if (!skill.install_url) return
    await navigator.clipboard.writeText(skill.install_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl overflow-hidden transition-all duration-150" style={{ background: '#ffffff', border: '1px solid #e8e8e8' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ height: 3, background: '#ee9fb5' }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: '#fdf0f4', color: '#ee9fb5' }}>{skill.category}</span>
          <button onClick={() => onToggleReaction(skill.id)} className="flex items-center gap-1 transition-opacity hover:opacity-70" aria-label={userReacted ? 'Remove reaction' : 'React to this skill'}>
            <Heart size={13} style={{ color: userReacted ? '#ee9fb5' : '#9ca3af', fill: userReacted ? '#ee9fb5' : 'none', transition: 'color 0.15s, fill 0.15s' }} />
            {reactionCount > 0 && <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>{reactionCount}</span>}
          </button>
        </div>
        <h3 className="font-bold mb-0.5" style={{ fontSize: 14, color: '#4d4d4d' }}>{skill.name}</h3>
        <p className="mb-3 text-[11px]" style={{ color: '#9ca3af' }}>by {skill.author ?? 'Unknown'}</p>
        <p className="text-[12px] leading-relaxed" style={{ color: '#4d4d4d', opacity: 0.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{skill.description}</p>
        {skill.install_url && (
          <div className="mt-4 transition-all duration-150" style={{ opacity: hovered ? 1 : 0 }}>
            <button onClick={handleCopy} className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[12px] font-medium transition-colors duration-150 hover:bg-[#f7f7f7]" style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}>
              {copied ? <><Check size={12} style={{ color: '#10b981' }} /><span style={{ color: '#10b981' }}>Copied!</span></> : <><Copy size={12} />Copy Link</>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SkillsInner({ skills }: { skills: Skill[] }) {
  const { subscription } = useUser()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [reactionCounts, setReactionCounts] = useState<Record<number, number>>({})
  const [userReacted, setUserReacted] = useState<Set<number>>(new Set())

  const locked = !canAccessSkills(subscription)
  const activeCategory = searchParams.get('category')

  useEffect(() => {
    fetch('/api/reactions').then(r => r.json()).then(({ counts, userReacted: mine }) => {
      if (counts) setReactionCounts(counts)
      if (Array.isArray(mine)) setUserReacted(new Set(mine))
    }).catch(() => {})
  }, [])

  const toggleReaction = useCallback(async (skillId: number) => {
    const isReacted = userReacted.has(skillId)
    const newReacted = new Set(userReacted)
    const newCounts = { ...reactionCounts }
    if (isReacted) { newReacted.delete(skillId); newCounts[skillId] = Math.max(0, (newCounts[skillId] ?? 1) - 1) }
    else { newReacted.add(skillId); newCounts[skillId] = (newCounts[skillId] ?? 0) + 1 }
    setUserReacted(newReacted)
    setReactionCounts(newCounts)
    try {
      await fetch('/api/reactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ skill_id: skillId }) })
    } catch {
      setUserReacted(userReacted)
      setReactionCounts(reactionCounts)
    }
  }, [userReacted, reactionCounts])

  const filtered = useMemo(() => {
    return skills.filter(s => {
      if (activeCategory && s.category !== activeCategory) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return s.name.toLowerCase().includes(q) || (s.author ?? '').toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q)
      }
      return true
    })
  }, [skills, activeCategory, search])

  return (
    <div className={`relative ${locked ? 'overflow-hidden' : ''}`}>
      <div style={{ filter: locked ? 'blur(6px)' : 'none', pointerEvents: locked ? 'none' : 'auto' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="font-extrabold" style={{ fontSize: 22, color: '#4d4d4d' }}>Skills Directory</h1>
            <span style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.45 }}>{filtered.length} skill{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={() => setShowRequest(true)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4d4d4d] px-3 py-2 rounded-lg transition-colors duration-150 hover:bg-[#fdf0f4]" style={{ border: '1px solid #e8e8e8' }}>
            <Send size={12} />Request a Skill
          </button>
        </div>
        <div className="mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills…" className="w-full max-w-md rounded-xl px-4 py-2.5 text-[13px]" style={{ background: '#ffffff', border: '1px solid #e8e8e8', color: '#4d4d4d', outline: 'none' }} />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(s => <SkillCard key={s.id} skill={s} reactionCount={reactionCounts[s.id] ?? 0} userReacted={userReacted.has(s.id)} onToggleReaction={toggleReaction} />)}
        </div>
      </div>
      {locked && <TrialExpiredOverlay />}
      {showRequest && !locked && <RequestSkillModal onClose={() => setShowRequest(false)} />}
    </div>
  )
}

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  return (
    <Suspense fallback={null}>
      <SkillsInner skills={skills} />
    </Suspense>
  )
}
