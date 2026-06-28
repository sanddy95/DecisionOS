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

// In production this comes from the JWT/session — hardcoded for demo
const CURRENT_ORG = { name: 'Acme Corp', plan: 'Enterprise' }

function getInitials(name: string) {
  return name.split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <>
      {/* Mobile backdrop — closes sidebar when tapping outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-navy-900 text-white transition-all duration-300 z-40 flex flex-col',
      // Mobile: slide off-screen when closed, overlay when open (always 240px)
      // Desktop: always visible, width toggles between 64px and 240px
      sidebarOpen
        ? 'translate-x-0 w-60'
        : '-translate-x-full md:translate-x-0 w-60 md:w-16'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-white/10 shrink-0', sidebarOpen ? 'gap-3' : 'justify-center')}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp size={16} className="text-white" />
        </div>
        {sidebarOpen && <span className="font-bold text-lg tracking-tight">DecisionOS</span>}
      </div>

      {/* Current org — static, no switcher */}
      <div className={cn('px-2 py-3 border-b border-white/10 shrink-0', !sidebarOpen && 'md:flex md:justify-center')}>
        {sidebarOpen ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {getInitials(CURRENT_ORG.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{CURRENT_ORG.name}</p>
              <p className="text-[10px] text-white/50">{CURRENT_ORG.plan}</p>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-8 h-8 rounded-lg bg-violet-600 items-center justify-center text-white text-[10px] font-bold shrink-0">
            {getInitials(CURRENT_ORG.name)}
          </div>
        )}
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
                !sidebarOpen && 'md:justify-center md:px-0 md:mx-2'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <span className={cn('truncate', !sidebarOpen && 'md:hidden')}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 py-3">
        <Link href="/admin"
          className={cn(
            'flex items-center h-10 px-4 rounded-lg mx-2 text-sm font-medium gap-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors',
            !sidebarOpen && 'md:justify-center md:px-0'
          )}
          title={!sidebarOpen ? 'Admin' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          <span className={cn(!sidebarOpen && 'md:hidden')}>Admin Console</span>
        </Link>
      </div>

      {/* Collapse toggle — desktop only */}
      <button onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-navy-900 border border-white/20 rounded-full items-center justify-center text-white/70 hover:text-white transition-colors hidden md:flex"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
    </>
  )
}
