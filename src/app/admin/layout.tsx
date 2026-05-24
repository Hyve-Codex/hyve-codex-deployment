import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/supabase/helpers'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = await isUserAdmin()
  if (!admin) redirect('/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, email')
    .eq('id', user.id)
    .single()

  return (
    <AdminShell
      displayName={profile?.first_name ?? user.email?.split('@')[0] ?? 'Admin'}
      email={user.email ?? ''}
    >
      {children}
    </AdminShell>
  )
}
