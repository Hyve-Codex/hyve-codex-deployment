'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="font-extrabold text-[20px] text-[#4d4d4d]">Hyve Codex</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e8e8] rounded-[16px] p-10">
          <h1
            className="font-extrabold text-[#4d4d4d] text-center mb-2"
            style={{ fontSize: 26 }}
          >
            Welcome back.
          </h1>
          <p
            className="text-[14px] text-[#4d4d4d] text-center mb-8"
            style={{ opacity: 0.6 }}
          >
            Sign in to your Hyve Codex account.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-[12px] text-[#4d4d4d] hover:text-[#ffc107] transition-colors duration-150"
                  style={{ opacity: 0.55 }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
              />
            </div>

            {error && (
              <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold text-[#4d4d4d] py-3 rounded-[10px] text-[15px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-[#4d4d4d] mt-5" style={{ opacity: 0.55 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#4d4d4d] hover:text-[#ffc107] transition-colors duration-150">
            Start your free trial →
          </Link>
        </p>
      </div>
    </div>
  )
}
