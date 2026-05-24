'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { isTrialActive, getDaysRemainingInTrial, hasTrialExpired } from '@/lib/utils/trial'
import { isPayingSubscriber } from '@/lib/utils/access'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function IncludedItem({ text, included = true }: { text: string; included?: boolean }) {
  return (
    <li className="flex items-center gap-2 text-[13px]" style={{ color: '#4d4d4d', opacity: included ? 1 : 0.4 }}>
      <span style={{ color: included ? '#ffc107' : '#9ca3af', flexShrink: 0 }}>
        {included ? '✓' : '✗'}
      </span>
      {text}
    </li>
  )
}

export default function SubscriptionPanel() {
  const { subscription } = useUser()
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function handleUpgrade() {
    setCheckoutLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setCheckoutLoading(false)
  }

  async function handlePortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setPortalLoading(false)
  }

  const daysRemaining = getDaysRemainingInTrial(subscription)
  const dayInTrial = 14 - daysRemaining
  const fillPercent = Math.min(100, Math.round((dayInTrial / 14) * 100))

  const sectionHeading = (
    <h2 className="font-bold mb-5" style={{ fontSize: 17, color: '#4d4d4d', borderBottom: '1px solid #e8e8e8', paddingBottom: 12 }}>
      Subscription
    </h2>
  )

  // ── State A: Active Trial ──────────────────────────────────
  if (subscription?.status === 'trial' && isTrialActive(subscription)) {
    return (
      <>
        {sectionHeading}

        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#fdf3d0', color: '#ffc107' }}>
            Free Trial
          </span>
          <span className="text-[12px] font-bold" style={{ color: '#ffc107' }}>
            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
          </span>
        </div>

        {/* Progress bar */}
        <div className="rounded-full mb-1" style={{ height: 6, background: '#e8e8e8' }}>
          <div
            className="rounded-full"
            style={{ height: 6, background: '#ffc107', width: `${fillPercent}%`, transition: 'width 0.3s' }}
          />
        </div>
        <p className="text-right mb-5 text-[11px]" style={{ opacity: 0.45, color: '#4d4d4d' }}>
          Day {dayInTrial} of 14
        </p>

        <ul className="flex flex-col gap-2 mb-6">
          {['Full Prompt Library', 'Skills Directory', 'Commands & Shortcuts', 'AI Tool Recommendations'].map(f => (
            <IncludedItem key={f} text={f} />
          ))}
        </ul>

        {/* Upgrade CTA */}
        <div className="rounded-[10px] p-4.5" style={{ background: '#fdf3d0', border: '1px solid #ffc107', padding: 18 }}>
          <p className="font-bold mb-1" style={{ fontSize: 15, color: '#4d4d4d' }}>
            Keep access after your trial ends.
          </p>
          <p className="mb-4" style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.7 }}>
            Your trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Upgrade now to avoid any interruption.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60"
          >
            {checkoutLoading ? 'Redirecting…' : 'Upgrade for $47/month →'}
          </button>
          <p className="text-center mt-2 text-[11px]" style={{ color: '#4d4d4d', opacity: 0.4 }}>
            No commitment. Cancel anytime.
          </p>
        </div>
      </>
    )
  }

  // ── State B: Active Paid ───────────────────────────────────
  if (isPayingSubscriber(subscription)) {
    return (
      <>
        {sectionHeading}

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#fdf3d0', color: '#ffc107' }}>
              Full Codex
            </span>
            <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: '#10b981' }}>
              <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: '#10b981' }} />
              Active
            </span>
          </div>
          <span className="text-[12px]" style={{ color: '#4d4d4d', opacity: 0.55 }}>
            Renews {formatDate(subscription?.current_period_end ?? null)}
          </span>
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          {['Full Prompt Library', 'Skills Directory', 'Commands & Shortcuts', 'AI Tool Recommendations', 'New content added monthly'].map(f => (
            <IncludedItem key={f} text={f} />
          ))}
        </ul>

        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] transition-colors duration-150 disabled:opacity-60 hover:bg-[#f7f7f7]"
          style={{ border: '1px solid #e8e8e8' }}
        >
          {portalLoading ? 'Redirecting…' : 'Manage Subscription'}
        </button>
        <p className="text-center mt-2 text-[11px]" style={{ color: '#4d4d4d', opacity: 0.4 }}>
          Cancel anytime. No fees for cancellation.
        </p>
      </>
    )
  }

  // ── State C: Trial Expired ─────────────────────────────────
  if (hasTrialExpired(subscription)) {
    return (
      <>
        {sectionHeading}

        <div className="rounded-[10px] mb-4 flex items-start gap-3" style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: 18 }}>
          <span style={{ fontSize: 18 }}>⏰</span>
          <div>
            <p className="font-bold mb-1" style={{ fontSize: 15, color: '#b45309' }}>
              Your free trial has ended.
            </p>
            <p style={{ fontSize: 13, color: '#b45309', opacity: 0.8 }}>
              Upgrade now to regain access to Skills, Commands, and AI Tools.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#fef3c7', color: '#b45309' }}>
            Trial Ended
          </span>
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          <IncludedItem text="Prompt Library (browsing only — upgrade to copy)" />
          <IncludedItem text="Skills Directory — upgrade to unlock" included={false} />
          <IncludedItem text="Commands & Shortcuts — upgrade to unlock" included={false} />
          <IncludedItem text="AI Tool Recommendations — upgrade to unlock" included={false} />
        </ul>

        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60"
        >
          {checkoutLoading ? 'Redirecting…' : 'Upgrade for $47/month →'}
        </button>
        <p className="text-center mt-2 text-[11px]" style={{ color: '#4d4d4d', opacity: 0.4 }}>
          14 days free already used. $47/month, cancel anytime.
        </p>
      </>
    )
  }

  // ── State D: Canceled ─────────────────────────────────────
  if (subscription?.status === 'canceled') {
    return (
      <>
        {sectionHeading}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#f7f7f7', color: '#4d4d4d' }}>
            Full Codex
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#b45309' }}>
            Canceled
          </span>
        </div>

        <p className="mb-2" style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.65 }}>
          Your subscription has been canceled. You retain access until the end of your billing period.
        </p>
        <p className="mb-6" style={{ fontSize: 12, color: '#4d4d4d', opacity: 0.55 }}>
          Access expires {formatDate(subscription.current_period_end)}
        </p>

        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60"
        >
          {checkoutLoading ? 'Redirecting…' : 'Reactivate Subscription →'}
        </button>
      </>
    )
  }

  // ── State E: Past Due ──────────────────────────────────────
  if (subscription?.status === 'past_due') {
    return (
      <>
        {sectionHeading}

        <div className="rounded-[8px] mb-4 flex items-start gap-2" style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: 14 }}>
          <span>⚠️</span>
          <p style={{ fontSize: 13, color: '#b45309' }}>
            Your payment is past due. Please update your payment method to keep access.
          </p>
        </div>

        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[14px] transition-colors duration-150 disabled:opacity-60 hover:bg-[#f7f7f7]"
          style={{ border: '1px solid #e8e8e8' }}
        >
          {portalLoading ? 'Redirecting…' : 'Update Payment Method →'}
        </button>
      </>
    )
  }

  // Fallback
  return (
    <>
      {sectionHeading}
      <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55 }}>
        No subscription found.
      </p>
    </>
  )
}
