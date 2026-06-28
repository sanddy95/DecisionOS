'use client'
import { useUIStore } from '@/store/ui.store'
import { NotificationBell } from './notification-bell'
import { UserMenu } from './user-menu'
import { Button } from '@/components/ui/button'
import { Search, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/': 'Command Center',
  '/ask': 'Ask AI',
  '/dashboards': 'Dashboards',
  '/insights': 'Insights',
  '/recommendations': 'Recommendations',
  '/data-sources': 'Data Sources',
  '/kpis': 'KPI Configuration',
  '/workflows': 'Workflows',
  '/admin': 'Admin Console',
}

interface HeaderProps { sidebarWidth: number }

export function Header({ sidebarWidth }: HeaderProps) {
  const pathname = usePathname()
  const { setCommandPaletteOpen, toggleSidebar } = useUIStore()
  const title = Object.entries(pageTitles).find(([path]) => path === '/' ? pathname === '/' : pathname.startsWith(path))?.[1] ?? 'DecisionOS'

  return (
    <header className="fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-30 flex items-center justify-between px-3 md:px-4"
      style={{ left: sidebarWidth }}>
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button onClick={toggleSidebar} className="md:hidden p-1 shrink-0" aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <h1 className="text-base md:text-lg font-semibold truncate">{title}</h1>
      </div>
      {/* Right: search + notification + user — always anchored to right edge */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hidden sm:flex w-48 justify-between"
          onClick={() => setCommandPaletteOpen(true)}>
          <span className="flex items-center gap-2"><Search size={14} /> Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}
