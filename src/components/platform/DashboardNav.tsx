'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, User, Settings, Zap } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import LogoutButton from '@/components/shared/LogoutButton'

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const ms = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

const NAV_LINKS = [
  { href: '/dashboard/prompts', label: 'Prompts' },
  { href: '/dashboard/skills', label: 'Skills' },
  { href: '/dashboard/commands', label: 'Commands' },
  { href: '/dashboard/tools', label: 'Tools' },
]

export default function DashboardNav() {
  const { profile, subscription } = useUser()
  const [open, setOpen] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  const isTrial = subscription?.status === 'trial'
  const isActive = subscription?.status === 'active'
  const daysLeft = isActive ? daysUntil(subscription?.current_period_end ?? null) : null

  async function handleUpgrade() {
    setUpgradeLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setUpgradeLoading(false)
  }
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = profile.first_name
    ? profile.first_name[0].toUpperCase()
    : profile.email[0].toUpperCase()

  const displayName = profile.first_name || profile.email.split('@')[0]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 58,
        background: '#ffffff',
        borderBottom: '1px solid #e8e8e8',
      }}
    >
      {/* Logo */}
      <a href="/dashboard" className="flex items-center gap-2 no-underline flex-shrink-0">
        <span className="font-extrabold text-[16px] tracking-tight" style={{ color: '#4d4d4d' }}>
          Hyve Codex
        </span>
      </a>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <a
              key={href}
              href={href}
              className="text-[14px] no-underline transition-colors duration-150"
              style={{
                color: isActive ? '#ffc107' : '#4d4d4d',
                fontWeight: isActive ? 700 : 400,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* Account dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-150 hover:bg-[#f7f7f7]"
          style={{ color: '#4d4d4d' }}
        >
          <div
            className="flex items-center justify-center rounded-full text-[13px] font-semibold flex-shrink-0"
            style={{ width: 32, height: 32, background: '#fdf3d0', color: '#ffc107' }}
          >
            {initials}
          </div>
          <span className="text-[13px] font-medium hidden sm:block">{displayName}</span>
          <ChevronDown
            size={14}
            className="transition-transform duration-150"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.5 }}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 rounded-xl overflow-hidden"
            style={{
              width: 224,
              background: '#ffffff',
              border: '1px solid #e8e8e8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              top: 'calc(100% + 6px)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <p className="text-[13px] font-semibold truncate" style={{ color: '#4d4d4d' }}>
                {displayName}
              </p>
              <p className="text-[12px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>
                {profile.email}
              </p>
              {isActive && daysLeft !== null && (
                <p className="text-[11px] mt-1.5 font-semibold" style={{ color: '#10b981' }}>
                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>

            {/* Upgrade CTA — trial users only */}
            {isTrial && (
              <div className="px-3 py-2.5" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <button
                  onClick={() => { setOpen(false); handleUpgrade() }}
                  disabled={upgradeLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-bold transition-colors duration-150"
                  style={{ background: '#fdf3d0', color: '#b45309', opacity: upgradeLoading ? 0.7 : 1 }}
                >
                  <Zap size={13} />
                  {upgradeLoading ? 'Loading…' : 'Upgrade to Full Access'}
                </button>
              </div>
            )}

            {/* Menu items */}
            <div className="py-1.5">
              <a
                href="/dashboard/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[#f7f7f7] no-underline"
                style={{ color: '#4d4d4d' }}
              >
                <User size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                Account Settings
              </a>
              <a
                href="/dashboard/account?tab=billing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[#f7f7f7] no-underline"
                style={{ color: '#4d4d4d' }}
              >
                <Settings size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                Billing
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
    </nav>
  )
}
