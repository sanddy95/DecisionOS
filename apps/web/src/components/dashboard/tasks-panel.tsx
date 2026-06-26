import { mockTasks } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getInitials, cn } from '@/lib/utils'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const statusColors: Record<string, string> = {
  'Open': 'bg-blue-100 text-blue-700',
  'In-Progress': 'bg-purple-100 text-purple-700',
  'Overdue': 'bg-red-100 text-red-700',
  'Completed': 'bg-green-100 text-green-700',
}

export function TasksPanel() {
  const upcoming = mockTasks.filter(t => t.status !== 'Completed').slice(0, 4)

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">Priority Tasks</h3>
        <Link href="/workflows" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      <div className="divide-y">
        {upcoming.map(task => (
          <div key={task.id} className="px-5 py-3.5 flex items-center gap-3">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src={task.ownerAvatar} />
              <AvatarFallback className="text-[10px]">{getInitials(task.owner)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{task.title}</p>
                {task.status === 'Overdue' && <AlertCircle size={12} className="text-red-500 shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground">
                Due {formatDate(task.dueDate)} · {task.owner}
              </p>
            </div>
            <Badge className={cn('text-xs border-0 shrink-0', statusColors[task.status] ?? 'bg-gray-100 text-gray-600')}>
              {task.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
