'use client'
import { useState } from 'react'
import { mockTasks } from '@/lib/mock-data'
import type { Task } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatDate, getInitials, cn } from '@/lib/utils'
import { toast } from 'sonner'

const priorityBadge: Record<string, string> = { Critical: 'bg-red-100 text-red-700', High: 'bg-amber-100 text-amber-700', Medium: 'bg-blue-100 text-blue-700', Low: 'bg-gray-100 text-gray-600' }
const statusBadge: Record<string, string> = { 'Open': 'bg-blue-100 text-blue-700', 'In-Progress': 'bg-purple-100 text-purple-700', 'Overdue': 'bg-red-100 text-red-700', 'Completed': 'bg-green-100 text-green-700' }

export default function WorkflowsPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  function markComplete(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' as const } : t))
    toast.success('Task marked complete')
  }

  const myTasks = tasks.filter(t => t.status !== 'Completed')
  const overdue = tasks.filter(t => t.status === 'Overdue')
  const completed = tasks.filter(t => t.status === 'Completed')

  function TaskRow({ task }: { task: Task }) {
    return (
      <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={task.ownerAvatar} />
          <AvatarFallback className="text-xs">{getInitials(task.owner)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm">{task.title}</p>
            {task.status === 'Overdue' && <AlertCircle size={13} className="text-red-500 shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {task.owner} · Due {formatDate(task.dueDate)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={cn('border-0 text-xs', priorityBadge[task.priority])}>{task.priority}</Badge>
          <Badge className={cn('border-0 text-xs', statusBadge[task.status] ?? '')}>{task.status}</Badge>
          {task.status !== 'Completed' && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => markComplete(task.id)} aria-label="Mark complete">
              <CheckCircle size={14} className="text-muted-foreground hover:text-green-600" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{myTasks.length}</p>
          <p className="text-sm text-muted-foreground">Open Tasks</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{completed.length}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({myTasks.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdue.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {myTasks.length === 0 ? <p className="p-8 text-center text-muted-foreground">No open tasks</p> : myTasks.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {overdue.length === 0 ? <p className="p-8 text-center text-muted-foreground text-sm">No overdue tasks</p> : overdue.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {completed.length === 0 ? <p className="p-8 text-center text-muted-foreground text-sm">No completed tasks yet</p> : completed.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
