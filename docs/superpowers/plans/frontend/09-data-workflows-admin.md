# Phase 9: Data Sources, Workflows & Admin Pages

**Goal:** Build Data Sources (with CSV upload wizard), Workflows/Tasks page, and Admin Console.

---

## Files Created

- `apps/web/src/app/(dashboard)/data-sources/page.tsx`
- `apps/web/src/app/(dashboard)/workflows/page.tsx`
- `apps/web/src/app/(dashboard)/admin/page.tsx`
- `apps/web/src/components/data/upload-wizard.tsx`
- `apps/web/src/components/data/source-card.tsx`
- `apps/web/src/components/workflows/task-card.tsx`
- `apps/web/src/components/admin/users-tab.tsx`
- `apps/web/src/components/admin/audit-tab.tsx`

---

## Task 1: Data Sources Page

`apps/web/src/app/(dashboard)/data-sources/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, FileSpreadsheet, Upload, CheckCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react'
import { UploadWizard } from '@/components/data/upload-wizard'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const mockSources = [
  { id: 'ds1', name: 'Customers Dataset', type: 'csv', status: 'active', rows: 10, lastSync: new Date(Date.now() - 3600000).toISOString(), tableName: 'customers' },
  { id: 'ds2', name: 'Revenue & Invoices', type: 'csv', status: 'active', rows: 9, lastSync: new Date(Date.now() - 7200000).toISOString(), tableName: 'revenue' },
  { id: 'ds3', name: 'Support Tickets', type: 'csv', status: 'active', rows: 7, lastSync: new Date(Date.now() - 7200000).toISOString(), tableName: 'support_tickets' },
  { id: 'ds4', name: 'Sales Pipeline', type: 'excel', status: 'active', rows: 8, lastSync: new Date(Date.now() - 86400000).toISOString(), tableName: 'sales_pipeline' },
  { id: 'ds5', name: 'Customer Engagement', type: 'csv', status: 'syncing', rows: 0, lastSync: null, tableName: 'engagement' },
]

const typeIcons = { csv: FileSpreadsheet, excel: FileSpreadsheet, postgres: Database }
const statusColors = { active: 'bg-green-100 text-green-700', syncing: 'bg-blue-100 text-blue-700', error: 'bg-red-100 text-red-700', inactive: 'bg-gray-100 text-gray-600' }

export default function DataSourcesPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [sources, setSources] = useState(mockSources)
  const [syncing, setSyncing] = useState<string | null>(null)

  async function handleSync(id: string) {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 1500))
    setSyncing(null)
    toast.success('Data source synced successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <p className="text-sm text-muted-foreground">{sources.length} connected sources · {sources.reduce((acc, s) => acc + s.rows, 0).toLocaleString()} total rows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowUpload(true)}>
          <Upload size={15} /> Upload Data
        </Button>
      </div>

      {showUpload && <UploadWizard onClose={() => setShowUpload(false)} onComplete={(name) => { setSources(prev => [...prev, { id: `ds${Date.now()}`, name, type: 'csv', status: 'active', rows: 45, lastSync: new Date().toISOString(), tableName: name.toLowerCase().replace(/\s/g, '_') }]); setShowUpload(false) }} />}

      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="history">Ingestion History</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {sources.map(source => {
              const Icon = typeIcons[source.type as keyof typeof typeIcons] ?? Database
              return (
                <div key={source.id} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.rows > 0 ? `${source.rows.toLocaleString()} rows` : 'Syncing...'} · {source.lastSync ? formatDate(source.lastSync) : 'Never'}
                    </p>
                  </div>
                  <Badge className={`text-xs border-0 capitalize ${statusColors[source.status as keyof typeof statusColors] ?? 'bg-gray-100 text-gray-600'}`}>{source.status}</Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => void handleSync(source.id)} disabled={syncing === source.id}>
                    <RefreshCw size={13} className={syncing === source.id ? 'animate-spin' : ''} />
                  </Button>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {[...sources].reverse().slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ingested: {s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rows} rows imported · {s.lastSync ? formatDate(s.lastSync) : 'Pending'}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">Success</Badge>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Task 2: Upload Wizard

`apps/web/src/components/data/upload-wizard.tsx`:
```tsx
'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { X, Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface UploadWizardProps {
  onClose: () => void
  onComplete: (name: string) => void
}

type Step = 'upload' | 'preview' | 'confirm' | 'done'

