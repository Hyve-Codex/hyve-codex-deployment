import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <Link href="/" className="inline-block mb-6">
          <span className="font-extrabold text-[20px] text-[#4d4d4d]">Hyve Codex</span>
        </Link>
        <p className="text-[15px] text-[#4d4d4d] mb-2">
          Password reset — coming soon.
        </p>
        <p className="text-[14px] text-[#4d4d4d] mb-6" style={{ opacity: 0.55 }}>
          Contact support for help.
        </p>
        <Link href="/login" className="text-[13px] font-semibold text-[#ffc107] hover:underline">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
