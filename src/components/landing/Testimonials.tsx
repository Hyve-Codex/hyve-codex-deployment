const TESTIMONIALS = [
  {
    quote:
      "I used to spend 2 hours writing captions every week. Now I spend 15 minutes and the quality is better.",
    name: 'Sarah K.',
    role: 'Boutique Owner',
  },
  {
    quote:
      "The prompt library alone is worth it. I didn't realize how bad my AI prompts were until I saw what a good one looks like.",
    name: 'Marcus T.',
    role: 'Marketing Manager',
  },
  {
    quote:
      "Finally a tool that doesn't assume I know what I'm doing. Everything is explained clearly and it just works.",
    name: 'Jenna R.',
    role: 'Freelance Creative',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
            style={{ background: '#f0f0f0', color: '#4d4d4d' }}
          >
            What People Say
          </span>
        </div>

        {/* Heading */}
        <h2
          className="font-bold text-[#4d4d4d] text-center mb-12"
          style={{ fontSize: 32 }}
        >
          Built for real people with real businesses.
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-[#e8e8e8] rounded-[12px]"
              style={{ padding: 28 }}
            >
              <div
                className="font-extrabold text-[#ffc107] leading-none mb-3"
                style={{ fontSize: 48 }}
              >
                &ldquo;
              </div>
              <p
                className="italic text-[#4d4d4d] leading-[1.7]"
                style={{ fontSize: 14 }}
              >
                {t.quote}
              </p>
              <div className="mt-5">
                <p className="font-bold text-[14px] text-[#4d4d4d]">{t.name}</p>
                <p className="text-[12px] text-[#4d4d4d]" style={{ opacity: 0.55 }}>
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
