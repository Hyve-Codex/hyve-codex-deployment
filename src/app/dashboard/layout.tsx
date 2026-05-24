import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getUserWithSubscription } from '@/lib/supabase/helpers'
import { canAccessFullCodex, isPayingSubscriber } from '@/lib/utils/access'
import { getDaysRemainingInTrial } from '@/lib/utils/trial'
import { UserProvider } from '@/contexts/UserContext'
import DashboardNav from '@/components/platform/DashboardNav'
import DashboardSidebar from '@/components/platform/DashboardSidebar'
import TrialBanner from '@/components/platform/TrialBanner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const data = await getUserWithSubscription()
  if (!data) redirect('/login')

  const { profile, subscription } = data

  const showBanner = canAccessFullCodex(subscription) && !isPayingSubscriber(subscription)
  const daysRemaining = getDaysRemainingInTrial(subscription)

  // Top offset: 58px nav + 40px banner (when shown)
  const contentTop = showBanner ? 98 : 58

  return (
    <UserProvider profile={profile} subscription={subscription}>
      {/* Fixed top nav */}
      <DashboardNav />

      {/* Trial banner pinned below nav */}
      {showBanner && (
        <div className="fixed left-0 right-0 z-40" style={{ top: 58 }}>
          <TrialBanner daysRemaining={daysRemaining} />
        </div>
      )}

      {/* Context-aware sidebar — Suspense needed for useSearchParams */}
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>

      {/* Main content */}
      <main
        className="min-h-screen"
        style={{
          paddingTop: contentTop,
          paddingLeft: 220,
          background: '#f7f7f7',
        }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </UserProvider>
  )
}
