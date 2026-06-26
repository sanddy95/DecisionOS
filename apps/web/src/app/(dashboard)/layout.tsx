'use client'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { CommandPalette } from '@/components/layout/command-palette'
import { AuthGuard } from '@/components/layout/auth-guard'
import { useUIStore } from '@/store/ui.store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore()
  const sidebarWidth = sidebarOpen ? 240 : 64

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header sidebarWidth={sidebarWidth} />
        <main
          className="transition-all duration-300 pt-16"
          style={{ marginLeft: sidebarWidth }}
        >
          <div className="p-6">{children}</div>
        </main>
        <CommandPalette />
      </div>
    </AuthGuard>
  )
}
