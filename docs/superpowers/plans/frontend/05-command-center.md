# Phase 5: Executive Command Center

**Goal:** Build the home dashboard — KPI cards, AI executive summary, risk panel, recommendations panel, recent decisions, and priority tasks.

---

## Files Created

- `apps/web/src/app/(dashboard)/page.tsx`
- `apps/web/src/components/dashboard/kpi-card.tsx`
- `apps/web/src/components/dashboard/ai-summary-card.tsx`
- `apps/web/src/components/dashboard/risk-panel.tsx`
- `apps/web/src/components/dashboard/recommendation-panel.tsx`
- `apps/web/src/components/dashboard/tasks-panel.tsx`
- `apps/web/src/components/ui/trend-badge.tsx`
- `apps/web/src/components/ui/skeleton-card.tsx`

---

## Task 1: Reusable KPI Card

`apps/web/src/components/dashboard/kpi-card.tsx`:
```tsx
'use client'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import type { KPIData } from '@/lib/types'

const statusConfig = {
  good: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', icon: CheckCircle, iconColor: 'text-green-600' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', icon: AlertTriangle, iconColor: 'text-amber-600' },
  critical: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', icon: XCircle, iconColor: 'text-red-600' },
}

interface KPICardProps { kpi: KPIData; onClick?: () => void }

export function KPICard({ kpi, onClick }: KPICardProps) {
  const config = statusConfig[kpi.status]
  const StatusIcon = config.icon

  const formattedValue = kpi.unit === '$'
    ? formatCurrency(kpi.value)
    : kpi.unit === '%'
    ? formatPercent(kpi.value)
    : `${kpi.value} ${kpi.unit}`

  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
  const trendColor = kpi.trend === 'up'
    ? (kpi.status === 'critical' ? 'text-red-600' : 'text-green-600')
    : kpi.trend === 'down'
    ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600')
    : 'text-muted-foreground'

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-5 transition-all',
        config.bg, config.border,
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
        <StatusIcon size={16} className={config.iconColor} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight">{formattedValue}</p>
          <div className={cn('flex items-center gap-1 mt-1 text-sm font-medium', trendColor)}>
            <TrendIcon size={14} />
            <span>{formatPercent(Math.abs(kpi.changePercent))} vs last period</span>
          </div>
        </div>

        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.history.slice(-8)}>
              <Line
                type="monotone" dataKey="value" dot={false} strokeWidth={2}
                stroke={kpi.status === 'critical' ? '#ef4444' : kpi.status === 'warning' ? '#f59e0b' : '#22c55e'}
              />
              <Tooltip
                content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="bg-popover border rounded px-2 py-1 text-xs">
                    {kpi.unit === '$' ? formatCurrency(payload[0].value as number) : `${payload[0].value} ${kpi.unit}`}
                  </div>
                ) : null}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
```

---

## Task 2: AI Summary Card

`apps/web/src/components/dashboard/ai-summary-card.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const summaries = [
  "Revenue performance is strong this month at $106K MRR (+21.8%), driven by the NovaTech and GlobalTech accounts. However, renewal rate has declined to 82% — 3 enterprise customers (Acme Corp, CloudBase Inc, StartupXYZ) require immediate account manager attention before their July renewal windows close. Overdue invoices have spiked 122% to $4,000, primarily from 2 SMB accounts. The ClearPath AI deal at $120K remains your highest-priority pipeline opportunity with a July 10 expected close. Recommended focus for today: contact Acme Corp, clear the overdue invoice backlog, and schedule the ClearPath executive sponsor meeting.",
  "Today's business intelligence summary indicates healthy top-line growth but three operational risks requiring action. Your MRR of $106K exceeds the June target by 6%. The primary concern is a deteriorating renewal cohort — risk score analysis identifies 3 customers totaling $16,500 MRR within 30-day renewal windows and scoring above 70 on the risk index. Support resolution time has increased to 3.2 days, a 52% increase over 4 months, which correlates with the elevated churn risk signals. Priority action: close-loop on Acme Corp escalated tickets before the July 15 renewal date.",
]

export function AISummaryCard() {
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshedAt] = useState(new Date())

  async function refresh() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setIndex(i => (i + 1) % summaries.length)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border bg-gradient-to-br from-navy-900 to-navy-800 text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Executive Summary</h3>
            <p className="text-white/50 text-xs">Updated {refreshedAt.toLocaleTimeString()}</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
          onClick={refresh} disabled={loading} aria-label="Refresh summary">
          <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
        </Button>
      </div>
      <p className={cn('text-sm leading-relaxed text-white/90 transition-opacity', loading && 'opacity-50')}>
        {summaries[index]}
      </p>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <span className="text-xs text-white/50">Sources cited:</span>
        {['revenue', 'customers', 'sales_pipeline', 'support_tickets'].map(src => (
          <span key={src} className="text-xs bg-white/10 rounded px-2 py-0.5 font-mono">{src}</span>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 3: Risk Panel

`apps/web/src/components/dashboard/risk-panel.tsx`:
```tsx
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { mockInsights } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  high: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  medium: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  low: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/30', badge: 'bg-gray-100 text-gray-600' },
}

