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
