'use client'
import { useState } from 'react'
import { PlatformNav } from '@/components/platform/platform-nav'
import { Menu } from 'lucide-react'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {navOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setNavOpen(false)} />
      )}
      <PlatformNav open={navOpen} onClose={() => setNavOpen(false)} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="md:hidden flex items-center h-14 px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button onClick={() => setNavOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Open menu">
            <Menu size={20} className="text-gray-600" />
          </button>
          <span className="ml-3 font-semibold text-sm text-gray-800">Platform Admin</span>
        </div>
        {children}
      </main>
    </div>
  )
}
