import Link from 'next/link'

export default function MidCTA() {
  return (
    <section style={{ background: '#ffc107', paddingTop: 64, paddingBottom: 64 }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-extrabold text-[#4d4d4d]" style={{ fontSize: 28 }}>
          One subscription. Every AI tool you actually need.
        </h2>
        <p className="text-[#4d4d4d] mt-2" style={{ fontSize: 16, opacity: 0.75 }}>
          Start free. No credit card needed.
        </p>
        <Link
          href="/signup"
          className="inline-block mt-6 font-bold text-white px-6 py-3 rounded-[10px] text-[15px] bg-[#4d4d4d] hover:bg-[#333333] transition-colors duration-150"
        >
          Start Your Free Trial →
        </Link>
      </div>
    </section>
  )
}
