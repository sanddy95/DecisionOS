'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
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
