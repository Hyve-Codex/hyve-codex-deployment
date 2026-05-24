'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export default function LogoutButton({ className, style, children }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={className}
      style={style}
    >
      {loading ? 'Logging out…' : (children ?? 'Log out')}
    </button>
  )
}
