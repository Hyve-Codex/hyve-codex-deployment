import Link from 'next/link'

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #e8e8e8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Pill label */}
        <span
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full mb-6"
          style={{ background: '#fdf3d0', color: '#ffc107' }}
        >
          AI Productivity Platform
        </span>

        {/* H1 */}
        <h1
          className="font-extrabold text-[#4d4d4d] leading-[1.15]"
          style={{ fontSize: 'clamp(34px, 5vw, 48px)', maxWidth: 720 }}
        >
          The AI Toolkit Built for People Who Actually Use It
        </h1>

        {/* Subheadline */}
        <p
          className="mt-4 font-normal leading-[1.6] text-[#4d4d4d]"
          style={{ fontSize: 18, opacity: 0.65, maxWidth: 560 }}
        >
          Prompts, skills, commands, and curated AI tools. Everything your business needs to work smarter, in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <Link
            href="/signup"
            className="font-bold text-[#4d4d4d] px-6 py-3 rounded-[10px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150"
          >
            Start 14-Day Free Trial →
          </Link>
          <a
            href="#pillars"
            className="font-semibold text-[#4d4d4d] px-6 py-3 rounded-[10px] text-[15px] border-[1.5px] border-[#e8e8e8] hover:border-[#4d4d4d] transition-colors duration-150"
          >
            See What&apos;s Inside
          </a>
        </div>

        {/* No credit card line */}
        <p className="mt-3 text-[12px] text-[#4d4d4d]" style={{ opacity: 0.45 }}>
          No credit card required.
        </p>

        {/* Social proof */}
        <p className="mt-2 text-[13px] text-[#4d4d4d]" style={{ opacity: 0.45 }}>
          Used by operators, marketers, and small business owners
        </p>
      </div>
    </section>
  )
}
