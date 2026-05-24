import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section style={{ background: '#4d4d4d', paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="font-extrabold text-white mx-auto"
          style={{ fontSize: 32, maxWidth: 640 }}
        >
          Everything you need to work smarter with AI, in one place.
        </h2>
        <p className="text-white mt-3" style={{ fontSize: 15, opacity: 0.6 }}>
          Start free for 14 days. No credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-block mt-8 font-bold text-[#4d4d4d] px-6 py-3 rounded-[10px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150"
        >
          Start Free Trial →
        </Link>
      </div>
    </section>
  )
}
