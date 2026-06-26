'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'
import {
  LayoutDashboard, MessageSquareText, BarChart3, Lightbulb,
  Sparkles, Database, Target, GitBranch, Settings, ChevronLeft,
  ChevronRight, TrendingUp,
} from 'lucide-react'

const navItems = [
  { label: 'Command Center', href: '/', icon: LayoutDashboard },
  { label: 'Ask AI', href: '/ask', icon: MessageSquareText },
  { label: 'Dashboards', href: '/dashboards', icon: BarChart3 },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
  { label: 'Recommendations', href: '/recommendations', icon: Sparkles },
  { label: 'Data Sources', href: '/data-sources', icon: Database },
  { label: 'KPI Config', href: '/kpis', icon: Target },
  { label: 'Workflows', href: '/workflows', icon: GitBranch },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-navy-900 text-white transition-all duration-300 z-40 flex flex-col',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-white/10 shrink-0', sidebarOpen ? 'gap-3' : 'justify-center')}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp size={16} className="text-white" />
        </div>
        {sidebarOpen && <span className="font-bold text-lg tracking-tight">DecisionOS</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center h-10 px-4 rounded-lg mx-2 transition-colors text-sm font-medium gap-3',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
                !sidebarOpen && 'justify-center px-0 mx-2'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 py-3">
        <Link href="/admin"
          className={cn(
            'flex items-center h-10 px-4 rounded-lg mx-2 text-sm font-medium gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors',
            !sidebarOpen && 'justify-center px-0'
          )}
          title={!sidebarOpen ? 'Admin' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          {sidebarOpen && <span>Admin Console</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-navy-900 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  )
}
