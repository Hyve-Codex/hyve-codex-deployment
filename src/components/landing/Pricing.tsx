'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  const FEATURES = [
    'Full Prompt Library (59+ prompts)',
    'Fill-in-the-blank interface',
    'Skills Directory',
    'Commands & Shortcuts',
    'AI Tool Recommendations',
    'New content added regularly',
    'Priority support',
  ]

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
            style={{ background: '#fdf0f4', color: '#ee9fb5' }}
          >
            Pricing
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-bold text-[#4d4d4d] text-center" style={{ fontSize: 32 }}>
          Simple, honest pricing.
        </h2>
        <p className="text-center text-[#4d4d4d] mt-3" style={{ fontSize: 15, opacity: 0.6 }}>
          One plan. Everything included. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-10">
          <button
            onClick={() => setAnnual(false)}
            className="text-[14px] font-semibold transition-all duration-150"
            style={{ color: '#4d4d4d', opacity: annual ? 0.4 : 1 }}
          >
            Monthly
          </button>

          {/* Toggle track */}
          <button
            onClick={() => setAnnual(v => !v)}
            role="switch"
            aria-checked={annual}
            aria-label="Toggle billing period"
            className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              width: 48,
              height: 28,
              background: annual ? '#ffc107' : '#d1d5db',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {/* Knob */}
            <span
              className="absolute rounded-full bg-white shadow-sm"
              style={{
                width: 22,
                height: 22,
                top: 3,
                left: annual ? 23 : 3,
                transition: 'left 0.2s ease',
              }}
            />
          </button>

          <button
            onClick={() => setAnnual(true)}
            className="flex items-center gap-2 text-[14px] font-semibold transition-all duration-150"
            style={{ color: '#4d4d4d', opacity: annual ? 1 : 0.4 }}
          >
            Annual
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#fdf3d0', color: '#d97706' }}
            >
              Save 2 months
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="flex justify-center">
          <div
            className="relative rounded-[20px] w-full"
            style={{
              background: '#ffffff',
              border: '2px solid #ffc107',
              padding: '40px 40px 36px',
              maxWidth: 420,
              boxShadow: '0 8px 40px rgba(255, 193, 7, 0.12)',
            }}
          >
            {/* Corner badge */}
            <span
              className="absolute top-0 right-0 font-bold text-[#4d4d4d] text-[10px] uppercase px-3 py-1.5"
              style={{ background: '#ffc107', borderRadius: '0 18px 0 8px' }}
            >
              Full Codex
            </span>

            <p className="uppercase font-bold tracking-wide mb-5" style={{ fontSize: 12, color: '#ffc107' }}>
              Everything Included
            </p>

            {/* Price display */}
            {annual ? (
              <>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-extrabold text-[#4d4d4d]" style={{ fontSize: 52, lineHeight: 1 }}>
                    $564
                  </span>
                  <span className="text-[16px] text-[#4d4d4d] mb-1" style={{ opacity: 0.5 }}>/yr</span>
                </div>
                <p className="text-[13px] text-[#4d4d4d] mb-6" style={{ opacity: 0.55 }}>
                  Billed once per year. That&apos;s $47/mo. Cancel anytime.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-extrabold text-[#4d4d4d]" style={{ fontSize: 52, lineHeight: 1 }}>
                    $47
                  </span>
                  <span className="text-[16px] text-[#4d4d4d] mb-1" style={{ opacity: 0.5 }}>/mo</span>
                </div>
                <p className="text-[13px] text-[#4d4d4d] mb-6" style={{ opacity: 0.55 }}>
                  Billed monthly. Cancel anytime.
                </p>
              </>
            )}

            <hr className="border-[#e8e8e8] mb-6" />

            <ul className="flex flex-col gap-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check size={14} style={{ color: '#ffc107', flexShrink: 0 }} />
                  <span className="text-[14px] text-[#4d4d4d]">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block text-center font-bold text-[#4d4d4d] py-3.5 px-5 rounded-[12px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150"
            >
              Start 14-Day Free Trial →
            </Link>
            <p className="text-center mt-3 text-[#4d4d4d]" style={{ fontSize: 12, opacity: 0.45 }}>
              No credit card required. {annual ? '$564/yr' : '$47/mo'} after trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
