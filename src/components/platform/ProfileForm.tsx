'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'

export default function ProfileForm({ profile, userEmail }: { profile: UserProfile; userEmail: string }) {
  const supabase = createClient()

  const [firstName, setFirstName] = useState(profile.first_name ?? '')
  const [lastName, setLastName] = useState(profile.last_name ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initials = firstName ? firstName[0].toUpperCase() : userEmail[0].toUpperCase()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!firstName.trim()) {
      setError('First name is required.')
      return
    }
    if (newPassword) {
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setLoading(false); return }

    await supabase
      .from('profiles')
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq('id', user.id)

    if (newPassword) {
      const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword })
      if (pwErr) {
        setError(pwErr.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setSuccess(true)
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <>
      <h2 className="font-bold mb-5" style={{ fontSize: 17, color: '#4d4d4d', borderBottom: '1px solid #e8e8e8', paddingBottom: 12 }}>
        Profile
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full font-bold flex-shrink-0 self-start"
          style={{ width: 56, height: 56, background: '#fdf3d0', color: '#ffc107', fontSize: 20 }}
        >
          {initials}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-4">
          {/* Name row */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 pr-10 text-[14px] text-[#4d4d4d] outline-none"
                style={{ opacity: 0.6, cursor: 'not-allowed', background: '#f7f7f7' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">🔒</span>
            </div>
            <p className="mt-1 text-[11px]" style={{ color: '#9ca3af' }}>
              To change your email, contact support.
            </p>
          </div>

          {/* New password */}
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
              New Password <span className="normal-case font-normal opacity-50">(optional)</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 pr-10 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#9ca3af' }}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          {newPassword && (
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4d4d] uppercase tracking-wide mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-[8px] px-3 py-2.5 pr-10 text-[14px] text-[#4d4d4d] outline-none focus:border-[#ffc107] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {error && (
            <p className="text-[13px] px-3 py-2 rounded-[8px]" style={{ color: '#ee9fb5', background: '#fdf0f4', border: '1px solid #ee9fb5' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-[13px]" style={{ color: '#10b981' }}>
              Changes saved successfully.
            </p>
          )}

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="font-bold text-[#4d4d4d] py-2.5 px-6 rounded-[10px] text-[14px] bg-[#ffc107] hover:bg-[#e6ac00] transition-colors duration-150 disabled:opacity-60 w-full sm:w-auto"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
