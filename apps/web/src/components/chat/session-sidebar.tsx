'use client'
import { MessageSquareText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Session { id: string; title: string; createdAt: string }

interface SessionSidebarProps {
  sessions: Session[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}

export function SessionSidebar({ sessions, activeId, onSelect, onNew }: SessionSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col shrink-0">
      <div className="p-3 border-b">
        <Button onClick={onNew} variant="outline" size="sm" className="w-full gap-2">
          <Plus size={14} /> New conversation
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)}
            className={cn(
              'w-full text-left rounded-lg px-3 py-2.5 hover:bg-muted transition-colors',
              activeId === s.id && 'bg-muted font-medium'
            )}>
            <div className="flex items-center gap-2">
              <MessageSquareText size={13} className="text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{s.title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 pl-5">
              {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
