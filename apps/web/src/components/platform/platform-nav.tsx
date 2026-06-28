'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, Cpu, ScrollText, Settings, Shield, ArrowLeft, LogOut, X,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/platform', icon: LayoutDashboard, exact: true },
  { label: 'Tenants', href: '/platform/tenants', icon: Building2 },
  { label: 'LLM Usage', href: '/platform/llm-usage', icon: Cpu },
  { label: 'Audit Logs', href: '/platform/audit-logs', icon: ScrollText },
  { label: 'Settings', href: '/platform/settings', icon: Settings },
]

interface PlatformNavProps {
  open?: boolean
  onClose?: () => void
}

export function PlatformNav({ open = true, onClose }: PlatformNavProps) {
  const pathname = usePathname()
  return (
    <aside className={cn(
      'fixed md:static top-0 left-0 h-full w-60 z-40',
      'bg-violet-950 text-white flex flex-col shrink-0 border-r border-violet-800/50',
      'transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    )}>
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-violet-800/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">DecisionOS</p>
            <p className="text-[10px] text-violet-300">Platform Admin</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden p-1 hover:bg-violet-800/50 rounded text-violet-300 transition-colors" aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} onClick={() => onClose?.()}
              className={cn(
                'flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-600 text-white'
                  : 'text-violet-200/70 hover:text-white hover:bg-violet-800/50'
              )}>
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-violet-800/50 py-3 px-2 space-y-0.5">
        <Link href="/" onClick={() => onClose?.()}
          className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-violet-300 hover:text-white hover:bg-violet-800/50 transition-colors">
          <ArrowLeft size={14} /> Back to App
        </Link>
        <button
          onClick={() => {
            document.cookie = 'decisionos-platform-auth=; path=/; max-age=0'
            window.location.href = '/platform/login'
          }}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-violet-300 hover:text-white hover:bg-violet-800/50 transition-colors">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
