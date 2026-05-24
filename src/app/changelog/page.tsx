import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog — Hyve Codex',
  description: 'What\'s new in the Hyve Codex.',
}

const ENTRIES = [
  {
    date: 'May 2026',
    title: 'Launch',
    changes: [
      'Launched the Hyve Codex with 59 fill-in-the-blank prompts across 4 categories.',
      'Skills Directory with 12 curated Claude skills.',
      'Commands & Shortcuts reference covering Claude Web App, Claude Code, and browser shortcuts.',
      'AI Tool Recommendations featuring the exact tools the Hyve team uses daily.',
      '14-day free trial for all new accounts.',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <main style={{ background: '#f7f7f7', minHeight: '100vh', paddingTop: 64, paddingBottom: 80 }}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-block font-extrabold text-[#4d4d4d] mb-8"
            style={{ fontSize: 16 }}
          >
            Hyve Codex
          </Link>
          <div className="mb-3">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
              style={{ background: '#fdf3d0', color: '#ffc107' }}
            >
              Changelog
            </span>
          </div>
          <h1 className="font-extrabold text-[#4d4d4d]" style={{ fontSize: 36 }}>
            What&apos;s new
          </h1>
          <p className="text-[#4d4d4d] mt-2" style={{ fontSize: 15, opacity: 0.55 }}>
            Updates, improvements, and new content added to the Hyve Codex.
          </p>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-10">
          {ENTRIES.map((entry) => (
            <div key={entry.date} className="flex gap-6">
              {/* Date column */}
              <div className="flex-shrink-0 w-24 pt-0.5">
                <p className="font-semibold text-[#4d4d4d] text-[12px]" style={{ opacity: 0.45 }}>
                  {entry.date}
                </p>
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-[16px] bg-white border border-[#e8e8e8] p-7"
              >
                <div
                  className="w-full h-[3px] rounded-full mb-5"
                  style={{ background: 'linear-gradient(90deg, #ffc107 0%, #ee9fb5 100%)' }}
                />
                <h2 className="font-bold text-[#4d4d4d] mb-4" style={{ fontSize: 18 }}>
                  {entry.title}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#4d4d4d]" style={{ opacity: 0.75, lineHeight: 1.6 }}>
                      <span className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#ffc107]" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Back to app */}
        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-block font-bold text-[#4d4d4d] py-3 px-8 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </main>
  )
}
