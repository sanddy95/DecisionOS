# Phase 7: Dashboards Page

**Goal:** Build the dashboard list page and an individual dashboard with KPI cards, chart widgets, data tables, global date filter, and AI summary.

---

## Files Created

- `apps/web/src/app/(dashboard)/dashboards/page.tsx`
- `apps/web/src/app/(dashboard)/dashboards/[id]/page.tsx`
- `apps/web/src/components/widgets/widget-kpi.tsx`
- `apps/web/src/components/widgets/widget-line-chart.tsx`
- `apps/web/src/components/widgets/widget-bar-chart.tsx`
- `apps/web/src/components/widgets/widget-pie-chart.tsx`
- `apps/web/src/components/widgets/widget-table.tsx`
- `apps/web/src/components/dashboard/date-range-picker.tsx`
- `apps/web/src/lib/mock-data/dashboards.ts`

---

## Task 1: Dashboard Mock Data

`apps/web/src/lib/mock-data/dashboards.ts`:
```typescript
export interface DashboardMeta {
  id: string
  name: string
  description: string
  category: string
  widgetCount: number
  updatedAt: string
  isDefault: boolean
}

export const mockDashboards: DashboardMeta[] = [
  { id: 'exec', name: 'Executive Command Center', description: 'Revenue, renewals, churn risk, collections, and pipeline at a glance', category: 'Executive', widgetCount: 8, updatedAt: new Date().toISOString(), isDefault: true },
  { id: 'sales', name: 'Sales Performance', description: 'Pipeline analysis, deal stage breakdown, rep performance, and forecast', category: 'Sales', widgetCount: 6, updatedAt: new Date(Date.now() - 3600000).toISOString(), isDefault: false },
  { id: 'customer', name: 'Customer Health', description: 'Risk scores, engagement metrics, renewal calendar, and churn signals', category: 'Customer Success', widgetCount: 7, updatedAt: new Date(Date.now() - 7200000).toISOString(), isDefault: false },
  { id: 'support', name: 'Support Operations', description: 'Ticket volume, resolution time, sentiment analysis, and escalations', category: 'Support', widgetCount: 5, updatedAt: new Date(Date.now() - 86400000).toISOString(), isDefault: false },
  { id: 'finance', name: 'Finance & Collections', description: 'MRR trends, overdue invoices, payment velocity, and aging buckets', category: 'Finance', widgetCount: 6, updatedAt: new Date(Date.now() - 172800000).toISOString(), isDefault: false },
]
```

---

## Task 2: Date Range Picker

`apps/web/src/components/dashboard/date-range-picker.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const ranges = [
  { label: 'Today', value: '1d' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'This year', value: '1y' },
]

interface DateRangePickerProps {
  value: string
  onChange: (value: string) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Calendar size={14} className="text-muted-foreground ml-1" />
      {ranges.map(r => (
        <button key={r.value} onClick={() => onChange(r.value)}
          className={cn(
            'px-3 py-1 text-sm rounded-md transition-colors',
            value === r.value ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
          )}>
          {r.label}
        </button>
      ))}
    </div>
  )
}
```

---

## Task 3: Chart Widgets

`apps/web/src/components/widgets/widget-line-chart.tsx`:
```tsx
'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface WidgetLineChartProps {
  title: string
  data: Array<Record<string, unknown>>
  dataKeys: Array<{ key: string; color: string; label: string }>
  yFormatter?: (v: number) => string
}

export function WidgetLineChart({ title, data, dataKeys, yFormatter }: WidgetLineChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={Object.keys(data[0] ?? {})[0]} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={yFormatter ?? (v => String(v))} />
            <Tooltip formatter={(v) => yFormatter ? yFormatter(v as number) : v} />
            <Legend />
            {dataKeys.map(dk => (
              <Line key={dk.key} type="monotone" dataKey={dk.key} name={dk.label} stroke={dk.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

`apps/web/src/components/widgets/widget-bar-chart.tsx`:
```tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface WidgetBarChartProps {
  title: string
  data: Array<Record<string, unknown>>
  dataKeys: Array<{ key: string; color: string; label: string }>
  yFormatter?: (v: number) => string
}