const previewData = {
  columns: ['customer_id', 'customer_name', 'segment', 'industry', 'start_date', 'status'],
  rows: [
    ['C001', 'Apex Corp', 'Enterprise', 'Technology', '2024-01-15', 'Active'],
    ['C002', 'Nova Health', 'Mid-Market', 'Healthcare', '2024-03-20', 'Active'],
    ['C003', 'Swift Labs', 'SMB', 'SaaS', '2024-06-01', 'At-Risk'],
  ],
  quality: { nulls: 0, duplicates: 0, typeIssues: 0, totalRows: 45 },
}

export function UploadWizard({ onClose, onComplete }: UploadWizardProps) {
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [datasetName, setDatasetName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setDatasetName(f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '))
    let p = 0
    const interval = setInterval(() => {
      p += 15
      setProgress(p)
      if (p >= 100) { clearInterval(interval); setTimeout(() => setStep('preview'), 300) }
    }, 100)
  }

  async function handleConfirm() {
    setStep('confirm')
    let p = 0
    const interval = setInterval(() => {
      p += 8
      setProgress(p)
      if (p >= 100) { clearInterval(interval); setStep('done') }
    }, 80)
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Upload Data Source</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-xs">
        {(['upload', 'preview', 'confirm', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-border" />}
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center font-semibold', step === s ? 'bg-blue-600 text-white' : ['upload', 'preview', 'confirm', 'done'].indexOf(step) > i ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground')}>
              {['upload', 'preview', 'confirm', 'done'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            <span className={cn('capitalize', step === s && 'font-medium')}>{s}</span>
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={cn('border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors', dragging ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'border-border hover:border-blue-400')}
        >
          <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">Drop CSV or Excel file here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse · max 50MB</p>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
      )}

      {step === 'upload' && file && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <FileText size={16} className="text-muted-foreground" />
            <span className="flex-1 truncate">{file.name}</span>
            <span className="text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">Analyzing schema...</p>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[['Total Rows', previewData.quality.totalRows], ['Null Values', previewData.quality.nulls], ['Duplicates', previewData.quality.duplicates]].map(([label, val]) => (
              <div key={label as string} className="text-center rounded-lg bg-muted p-3">
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="text-xs w-full">
              <thead><tr className="bg-muted">{previewData.columns.map(c => <th key={c} className="px-3 py-2 text-left font-semibold">{c}</th>)}</tr></thead>
              <tbody>{previewData.rows.map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Dataset name</label>
            <Input value={datasetName} onChange={e => setDatasetName(e.target.value)} placeholder="e.g. Q2 Customers" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => void handleConfirm()}>Confirm Import</Button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-3">
          <p className="text-sm">Ingesting {previewData.quality.totalRows} rows...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {step === 'done' && (
        <div className="text-center space-y-3 py-4">
          <CheckCircle size={40} className="text-green-600 mx-auto" />
          <h4 className="font-semibold">Data imported successfully</h4>
          <p className="text-sm text-muted-foreground">{previewData.quality.totalRows} rows from <strong>{datasetName}</strong> are now available for AI queries and dashboards.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onComplete(datasetName)}>Done</Button>
        </div>
      )}
    </div>
  )
}
```

---

## Task 3: Workflows Page

`apps/web/src/app/(dashboard)/workflows/page.tsx`:
```tsx
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

const priorityBadge = { Critical: 'bg-red-100 text-red-700', High: 'bg-amber-100 text-amber-700', Medium: 'bg-blue-100 text-blue-700', Low: 'bg-gray-100 text-gray-600' }
const statusBadge = { 'Open': 'bg-blue-100 text-blue-700', 'In-Progress': 'bg-purple-100 text-purple-700', 'Overdue': 'bg-red-100 text-red-700', 'Completed': 'bg-green-100 text-green-700' }

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
```

---

## Task 4: Admin Console Page

`apps/web/src/app/(dashboard)/admin/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { Shield, Users, Database, Key, ClipboardList, Settings } from 'lucide-react'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700',
  'Admin': 'bg-orange-100 text-orange-700',
  'Executive': 'bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300',
  'Analyst': 'bg-purple-100 text-purple-700',
  'Operations': 'bg-blue-100 text-blue-700',
  'Viewer': 'bg-gray-100 text-gray-600',
}

const auditEvents = [
  { id: 'a1', event: 'user.login', user: 'Alex Johnson', resource: 'auth', description: 'Successful login', ip: '192.168.1.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a2', event: 'recommendation.approved', user: 'Alex Johnson', resource: 'recommendations/rec1', description: 'Approved: Assign account manager to Acme Corp', ip: '192.168.1.1', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a3', event: 'data.upload', user: 'James Wilson', resource: 'datasets', description: 'Uploaded: customers.csv (10 rows)', ip: '10.0.0.5', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a4', event: 'query.executed', user: 'Sarah Chen', resource: 'query-engine', description: 'SQL: SELECT customer_id, risk_score FROM customers...', ip: '10.0.0.8', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'a5', event: 'user.login.failed', user: 'unknown@external.com', resource: 'auth', description: 'Failed login attempt', ip: '45.23.114.89', createdAt: new Date(Date.now() - 259200000).toISOString() },
]

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers)
  const [llmModel, setLlmModel] = useState('gpt-4o')
  const [temperature, setTemperature] = useState('0.3')

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="users" className="gap-1.5"><Users size={14} />Users</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5"><Shield size={14} />Roles</TabsTrigger>
          <TabsTrigger value="llm" className="gap-1.5"><Key size={14} />LLM</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><ClipboardList size={14} />Audit Logs</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings size={14} />Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="flex justify-between mb-4">
            <Input placeholder="Search users..." className="max-w-xs" />
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Invite User</Button>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-4 p-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.department}</p>
                </div>
                <Badge className={`border-0 text-xs ${roleColors[user.role] ?? 'bg-gray-100'}`}>{user.role}</Badge>
                <Switch checked={user.isActive} onCheckedChange={(v) => { setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: v } : u)); toast.success(v ? 'User activated' : 'User deactivated') }} aria-label={`Toggle ${user.name}`} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(roleColors).map(([role, color]) => (
              <div key={role} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`border-0 text-sm ${color}`}>{role}</Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {role === 'Admin' && <><p>✓ Manage users & roles</p><p>✓ Configure data sources</p><p>✓ View audit logs</p><p>✓ Manage KPIs</p></>}
                  {role === 'Executive' && <><p>✓ View all dashboards</p><p>✓ Approve recommendations</p><p>✓ Access Ask AI</p><p>✓ View insights</p></>}
                  {role === 'Analyst' && <><p>✓ Run AI queries</p><p>✓ Manage datasets</p><p>✓ Create dashboards</p><p>✓ Configure KPIs</p></>}
                  {role === 'Operations' && <><p>✓ Manage tasks</p><p>✓ Process approvals</p><p>✓ View workflows</p><p>✓ View dashboards</p></>}
                  {role === 'Viewer' && <><p>✓ View dashboards</p><p>✓ View insights</p><p>✓ View recommendations</p></>}
                  {role === 'Super Admin' && <><p>✓ Full platform access</p><p>✓ All admin operations</p><p>✓ System configuration</p></>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* LLM Settings Tab */}
        <TabsContent value="llm" className="mt-6">
          <div className="max-w-lg space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">LLM Provider Configuration</h3>
              <div className="space-y-1.5">
                <Label>Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude 4 Sonnet)</SelectItem>
                    <SelectItem value="gemini">Google (Gemini 2.0 Flash)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                    <SelectItem value="claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>API Key</Label>
                <Input type="password" defaultValue="sk-••••••••••••••••••••••••••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>Temperature ({temperature})</Label>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full" />
                <p className="text-xs text-muted-foreground">Lower = more factual and deterministic. Recommended: 0.1–0.3</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => toast.success('LLM settings saved')}>Save Settings</Button>
            </div>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="mt-6">
          <div className="flex gap-3 mb-4">
            <Input placeholder="Search audit logs..." className="max-w-xs" />
            <Button variant="outline" size="sm">Export CSV</Button>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {auditEvents.map(event => (
              <div key={event.id} className="px-4 py-3 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{event.event}</Badge>
                    <span className="text-xs text-muted-foreground">{event.user}</span>
                  </div>
                  <p className="text-sm mt-1 truncate">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">IP: {event.ip} · {formatDate(event.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-lg space-y-4">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Organization Settings</h3>
              <div className="space-y-1.5"><Label>Organization Name</Label><Input defaultValue="Acme Demo Corp" /></div>
              <div className="space-y-1.5"><Label>Default Timezone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">UTC</SelectItem>
                    <SelectItem value="utc+5.5">IST (UTC+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Audit Log Retention</Label>
                <Select defaultValue="12m">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12m">12 months</SelectItem>
                    <SelectItem value="24m">24 months</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => toast.success('Settings saved')}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add apps/web/src/app/\(dashboard\)/data-sources apps/web/src/app/\(dashboard\)/workflows apps/web/src/app/\(dashboard\)/admin apps/web/src/components/data apps/web/src/components/workflows apps/web/src/components/admin
git commit -m "feat: build Data Sources upload wizard, Workflows page, Admin Console"
```
