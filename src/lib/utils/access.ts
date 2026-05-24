import type { Subscription } from '@/types'
import { isTrialActive } from '@/lib/utils/trial'

export function canAccessFullCodex(subscription: Subscription | null): boolean {
  if (!subscription) return false
  if (subscription.status === 'active') return true
  if (subscription.status === 'trial' && isTrialActive(subscription)) return true
  return false
}

export function isPayingSubscriber(subscription: Subscription | null): boolean {
  return subscription?.status === 'active'
}

export function canCopyPrompts(subscription: Subscription | null): boolean {
  return canAccessFullCodex(subscription)
}

export function canAccessSkills(subscription: Subscription | null): boolean {
  return canAccessFullCodex(subscription)
}

export function canAccessCommands(subscription: Subscription | null): boolean {
  return canAccessFullCodex(subscription)
}

export function canAccessTools(subscription: Subscription | null): boolean {
  return canAccessFullCodex(subscription)
}
