'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const SUPPORT_EMAIL = 'support@thehyvehamptons.com'

const FAQ = [
  {
    q: 'How do I use the Prompt Library?',
    a: 'Click any prompt card to open it. Fill in the highlighted fields with details about your business, then click "Copy Prompt." Paste it directly into Claude at claude.ai.',
  },
  {
    q: 'How do I install a Skill from the Skills Directory?',
    a: 'Click "Copy Skill Link" on any skill card. If you\'re using Claude Code (the desktop tool), paste the link and Claude Code installs it automatically. For Claude on the web, use the skill\'s system prompt text at the start of a conversation.',
  },
  {
    q: 'What\'s the difference between the free trial and the Full Codex subscription?',
    a: 'Your 14-day free trial gives you full access to all four pillars. After 14 days, a $47/month subscription keeps everything unlocked. Without a subscription, you can browse the Prompt Library but need to upgrade to copy prompts or access the other sections.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to the Subscription section above and click "Manage Subscription." This opens the Stripe portal where you can cancel, update your payment method, or view billing history. You retain access until the end of your current billing period.',
  },
  {
    q: 'Can I use these prompts for client work?',
    a: 'Yes. Your subscription covers personal and commercial use.',
  },
  {
    q: 'Something isn\'t working — how do I get help?',
    a: `Email us at ${SUPPORT_EMAIL}. We typically respond within 24 hours on business days.`,
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors duration-150 hover:opacity-80"
        style={{ background: 'transparent', border: 'none' }}
      >
        <span className="font-semibold pr-4" style={{ fontSize: 14, color: '#4d4d4d' }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: '#9ca3af',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 200ms ease',
        }}
      >
        <p
          className="pb-4 leading-relaxed"
          style={{ fontSize: 13, color: '#4d4d4d', opacity: 0.7 }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function HelpPanel() {
  return (
    <>
      <h2 className="font-bold mb-5" style={{ fontSize: 17, color: '#4d4d4d', borderBottom: '1px solid #e8e8e8', paddingBottom: 12 }}>
        Help &amp; FAQ
      </h2>

      <div className="mb-6">
        {FAQ.map((item) => (
          <FAQItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

      {/* Contact card */}
      <div className="rounded-xl p-5" style={{ background: '#f7f7f7' }}>
        <p className="font-semibold mb-3" style={{ fontSize: 14, color: '#4d4d4d' }}>
          Still need help? Reach out directly.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-2 font-semibold text-[13px] px-4 py-2 rounded-lg transition-colors duration-150 no-underline hover:bg-[#e8e8e8]"
          style={{ border: '1px solid #e8e8e8', color: '#4d4d4d', background: '#ffffff' }}
        >
          Email Support
        </a>
      </div>
    </>
  )
}
