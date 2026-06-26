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
