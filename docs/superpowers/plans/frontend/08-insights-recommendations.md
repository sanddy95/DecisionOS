# Phase 8: Insights & Recommendations Pages

**Goal:** Build the Insights page with severity filters and the Recommendations page with approve/reject flow.

---

## Files Created

- `apps/web/src/app/(dashboard)/insights/page.tsx`
- `apps/web/src/app/(dashboard)/recommendations/page.tsx`
- `apps/web/src/components/insights/insight-card.tsx`
- `apps/web/src/components/recommendations/recommendation-card.tsx`
- `apps/web/src/components/recommendations/approve-modal.tsx`

---

## Task 1: Insight Card

`apps/web/src/components/insights/insight-card.tsx`:
```tsx
'use client'
import { AlertCircle, AlertTriangle, Info, TrendingUp, Zap, Target, CheckCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { Insight } from '@/lib/types'
import { toast } from 'sonner'

const typeConfig = {
  anomaly: { icon: Zap, label: 'Anomaly', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  risk: { icon: AlertTriangle, label: 'Risk', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
  opportunity: { icon: TrendingUp, label: 'Opportunity', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
  trend: { icon: Target, label: 'Trend', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
}

const severityColors = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  low: 'bg-gray-100 text-gray-600',
}

interface InsightCardProps {
  insight: Insight
  onDismiss: (id: string) => void
  onCreateRecommendation: (id: string) => void
}

export function InsightCard({ insight, onDismiss, onCreateRecommendation }: InsightCardProps) {
  const typeConf = typeConfig[insight.type]
  const TypeIcon = typeConf.icon

  return (
    <div className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', typeConf.bg)}>
            <TypeIcon size={17} className={typeConf.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge className={cn('text-xs border-0 capitalize', severityColors[insight.severity])}>{insight.severity}</Badge>
              <Badge variant="outline" className="text-xs">{typeConf.label}</Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-semibold text-sm leading-snug">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Impact: </span>{insight.estimatedImpact}
          </p>
          {insight.affectedEntities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {insight.affectedEntities.map(e => (
                <span key={e} className="text-xs bg-muted rounded px-2 py-0.5">{e}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { onDismiss(insight.id); toast.success('Insight dismissed') }}>
            <X size={12} className="mr-1" /> Dismiss
          </Button>
          <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onCreateRecommendation(insight.id)}>
            Create Action
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## Task 2: Insights Page

`apps/web/src/app/(dashboard)/insights/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { InsightCard } from '@/components/insights/insight-card'
import { mockInsights } from '@/lib/mock-data'
import type { Insight, InsightType, InsightSeverity } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const severityFilters: Array<{ value: InsightSeverity | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const typeFilters: Array<{ value: InsightType | 'all'; label: string }> = [
  { value: 'all', label: 'All types' },
  { value: 'risk', label: 'Risk' },
  { value: 'anomaly', label: 'Anomaly' },
  { value: 'trend', label: 'Trend' },
  { value: 'opportunity', label: 'Opportunity' },
]

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>(mockInsights)
  const [severity, setSeverity] = useState<InsightSeverity | 'all'>('all')
  const [type, setType] = useState<InsightType | 'all'>('all')

  const filtered = insights.filter(i =>
    i.status === 'active' &&
    (severity === 'all' || i.severity === severity) &&
    (type === 'all' || i.type === type)
  )

  function handleDismiss(id: string) {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'dismissed' as const } : i))
  }

  function handleCreateRec(id: string) {
    const insight = insights.find(i => i.id === id)
    toast.success(`Recommendation created from: ${insight?.title.slice(0, 40)}...`)
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {(['critical', 'high', 'medium', 'low'] as InsightSeverity[]).map(s => {
          const count = insights.filter(i => i.status === 'active' && i.severity === s).length
          const colors = { critical: 'bg-red-50 border-red-200 text-red-700', high: 'bg-amber-50 border-amber-200 text-amber-700', medium: 'bg-blue-50 border-blue-200 text-blue-700', low: 'bg-gray-50 border-gray-200 text-gray-600' }
          return (
            <button key={s} onClick={() => setSeverity(severity === s ? 'all' : s)}
              className={cn('rounded-xl border p-4 text-left transition-all', colors[s], severity === s && 'ring-2 ring-offset-2 ring-current')}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm capitalize">{s}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {typeFilters.map(f => (
            <button key={f.value} onClick={() => setType(f.value as InsightType | 'all')}
              className={cn('px-3 py-1 text-sm rounded-md transition-colors', type === f.value ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} active insight{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No insights matching filters</p>
          <p className="text-sm">Try changing the severity or type filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(insight => (
            <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} onCreateRecommendation={handleCreateRec} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Task 3: Recommendation Card

`apps/web/src/components/recommendations/recommendation-card.tsx`:
```tsx
'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, formatCurrency } from '@/lib/utils'
import { CheckCircle, X, User, Clock, Database } from 'lucide-react'
import type { Recommendation } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

const priorityColors = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Medium: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-600',
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  'In-Progress': 'bg-purple-100 text-purple-700',
  Completed: 'bg-gray-100 text-gray-600',
}

interface RecommendationCardProps {
  rec: Recommendation
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function RecommendationCard({ rec, onApprove, onReject }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={cn('border-0 text-xs', priorityColors[rec.priority])}>{rec.priority}</Badge>
            <Badge className={cn('border-0 text-xs', statusColors[rec.status])}>{rec.status}</Badge>
            <span className="text-xs text-muted-foreground">{rec.urgency}</span>
          </div>
          <h3 className="font-semibold text-sm leading-snug">{rec.title}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{rec.description}</p>

      {/* Evidence */}
      <div className="space-y-1.5 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Evidence</p>
        {rec.evidence.map((e, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <Database size={11} className="text-muted-foreground mt-0.5 shrink-0" />
            <span>{e.text}</span>
            <span className="font-mono text-muted-foreground ml-auto shrink-0">{e.source}</span>
          </div>
        ))}
      </div>

      {/* Metadata row */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User size={11} /> {rec.suggestedOwner}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {formatDistanceToNow(new Date(rec.createdAt), { addSuffix: true })}
        </span>
        {rec.impactValue > 0 && (
          <span className="text-green-600 font-medium">{formatCurrency(rec.impactValue)} estimated impact</span>
        )}
      </div>

      {/* Confidence */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">AI Confidence</span>
          <span className="font-semibold">{rec.confidenceScore}%</span>
        </div>
        <Progress value={rec.confidenceScore} className="h-1.5" />
      </div>

      {/* Actions */}
      {rec.status === 'Pending' && (
        <div className="flex gap-2 pt-4 border-t">
          <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5 flex-1"
            onClick={() => onApprove(rec.id)}>
            <CheckCircle size={13} /> Approve
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 flex-1" onClick={() => onReject(rec.id)}>
            <X size={13} /> Reject
          </Button>
        </div>
      )}
      {rec.status === 'Approved' && (
        <div className="flex items-center gap-1.5 pt-4 border-t text-sm text-green-600 font-medium">
          <CheckCircle size={14} /> Approved — task created
        </div>
      )}
    </div>
  )
}
```

---

## Task 4: Recommendations Page

`apps/web/src/app/(dashboard)/recommendations/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { RecommendationCard } from '@/components/recommendations/recommendation-card'
import { mockRecommendations } from '@/lib/mock-data'
import type { Recommendation, Priority, RecommendationStatus } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>(mockRecommendations)
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('all')

  const filtered = recs.filter(r => statusFilter === 'all' || r.status === statusFilter)

  function handleApprove(id: string) {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r))
    toast.success('Recommendation approved — task created and owner notified')
  }

  function handleReject(id: string) {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r))
    toast.info('Recommendation rejected')
  }

  const counts = {
    all: recs.length,
    Pending: recs.filter(r => r.status === 'Pending').length,
    Approved: recs.filter(r => r.status === 'Approved').length,
    Rejected: recs.filter(r => r.status === 'Rejected').length,
  }

  const tabs: Array<{ value: RecommendationStatus | 'all'; label: string }> = [
    { value: 'all', label: `All (${counts.all})` },
    { value: 'Pending', label: `Pending (${counts.Pending})` },
    { value: 'Approved', label: `Approved (${counts.Approved})` },
    { value: 'Rejected', label: `Rejected (${counts.Rejected})` },
  ]

  return (
    <div className="space-y-6">
      {/* Tab filter */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setStatusFilter(t.value)}
            className={cn('px-4 py-1.5 text-sm rounded-md transition-colors', statusFilter === t.value ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No recommendations</p>
          <p className="text-sm">All caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add apps/web/src/app/\(dashboard\)/insights apps/web/src/app/\(dashboard\)/recommendations apps/web/src/components/insights apps/web/src/components/recommendations
git commit -m "feat: build Insights and Recommendations pages with approve/reject flow"
```
