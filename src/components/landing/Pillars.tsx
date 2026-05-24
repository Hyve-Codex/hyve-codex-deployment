import { FileText, Zap, Keyboard, Sparkles } from 'lucide-react'

const PILLARS = [
  {
    icon: <FileText size={28} style={{ color: '#ffc107' }} />,
    title: 'Prompt Library',
    description:
      '100+ fill-in-the-blank prompts for social media, email marketing, operations, and more. Built for real business tasks, not generic experiments.',
    tag: 'Included Free',
    tagStyle: { background: '#fdf3d0', color: '#ffc107' },
  },
  {
    icon: <Zap size={28} style={{ color: '#ee9fb5' }} />,
    title: 'Skills Directory',
    description:
      'A curated library of Claude skills you can install in seconds. Browse by category, copy the link, and instantly expand what Claude can do for you.',
    tag: 'Full Access',
    tagStyle: { background: '#fdf0f4', color: '#ee9fb5' },
  },
  {
    icon: <Keyboard size={28} style={{ color: '#4d4d4d' }} />,
    title: 'Commands & Shortcuts',
    description:
      'Every keyboard shortcut and quick command you need to move faster inside Claude. No searching, no guessing. Just the command and what it does.',
    tag: 'Full Access',
    tagStyle: { background: '#f0f0f0', color: '#4d4d4d' },
  },
  {
    icon: <Sparkles size={28} style={{ color: '#ffc107' }} />,
    title: 'AI Tool Recommendations',
    description:
      'A vetted directory of AI tools our team uses daily. Organized by category, each with a plain-English description of exactly what it\'s good for.',
    tag: 'Full Access',
    tagStyle: { background: '#fdf3d0', color: '#ffc107' },
  },
]

export default function Pillars() {
  return (
    <section id="pillars" className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
            style={{ background: '#fdf0f4', color: '#ee9fb5' }}
          >
            What&apos;s Inside
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-bold text-[#4d4d4d] text-center" style={{ fontSize: 32 }}>
          Four tools. One platform.
        </h2>
        <p
          className="text-center text-[#4d4d4d] mt-3 mb-12"
          style={{ fontSize: 15, opacity: 0.6 }}
        >
          Everything a modern business operator needs to work with AI, without the overwhelm.
        </p>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white border border-[#e8e8e8] rounded-[12px] p-8"
            >
              <div className="mb-4">{pillar.icon}</div>
              <h3 className="font-bold text-[18px] text-[#4d4d4d] mb-3">{pillar.title}</h3>
              <p className="text-[14px] text-[#4d4d4d] leading-[1.6] mb-4" style={{ opacity: 0.75 }}>
                {pillar.description}
              </p>
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-[0.06em] px-3 py-1 rounded-full"
                style={pillar.tagStyle}
              >
                {pillar.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
