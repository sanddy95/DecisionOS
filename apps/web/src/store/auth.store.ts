import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import { currentUser } from '@/lib/mock-data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  _hydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hydrated: false,
      setHydrated: () => set({ _hydrated: true }),
      login: async (email: string, _password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800))
        if (email === 'alex@acmedemo.com' || email.includes('@')) {
          set({ user: currentUser, isAuthenticated: true })
          if (typeof document !== 'undefined') {
            document.cookie = 'decisionos-auth=1; path=/; max-age=604800'
          }
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
        if (typeof document !== 'undefined') {
          document.cookie = 'decisionos-auth=; path=/; max-age=0'
        }
      },
    }),
    {
      name: 'decisionos-auth',
      onRehydrateStorage: () => (state) => { state?.setHydrated() },
    }
  )
)