export function WidgetBarChart({ title, data, dataKeys, yFormatter }: WidgetBarChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={Object.keys(data[0] ?? {})[0]} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={yFormatter ?? (v => String(v))} />
            <Tooltip />
            <Legend />
            {dataKeys.map(dk => (
              <Bar key={dk.key} dataKey={dk.key} name={dk.label} fill={dk.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

`apps/web/src/components/widgets/widget-pie-chart.tsx`:
```tsx
'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563EB', '#1B2A4A', '#059669', '#7C3AED', '#DC2626', '#F59E0B']

interface WidgetPieChartProps {
  title: string
  data: Array<{ name: string; value: number }>
}

export function WidgetPieChart({ title, data }: WidgetPieChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

`apps/web/src/components/widgets/widget-table.tsx`:
```tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WidgetTableProps {
  title: string
  columns: string[]
  rows: Array<Array<string | { value: string; badge?: string; color?: string }>>
}

export function WidgetTable({ title, columns, rows }: WidgetTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {columns.map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                {row.map((cell, j) => {
                  if (typeof cell === 'object') {
                    return (
                      <td key={j} className="px-4 py-2.5">
                        {cell.badge ? (
                          <Badge className={cn('text-xs border-0', cell.color)}>{cell.value}</Badge>
                        ) : (
                          <span className={cell.color}>{cell.value}</span>
                        )}
                      </td>
                    )
                  }
                  return <td key={j} className="px-4 py-2.5 text-sm">{cell}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## Task 4: Dashboard List Page

`apps/web/src/app/(dashboard)/dashboards/page.tsx`:
```tsx
'use client'
import { mockDashboards } from '@/lib/mock-data/dashboards'
import { BarChart3, ChevronRight, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

const categoryColors: Record<string, string> = {
  Executive: 'bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300',
  Sales: 'bg-green-100 text-green-700',
  'Customer Success': 'bg-blue-100 text-blue-700',
  Support: 'bg-purple-100 text-purple-700',
  Finance: 'bg-amber-100 text-amber-700',
}

export default function DashboardsPage() {
  const [search, setSearch] = useState('')
  const filtered = mockDashboards.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input placeholder="Search dashboards..." value={search} onChange={e => setSearch(e.target.value)}
          className="max-w-xs" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <Link key={d.id} href={`/dashboards/${d.id}`}
            className="rounded-xl border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                <BarChart3 size={18} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                {d.isDefault && <Star size={14} className="text-amber-500 fill-amber-500" />}
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
            <div className="flex items-center justify-between">
              <Badge className={`text-xs border-0 ${categoryColors[d.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {d.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{d.widgetCount} widgets</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 5: Individual Dashboard Page

`apps/web/src/app/(dashboard)/dashboards/[id]/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { DateRangePicker } from '@/components/dashboard/date-range-picker'
import { WidgetBarChart } from '@/components/widgets/widget-bar-chart'
import { WidgetLineChart } from '@/components/widgets/widget-line-chart'
import { WidgetPieChart } from '@/components/widgets/widget-pie-chart'
import { WidgetTable } from '@/components/widgets/widget-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { AISummaryCard } from '@/components/dashboard/ai-summary-card'
import { mockKPIs, mockMonthlyRevenue, mockCustomers } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { mockDashboards } from '@/lib/mock-data/dashboards'

const pipelineByStage = [
  { stage: 'Prospecting', value: 15000 },
  { stage: 'Discovery', value: 28000 },
  { stage: 'Proposal', value: 83000 },
  { stage: 'Negotiation', value: 202000 },
]

const ticketsByCategory = [
  { name: 'Bug', value: 4 },
  { name: 'Feature', value: 2 },
  { name: 'Billing', value: 1 },
  { name: 'General', value: 3 },
]

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [dateRange, setDateRange] = useState('30d')
  const dashboard = mockDashboards.find(d => d.id === params.id)
  if (!dashboard) notFound()

  const topKPIs = mockKPIs.slice(0, 4)
  const atRiskCustomers = mockCustomers
    .filter(c => c.riskScore > 60)
    .map(c => ([
      c.name,
      { value: c.segment, badge: true, color: 'bg-blue-100 text-blue-700' },
      { value: `${c.riskScore}`, color: c.riskScore > 80 ? 'text-red-600 font-semibold' : 'text-amber-600 font-semibold' },
      formatCurrency(c.mrr),
      c.renewalDate,
    ] as const))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{dashboard.name}</h2>
          <p className="text-sm text-muted-foreground">{dashboard.description}</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topKPIs.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* AI Summary */}
      <AISummaryCard />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetLineChart
          title="Revenue vs Target (Last 6 Months)"
          data={mockMonthlyRevenue}
          dataKeys={[
            { key: 'revenue', color: '#2563EB', label: 'Revenue' },
            { key: 'target', color: '#94a3b8', label: 'Target' },
          ]}
          yFormatter={v => `$${(v / 1000).toFixed(0)}k`}
        />
        <WidgetBarChart
          title="Pipeline Value by Stage"
          data={pipelineByStage}
          dataKeys={[{ key: 'value', color: '#1B2A4A', label: 'Value ($)' }]}
          yFormatter={v => `$${(v / 1000).toFixed(0)}k`}
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WidgetPieChart title="Support Tickets by Category" data={ticketsByCategory} />
        <div className="lg:col-span-2">
          <WidgetTable
            title="At-Risk Customers"
            columns={['Customer', 'Segment', 'Risk Score', 'MRR', 'Renewal Date']}
            rows={atRiskCustomers as unknown as Array<Array<string | { value: string; badge?: string; color?: string }>>}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add apps/web/src/app/\(dashboard\)/dashboards apps/web/src/components/widgets apps/web/src/components/dashboard/date-range-picker.tsx apps/web/src/lib/mock-data/dashboards.ts
git commit -m "feat: build Dashboards page — list view, individual dashboard with chart widgets"
```
