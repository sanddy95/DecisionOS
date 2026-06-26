# Phase 10: KPI Config Page + Final Polish

**Goal:** Build the KPI configuration page, then apply global polish — empty states, loading skeletons, responsive tweaks, and route stubs for missing pages.

---

## Files Created

- `apps/web/src/app/(dashboard)/kpis/page.tsx`
- `apps/web/src/components/ui/page-skeleton.tsx`
- `apps/web/src/app/not-found.tsx`
- `apps/web/src/app/(dashboard)/loading.tsx`

---

## Task 1: KPI Configuration Page

`apps/web/src/app/(dashboard)/kpis/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { mockKPIs } from '@/lib/mock-data'
import type { KPIData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, TrendingDown, Minus, Plus, Edit2, Bell } from 'lucide-react'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'
import { toast } from 'sonner'

const statusColors = {
  good: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
}

export default function KPIsPage() {
  const [kpis] = useState<KPIData[]>(mockKPIs)
  const [newKpiOpen, setNewKpiOpen] = useState(false)

  function formatValue(kpi: KPIData): string {
    if (kpi.unit === '$') return formatCurrency(kpi.value)
    if (kpi.unit === '%') return formatPercent(kpi.value)
    return `${kpi.value} ${kpi.unit}`
  }

  const TrendIcon = (trend: KPIData['trend']) =>
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{kpis.length} configured KPIs</p>
        <Dialog open={newKpiOpen} onOpenChange={setNewKpiOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={14} /> Add KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create New KPI</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5"><Label>KPI Name</Label><Input placeholder="e.g. Customer Satisfaction Score" /></div>
              <div className="space-y-1.5"><Label>Formula</Label><Input placeholder="e.g. AVG(satisfaction_score)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Source Table</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="customers">customers</SelectItem><SelectItem value="revenue">revenue</SelectItem><SelectItem value="support_tickets">support_tickets</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Unit</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="%">%</SelectItem><SelectItem value="$">$</SelectItem><SelectItem value="days">days</SelectItem><SelectItem value="count">count</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Warning Threshold</Label><Input type="number" placeholder="e.g. 80" /></div>
                <div className="space-y-1.5"><Label>Critical Threshold</Label><Input type="number" placeholder="e.g. 60" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Refresh Interval</Label>
                <Select defaultValue="60">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="15">Every 15 min</SelectItem><SelectItem value="60">Every hour</SelectItem><SelectItem value="240">Every 4 hours</SelectItem><SelectItem value="1440">Daily</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNewKpiOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setNewKpiOpen(false); toast.success('KPI created') }}>Create KPI</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(kpi => {
          const Icon = TrendIcon(kpi.trend)
          const trendColor = kpi.trend === 'up' ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600') : kpi.trend === 'down' ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600') : 'text-muted-foreground'

          return (
            <div key={kpi.id} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-mono">{kpi.slug}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Bell size={13} /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 size={13} /></Button>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1">{kpi.name}</h3>

              <div className="flex items-end justify-between mb-3">
                <p className="text-2xl font-bold">{formatValue(kpi)}</p>
                <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
                  <Icon size={14} />
                  <span>{formatPercent(Math.abs(kpi.changePercent))}</span>
                </div>
              </div>

              <Badge className={cn('text-xs border-0 mb-3', statusColors[kpi.status])}>{kpi.status}</Badge>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Warning threshold</span>
                  <span>{kpi.unit === '$' ? formatCurrency(kpi.previousValue * 0.9) : `${Math.round(kpi.previousValue * 0.9)}${kpi.unit}`}</span>
                </div>
                <Progress value={Math.min(100, (kpi.value / (kpi.previousValue * 1.1)) * 100)} className="h-1.5" />
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

## Task 2: Global Loading State

`apps/web/src/app/(dashboard)/loading.tsx`:
```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
```

---

## Task 3: 404 Page

`apps/web/src/app/not-found.tsx`:
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-6xl font-bold text-muted-foreground/30 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/">Back to Command Center</Link>
        </Button>
      </div>
    </div>
  )
}
```

---

## Task 4: Fix Missing Textarea Dependency

```bash
cd apps/web
pnpm dlx shadcn@latest add textarea
```

---

## Task 5: Verify All Routes Work

```bash
cd apps/web && pnpm dev
```

Visit each route and verify it renders without errors:
- `http://localhost:3000/login` → Login page
- `http://localhost:3000/` → Command Center (after login)
- `http://localhost:3000/ask` → Chat interface
- `http://localhost:3000/dashboards` → Dashboard list
- `http://localhost:3000/dashboards/exec` → Executive dashboard
- `http://localhost:3000/insights` → Insights page
- `http://localhost:3000/recommendations` → Recommendations page
- `http://localhost:3000/data-sources` → Data sources page
- `http://localhost:3000/kpis` → KPI configuration
- `http://localhost:3000/workflows` → Workflows page
- `http://localhost:3000/admin` → Admin console

Expected: All routes render with mock data, no console errors.

---

## Task 6: TypeScript Check

```bash
cd apps/web && pnpm type-check
```

Expected: Exit code 0, no TypeScript errors.

---

## Task 7: Final Commit

```bash
git add apps/web/src/app/\(dashboard\)/kpis apps/web/src/app/not-found.tsx apps/web/src/app/\(dashboard\)/loading.tsx
git commit -m "feat: add KPI config page, 404, loading states — frontend prototype complete"
```

---

## Verification Checklist

After all 10 phases are complete, verify the following with Chrome MCP (gstack):

- [ ] Login page renders with DecisionOS branding, navy gradient background
- [ ] Demo credentials hint visible on login page
- [ ] Login with `alex@acmedemo.com` redirects to Command Center
- [ ] Command Center shows 5 KPI cards with correct colors (green/amber/red based on status)
- [ ] AI Executive Summary card renders with dark navy background
- [ ] Risk panel shows critical/high severity items
- [ ] Recommendation panel shows Approve/View buttons
- [ ] Sidebar collapses and expands correctly
- [ ] ⌘K opens command palette
- [ ] Notification bell shows unread count badge
- [ ] Ask AI shows empty state with example questions
- [ ] Chat responds with chart, table, and citations after question
- [ ] Follow-up chips appear after AI response
- [ ] Dashboard list shows 5 dashboards with category badges
- [ ] Individual dashboard shows charts and KPI cards
- [ ] Insights page shows severity filter tabs
- [ ] Approve on recommendation changes status to Approved with toast
- [ ] Upload wizard shows drag-and-drop zone, progresses through steps
- [ ] Workflows page shows task list with overdue highlight
- [ ] Admin console shows Users tab with role badges and toggle switches
- [ ] Dark mode toggle works via user menu
- [ ] All pages are responsive at 1280px, 1024px, 768px widths
