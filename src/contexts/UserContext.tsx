'use client'

import { createContext, useContext } from 'react'
import type { UserProfile, Subscription } from '@/types'

type UserContextValue = {
  profile: UserProfile
  subscription: Subscription | null
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({
  profile,
  subscription,
  children,
}: {
  profile: UserProfile
  subscription: Subscription | null
  children: React.ReactNode
}) {
  return (
    <UserContext.Provider value={{ profile, subscription }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
