export type UserProfile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'trial' | 'active' | 'inactive' | 'canceled' | 'past_due'
  plan: 'trial' | 'full_codex'
  trial_started_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export type UserWithSubscription = {
  profile: UserProfile
  subscription: Subscription
}

export type Prompt = {
  id: number
  category: string
  subcategory: string
  title: string
  description: string
  tip: string
  prompt: string
}

export type Skill = {
  id: number
  name: string
  author: string
  category: string
  description: string
  installUrl: string
}

export type Command = {
  id: number
  category: string
  keys: string
  description: string
  platform: 'all' | 'mac' | 'windows'
}

export type AITool = {
  id: number
  name: string
  category: string
  tagline: string
  description: string
  weUseThis: boolean
  referralUrl: string
}
