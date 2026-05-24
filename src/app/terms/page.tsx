import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Hyve Codex',
}

export default function TermsPage() {
  return (
    <main style={{ background: '#f7f7f7', minHeight: '100vh', paddingTop: 64, paddingBottom: 80 }}>
      <div className="max-w-2xl mx-auto px-6">
        <Link
          href="/"
          className="inline-block font-extrabold text-[#4d4d4d] mb-8"
          style={{ fontSize: 16 }}
        >
          Hyve Codex
        </Link>
        <h1 className="font-extrabold text-[#4d4d4d] mb-4" style={{ fontSize: 32 }}>
          Terms of Service
        </h1>
        <p className="text-[15px] text-[#4d4d4d] mb-8" style={{ opacity: 0.65, lineHeight: 1.7 }}>
          Our terms of service will be updated soon. For questions, contact{' '}
          <a href="mailto:support@thehyvehamptons.com" className="underline">
            support@thehyvehamptons.com
          </a>
          .
        </p>
        <Link
          href="/"
          className="text-[14px] font-semibold text-[#4d4d4d] hover:text-[#ffc107] transition-colors duration-150"
        >
          ← Back to Hyve Codex
        </Link>
      </div>
    </main>
  )
}