export function RiskPanel() {
  const activeRisks = mockInsights.filter(i => i.status === 'active' && (i.severity === 'critical' || i.severity === 'high'))

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">Active Risks</h3>
        <Link href="/insights" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      <div className="divide-y">
        {activeRisks.map(risk => {
          const config = severityConfig[risk.severity]
          const Icon = config.icon
          return (
            <div key={risk.id} className="px-5 py-4 flex gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{risk.title}</p>
                  <Badge className={cn('text-xs shrink-0 capitalize border-0', config.badge)}>
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{risk.estimatedImpact}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 4: Recommendation Panel

`apps/web/src/components/dashboard/recommendation-panel.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { mockRecommendations } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

const priorityColors = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Low: 'bg-gray-100 text-gray-600',
}

export function RecommendationPanel() {
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const pending = mockRecommendations.filter(r => r.status === 'Pending').slice(0, 3)

  function handleApprove(id: string, title: string) {
    setApproved(prev => new Set([...prev, id]))
    toast.success(`Approved: ${title}`)
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">Top Recommendations</h3>
        <Link href="/recommendations" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      <div className="divide-y">
        {pending.map(rec => (
          <div key={rec.id} className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn('text-xs border-0', priorityColors[rec.priority])}>{rec.priority}</Badge>
                  <span className="text-xs text-muted-foreground">{rec.urgency}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {rec.confidenceScore}% · Impact: {rec.impactEstimate}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {approved.has(rec.id) ? (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <CheckCircle size={14} /> Approved
                </span>
              ) : (
                <>
                  <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                    onClick={() => handleApprove(rec.id, rec.title)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs px-3" asChild>
                    <Link href={`/recommendations`}>
                      View <ChevronRight size={12} className="ml-0.5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 5: Tasks Panel

`apps/web/src/components/dashboard/tasks-panel.tsx`:
```tsx
import { mockTasks } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getInitials, cn } from '@/lib/utils'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const statusColors = {
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
```

---

## Task 6: Assemble Command Center Page

`apps/web/src/app/(dashboard)/page.tsx`:
```tsx
import { KPICard } from '@/components/dashboard/kpi-card'
import { AISummaryCard } from '@/components/dashboard/ai-summary-card'
import { RiskPanel } from '@/components/dashboard/risk-panel'
import { RecommendationPanel } from '@/components/dashboard/recommendation-panel'
import { TasksPanel } from '@/components/dashboard/tasks-panel'
import { mockKPIs } from '@/lib/mock-data'

export default function CommandCenterPage() {
  const topKPIs = mockKPIs.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {topKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* AI Summary */}
      <AISummaryCard />

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskPanel />
        </div>
        <div className="lg:col-span-1">
          <RecommendationPanel />
        </div>
        <div className="lg:col-span-1">
          <TasksPanel />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add apps/web/src/app/\(dashboard\)/page.tsx apps/web/src/components/dashboard
git commit -m "feat: build Executive Command Center with KPI cards, AI summary, risk and recommendation panels"
```
