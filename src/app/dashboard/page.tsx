'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { BookOpen, Zap, Terminal, Wrench, X } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { canAccessFullCodex } from '@/lib/utils/access'

const PILLARS = [
  {
    href: '/dashboard/prompts',
    icon: BookOpen,
    title: 'Prompt Library',
    description: '59 fill-in-the-blanks prompts for marketing, content, operations, and more.',
    accent: '#ffc107',
    accentBg: '#fdf3d0',
    accentBar: '#ffc107',
    count: '59 prompts',
    locked: false,
  },
  {
    href: '/dashboard/skills',
    icon: Zap,
    title: 'Skills Directory',
    description: '12 curated Claude skills and browser extensions to upgrade your workflow.',
    accent: '#ee9fb5',
    accentBg: '#fdf0f4',
    accentBar: '#ee9fb5',
    count: '12 skills',
    locked: true,
  },
  {
    href: '/dashboard/commands',
    icon: Terminal,
    title: 'Commands & Shortcuts',
    description: 'The fastest keyboard shortcuts and commands inside Claude and the browser.',
    accent: '#4d4d4d',
    accentBg: '#f7f7f7',
    accentBar: '#4d4d4d',
    count: '15 shortcuts',
    locked: true,
  },
  {
    href: '/dashboard/tools',
    icon: Wrench,
    title: 'AI Tool Recommendations',
    description: 'The exact tools our team uses daily. Every link is a vetted recommendation.',
    accent: '#ffc107',
    accentBg: '#fdf3d0',
    accentBar: 'linear-gradient(90deg, #ffc107 0%, #ee9fb5 100%)',
    count: '12 tools',
    locked: true,
  },
]

function UpgradeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="relative flex items-start gap-3 rounded-xl px-5 py-4 mb-8"
      style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
      }}
    >
      <span className="text-[18px] leading-none mt-0.5">🎉</span>
      <p className="text-[13px]" style={{ color: '#166534', lineHeight: 1.5 }}>
        <strong>Welcome to the full Hyve Codex!</strong> You now have access to everything.
      </p>
      <button
        onClick={onDismiss}
        className="absolute right-3 top-3 transition-opacity hover:opacity-60"
        style={{ color: '#166534', opacity: 0.5 }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function DashboardHomeContent() {
  const { profile, subscription } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(false)

  const hasAccess = canAccessFullCodex(subscription)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setShowBanner(true)
      // Remove ?upgraded=true from URL without re-render
      router.replace('/dashboard')
      const timer = setTimeout(() => setShowBanner(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const firstName = profile.first_name
  const greetingText = firstName ? `${greeting}, ${firstName}!` : 'Welcome back.'

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div className="max-w-4xl">
      {showBanner && <UpgradeBanner onDismiss={() => setShowBanner(false)} />}

      <h1 className="font-extrabold" style={{ fontSize: 28, color: '#4d4d4d', marginBottom: 4 }}>
        {greetingText}
      </h1>
      <p style={{ fontSize: 16, color: '#4d4d4d', opacity: 0.55, marginBottom: 32 }}>
        Here&apos;s your toolkit.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {PILLARS.map(({ href, icon: Icon, title, description, accent, accentBg, accentBar, count, locked }) => {
          const isLocked = locked && !hasAccess

          return (
            <div
              key={href}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8e8',
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 3, background: accentBar }} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: 40, height: 40, background: accentBg }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <span
                    className="text-[11px] font-medium px-2 py-1 rounded-full"
                    style={{ background: accentBg, color: accent }}
                  >
                    {count}
                  </span>
                </div>

                <h2 className="font-bold mb-1.5" style={{ fontSize: 16, color: '#4d4d4d' }}>
                  {title}
                </h2>
                <p className="mb-5" style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.6, lineHeight: 1.55 }}>
                  {description}
                </p>

                {isLocked ? (
                  <button
                    onClick={handleUpgrade}
                    className="w-full rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
                    style={{ background: '#ffc107', color: '#4d4d4d' }}
                  >
                    Upgrade to Access →
                  </button>
                ) : (
                  <a
                    href={href}
                    className="flex w-full items-center justify-center rounded-lg py-2.5 text-[13px] font-semibold no-underline transition-all duration-150 hover:bg-[#f7f7f7]"
                    style={{ border: '1px solid #e8e8e8', color: '#4d4d4d' }}
                  >
                    Open →
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardHomeContent />
    </Suspense>
  )
}
