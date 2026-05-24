import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithSubscription } from '@/lib/supabase/helpers'
import ProfileForm from '@/components/platform/ProfileForm'
import SubscriptionPanel from '@/components/platform/SubscriptionPanel'
import HelpPanel from '@/components/platform/HelpPanel'

const CARD = {
  background: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: 12,
  padding: 28,
  marginBottom: 16,
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const data = await getUserWithSubscription()
  if (!data) redirect('/login')

  const { profile } = data

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 className="font-extrabold" style={{ fontSize: 22, color: '#4d4d4d', marginBottom: 4 }}>
        Account Settings
      </h1>
      <p style={{ fontSize: 14, color: '#4d4d4d', opacity: 0.55, marginBottom: 32 }}>
        Manage your profile and subscription.
      </p>

      <div id="profile" style={CARD}>
        <ProfileForm profile={profile} userEmail={user.email ?? ''} />
      </div>

      <div id="subscription" style={CARD}>
        <SubscriptionPanel />
      </div>

      <div id="help" style={CARD}>
        <HelpPanel />
      </div>
    </div>
  )
}
