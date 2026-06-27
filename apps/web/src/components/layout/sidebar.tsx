'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { mockTenants } from '@/lib/mock-data'
import {
  LayoutDashboard, MessageSquareText, BarChart3, Lightbulb,
  Sparkles, Database, Target, GitBranch, Settings, ChevronLeft,
  ChevronRight, TrendingUp, ChevronsUpDown, Check, Building2,
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

const switcherTenants = mockTenants.filter(t => t.status !== 'Suspended' && t.status !== 'Churned').slice(0, 4)

const planColors: Record<string, string> = {
  Enterprise: 'bg-violet-600',
  Professional: 'bg-blue-600',
  Starter: 'bg-green-600',
  Trial: 'bg-amber-500',
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [activeTenant, setActiveTenant] = useState(switcherTenants[0] ?? mockTenants[0]!)
  const [open, setOpen] = useState(false)

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

      {/* Workspace switcher */}
      <div className={cn('px-2 py-3 border-b border-white/10 shrink-0', !sidebarOpen && 'flex justify-center')}>
        {sidebarOpen ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left">
                <div className={cn('w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0', planColors[activeTenant.plan] ?? 'bg-blue-600')}>
                  {getInitials(activeTenant.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{activeTenant.name}</p>
                  <p className="text-[10px] text-white/50">{activeTenant.plan}</p>
                </div>
                <ChevronsUpDown size={12} className="text-white/50 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start" side="right">
              <p className="text-[10px] text-muted-foreground px-2 py-1.5 font-medium uppercase tracking-wider">Workspaces</p>
              {switcherTenants.map(t => (
                <button key={t.id}
                  onClick={() => { setActiveTenant(t); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-left">
                  <div className={cn('w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0', planColors[t.plan] ?? 'bg-blue-600')}>
                    {getInitials(t.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.plan}</p>
                  </div>
                  {activeTenant.id === t.id && <Check size={13} className="text-blue-600 shrink-0" />}
                </button>
              ))}
              <div className="border-t mt-1 pt-1">
                <Link href="/platform/tenants"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-xs text-muted-foreground transition-colors">
                  <Building2 size={13} /> All workspaces
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0', planColors[activeTenant.plan] ?? 'bg-blue-600')}>
            {getInitials(activeTenant.name)}
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
