import Link from 'next/link'
import { Lock } from 'lucide-react'

const SAMPLE_PROMPTS = [
  {
    title: 'Monthly Content Calendar',
    description: 'Plan a full month of content across platforms in one go.',
    subcategory: 'Content Strategy',
  },
  {
    title: 'Long-Form Storytelling Caption',
    description: 'Write a compelling narrative caption that drives engagement.',
    subcategory: 'Captions & Copywriting',
  },
  {
    title: 'Reel Script',
    description: 'Script a punchy, scroll-stopping short-form video.',
    subcategory: 'Reels & Video',
  },
  {
    title: 'Welcome Email Sequence',
    description: 'Craft a 3-part welcome series that converts new subscribers.',
    subcategory: 'Email Sequences',
  },
  {
    title: 'Brand Voice Definition',
    description: 'Define your brand tone, language, and personality in detail.',
    subcategory: 'Creative Strategy',
  },
  {
    title: 'Brain Dump → Task List',
    description: 'Turn a messy brain dump into a prioritized action plan.',
    subcategory: 'Planning & Decisions',
  },
]

export default function PromptsTeaser() {
  return (
    <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
            style={{ background: '#fdf3d0', color: '#ffc107' }}
          >
            Prompts
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-bold text-[#4d4d4d] text-center" style={{ fontSize: 32 }}>
          Browse 100+ ready-to-use prompts
        </h2>
        <p
          className="text-center text-[#4d4d4d] mt-3 mb-10"
          style={{ fontSize: 15, opacity: 0.6 }}
        >
          Click any card to preview. Unlock all prompts with full access.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_PROMPTS.map((prompt) => (
            <PromptCard key={prompt.title} {...prompt} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/signup"
            className="font-bold text-[#4d4d4d] px-6 py-3 rounded-[10px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150"
          >
            Unlock All 100+ Prompts →
          </Link>
        </div>
      </div>
    </section>
  )
}

function PromptCard({
  title,
  description,
  subcategory,
}: {
  title: string
  description: string
  subcategory: string
}) {
  return (
    <div className="group relative bg-white border border-[#e8e8e8] rounded-[12px] p-4 cursor-default overflow-hidden transition-all duration-[180ms] hover:-translate-y-0.5 hover:border-[#ffc107] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[12px]"
        style={{ background: '#ffc107' }}
      />

      <div className="mt-2">
        {/* Badge */}
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full mb-2"
          style={{ background: '#fdf0f4', color: '#ee9fb5' }}
        >
          {subcategory}
        </span>

        {/* Title */}
        <h3 className="font-bold text-[14px] text-[#4d4d4d] leading-snug">{title}</h3>

        {/* Description */}
        <p className="text-[12px] text-[#4d4d4d] mt-1 leading-relaxed" style={{ opacity: 0.6 }}>
          {description}
        </p>
      </div>

      {/* Lock overlay on hover */}
      <div
        className="absolute inset-0 rounded-[12px] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: 'rgba(255,255,255,0.85)' }}
      >
        <Lock size={18} className="text-[#4d4d4d]" />
        <span className="text-[12px] font-medium text-[#4d4d4d]">Unlock with full access</span>
      </div>
    </div>
  )
}
