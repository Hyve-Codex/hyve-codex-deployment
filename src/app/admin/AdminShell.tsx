'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, BarChart2, Users, MessageSquare, Mail, BookOpen, Zap, Terminal, Wrench, Settings, ExternalLink } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'

const NAV_DARK = '#1c1c2e'
const NAV_SECTIONS = [
  {
    label: null,
    items: [{ href: '/admin', label: 'Overview', icon: BarChart2 }],
  },
  {
    label: 'MANAGE',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/suggestions', label: 'Suggestions', icon: MessageSquare },
      { href: '/admin/leads', label: 'Lead Magnet', icon: Mail },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { href: '/admin/content/prompts', label: 'Prompts', icon: BookOpen },
      { href: '/admin/content/skills', label: 'Skills', icon: Zap },
      { href: '/admin/content/commands', label: 'Commands', icon: Terminal },
      { href: '/admin/content/tools', label: 'AI Tools', icon: Wrench },
    ],
  },
  {
    label: 'SETTINGS',
    items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
  },
]

function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col"
      style={{ width: 220, background: NAV_DARK, zIndex: 50 }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', height: 58 }}>
        <span className="font-extrabold text-white" style={{ fontSize: 15 }}>Hyve Codex</span>
        <span
          className="font-bold text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: '#ffc107', color: NAV_DARK }}
        >
          Admin
        </span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-4' : ''}>
            {section.label && (
              <p
                className="px-5 mb-1 uppercase font-semibold"
                style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}
              >
                {section.label}
              </p>
            )}
            {section.items.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
              return (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-5 py-2.5 text-[13px] no-underline transition-colors duration-150"
                  style={{
                    color: isActive ? '#ffc107' : 'rgba(255,255,255,0.65)',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? 'rgba(255,193,7,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #ffc107' : '3px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'
                    }
                  }}
                >
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {label}
                </a>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

function AdminNav({ displayName, email }: { displayName: string; email: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = displayName[0]?.toUpperCase() ?? 'A'

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      className="fixed right-0 top-0 z-40 flex items-center justify-between px-6"
      style={{ left: 220, height: 58, background: NAV_DARK, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-150"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <div
            className="flex items-center justify-center rounded-full font-semibold flex-shrink-0"
            style={{ width: 32, height: 32, background: '#fdf3d0', color: '#ffc107', fontSize: 13 }}
          >
            {initials}
          </div>
          <span className="text-[13px] font-medium text-white hidden sm:block">{displayName}</span>
          <ChevronDown
            size={14}
            style={{ color: 'rgba(255,255,255,0.5)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 rounded-xl overflow-hidden"
            style={{
              width: 220,
              background: '#ffffff',
              border: '1px solid #e8e8e8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              top: 'calc(100% + 6px)',
              animation: 'fadeInScale 150ms ease',
            }}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <p className="text-[13px] font-semibold truncate" style={{ color: '#4d4d4d' }}>{displayName}</p>
              <p className="text-[12px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>{email}</p>
            </div>
            <div className="py-1.5">
              <a
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[#f7f7f7] no-underline"
                style={{ color: '#4d4d4d' }}
              >
                <ExternalLink size={14} style={{ opacity: 0.5 }} />
                View Platform →
              </a>
            </div>
            <div className="py-1.5" style={{ borderTop: '1px solid #f0f0f0' }}>
              <LogoutButton
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[#fdf0f4]"
                style={{ color: '#ee9fb5', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default function AdminShell({
  displayName,
  email,
  children,
}: {
  displayName: string
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div style={{ background: '#f0f2f7', minHeight: '100vh' }}>
      <AdminSidebar pathname={pathname} />
      <AdminNav displayName={displayName} email={email} />
      <main style={{ paddingLeft: 220, paddingTop: 58 }}>
        <div style={{ padding: 28 }}>{children}</div>
      </main>
    </div>
  )
}
