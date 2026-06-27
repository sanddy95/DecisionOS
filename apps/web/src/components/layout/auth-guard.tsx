'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (_hydrated && !isAuthenticated) router.replace('/login')
  }, [_hydrated, isAuthenticated, router])

  // Wait for Zustand persist to rehydrate from localStorage before deciding
  if (!_hydrated) return null
  if (!isAuthenticated) return null
  return <>{children}</>
}
