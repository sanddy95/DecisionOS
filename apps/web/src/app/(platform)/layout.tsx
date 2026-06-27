import type { Metadata } from 'next'
import Link from 'next/link'
import { PlatformNav } from '@/components/platform/platform-nav'

export const metadata: Metadata = { title: 'Platform Admin — DecisionOS' }

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <PlatformNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
