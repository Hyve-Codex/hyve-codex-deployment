'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const supabase = createClient()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(!!sessionId)

  useEffect(() => {
    if (!sessionId) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/dashboard/account?upgraded=true')
      else setCheckingSession(false)
    })
  }, [sessionId, router, supabase.auth])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', data.user.id)

      await fetch('/api/auth/redeem-grant', { method: 'POST' })
    }

    router.push('/dashboard')
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <p className="text-[14px] text-[#4d4d4d]" style={{ opacity: 0.55 }}>Verifying payment…</p>
      </div>
    )
  }

  const isPostPayment = !!sessionId

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="font-extrabold text-[20px] text-[#4d4d4d]">Hyve Codex</span>
          </Link>
          {!isPostPayment && (
            <div className="mt-2">
              <span
                className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background: '#fdf3d0', color: '#ffc107' }}
              >
                14-Day Free Trial
              </span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e8e8] rounded-[16px] p-10">
          <h1
            className="font-extrabold text-[#4d4d4d] text-center mb-2"
            style={{ fontSize: 26 }}
          >
            {isPostPayment ? 'One last step: create your account.' : 'Create your free account.'}
          </h1>
          <p
            className="text-[14px] text-[#4d4d4d] text-center mb-8"
            style={{ opacity: 0.6 }}
          >
            {isPostPayment
              ? 'Your payment was successful. Create your account to access the full Hyve Codex.'
              : '14 days of full access. No credit card required.'}
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Name row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First"
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last"
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Email Address
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
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 pr-10 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4d4d] transition-opacity hover:opacity-60"
                  style={{ opacity: 0.4 }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 pr-10 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d4d4d] transition-opacity hover:opacity-60"
                  style={{ opacity: 0.4 }}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
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
              {loading ? 'Creating account…' : 'Create Account & Start Trial →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-[#4d4d4d] mt-5" style={{ opacity: 0.55 }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#4d4d4d] hover:text-[#ffc107] transition-colors duration-150">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
