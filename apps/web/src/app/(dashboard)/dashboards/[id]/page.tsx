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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
