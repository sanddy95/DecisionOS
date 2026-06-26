# Phase 4: Main Application Layout

**Goal:** Build the full protected dashboard layout — sidebar navigation, top header with notifications + user menu, command palette (⌘K), and the auth-guard wrapper.

---

## Files Created

- `apps/web/src/app/(dashboard)/layout.tsx`
- `apps/web/src/components/layout/sidebar.tsx`
- `apps/web/src/components/layout/header.tsx`
- `apps/web/src/components/layout/notification-bell.tsx`
- `apps/web/src/components/layout/user-menu.tsx`
- `apps/web/src/components/layout/command-palette.tsx`
- `apps/web/src/components/layout/auth-guard.tsx`

---

## Task 1: Sidebar Navigation

- [ ] **Step 1: Create sidebar component**

`apps/web/src/components/layout/sidebar.tsx`:
```tsx
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
```

---

## Task 2: Notification Bell

- [ ] **Step 1: Create notification bell**

`apps/web/src/components/layout/notification-bell.tsx`:
```tsx
'use client'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotificationStore } from '@/store/notification.store'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

const typeColors: Record<string, string> = {
  recommendation: 'bg-blue-500',
  kpi_alert: 'bg-red-500',
  task_overdue: 'bg-amber-500',
  approval_request: 'bg-purple-500',
  anomaly: 'bg-orange-500',
  ingestion: 'bg-green-500',
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">No notifications</div>
          ) : (
            notifications.map(n => (
              <Link key={n.id} href={n.actionUrl} onClick={() => markRead(n.id)}
                className={cn('flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0', !n.isRead && 'bg-blue-50 dark:bg-blue-950/20')}>
                <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', typeColors[n.type] ?? 'bg-gray-400')} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !n.isRead && 'font-semibold')}>{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
```

---

## Task 3: User Menu

- [ ] **Step 1: Create user menu**

`apps/web/src/components/layout/user-menu.tsx`:
```tsx
'use client'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { User, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

export function UserMenu() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-navy-900 text-white text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="w-fit text-xs mt-1">{user.role}</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User size={14} className="mr-2" /> Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => { logout(); router.push('/login') }}>
          <LogOut size={14} className="mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Task 4: Header

- [ ] **Step 1: Create header**

`apps/web/src/components/layout/header.tsx`:
```tsx
'use client'
import { useUIStore } from '@/store/ui.store'
import { NotificationBell } from './notification-bell'
import { UserMenu } from './user-menu'
import { Button } from '@/components/ui/button'
import { Search, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <header className="fixed top-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-30 flex items-center px-4 gap-4"
      style={{ left: sidebarWidth }}>
      <button onClick={toggleSidebar} className="md:hidden p-1" aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold flex-1">{title}</h1>
      <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hidden sm:flex w-48 justify-between"
        onClick={() => setCommandPaletteOpen(true)}>
        <span className="flex items-center gap-2"><Search size={14} /> Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>
      <NotificationBell />
      <UserMenu />
    </header>
  )
}
```

---

## Task 5: Command Palette

- [ ] **Step 1: Create command palette**

`apps/web/src/components/layout/command-palette.tsx`:
```tsx
'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from 'cmdk'
import { useUIStore } from '@/store/ui.store'
import { LayoutDashboard, MessageSquareText, BarChart3, Lightbulb, Sparkles, Database, Target, GitBranch, Settings } from 'lucide-react'

const commands = [
  { label: 'Go to Command Center', href: '/', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Ask AI a question', href: '/ask', icon: MessageSquareText, group: 'Navigation' },
  { label: 'View Dashboards', href: '/dashboards', icon: BarChart3, group: 'Navigation' },
  { label: 'View Insights', href: '/insights', icon: Lightbulb, group: 'Navigation' },
  { label: 'View Recommendations', href: '/recommendations', icon: Sparkles, group: 'Navigation' },
  { label: 'Manage Data Sources', href: '/data-sources', icon: Database, group: 'Navigation' },
  { label: 'Configure KPIs', href: '/kpis', icon: Target, group: 'Navigation' },
  { label: 'View Workflows', href: '/workflows', icon: GitBranch, group: 'Navigation' },
  { label: 'Admin Console', href: '/admin', icon: Settings, group: 'Admin' },
]

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCommandPaletteOpen(true)
    }
  }, [setCommandPaletteOpen])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const groups = [...new Set(commands.map(c => c.group))]

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(group => (
          <CommandGroup key={group} heading={group}>
            {commands.filter(c => c.group === group).map(({ label, href, icon: Icon }) => (
              <CommandItem key={href} onSelect={() => { router.push(href); setCommandPaletteOpen(false) }}
                className="flex items-center gap-2 cursor-pointer">
                <Icon size={16} className="text-muted-foreground" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
```

---

## Task 6: Dashboard Layout

- [ ] **Step 1: Create auth guard**

`apps/web/src/components/layout/auth-guard.tsx`:
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null
  return <>{children}</>
}
```

- [ ] **Step 2: Create dashboard layout**

`apps/web/src/app/(dashboard)/layout.tsx`:
```tsx
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
```

- [ ] **Step 3: Create placeholder home page**

`apps/web/src/app/(dashboard)/page.tsx`:
```tsx
export default function CommandCenterPage() {
  return <div className="text-2xl font-bold">Command Center — coming in Phase 5</div>
}
```

- [ ] **Step 4: Verify layout renders**

```bash
cd apps/web && pnpm dev
```

Navigate to `http://localhost:3000` — should redirect to `/login`. Login with any email → should show Command Center layout with sidebar, header, notification bell, and user menu.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/\(dashboard\) apps/web/src/components/layout
git commit -m "feat: add main app layout — sidebar, header, notifications, command palette"
```
