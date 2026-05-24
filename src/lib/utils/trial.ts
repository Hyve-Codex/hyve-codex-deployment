import type { Subscription } from '@/types'

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000

export function isTrialActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  if (subscription.status !== 'trial') return false
  if (!subscription.trial_started_at) return false
  return (Date.now() - new Date(subscription.trial_started_at).getTime()) < TRIAL_DURATION_MS
}

export function getDaysRemainingInTrial(subscription: Subscription | null): number {
  if (!subscription || !subscription.trial_started_at) return 0
  const elapsed = Date.now() - new Date(subscription.trial_started_at).getTime()
  return Math.max(0, 14 - Math.floor(elapsed / (1000 * 60 * 60 * 24)))
}

export function hasTrialExpired(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'trial' && !isTrialActive(subscription)
}
