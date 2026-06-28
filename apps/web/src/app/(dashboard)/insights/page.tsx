'use client'
import { useState } from 'react'
import { InsightCard } from '@/components/insights/insight-card'
import { mockInsights } from '@/lib/mock-data'
import type { Insight, InsightType, InsightSeverity } from '@/lib/types'
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['critical', 'high', 'medium', 'low'] as InsightSeverity[]).map(s => {
          const count = insights.filter(i => i.status === 'active' && i.severity === s).length
          const colors: Record<InsightSeverity, string> = {
            critical: 'bg-red-50 border-red-200 text-red-700',
            high: 'bg-amber-50 border-amber-200 text-amber-700',
            medium: 'bg-blue-50 border-blue-200 text-blue-700',
            low: 'bg-gray-50 border-gray-200 text-gray-600',
          }
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
      <div className="space-y-2">
        <div className="flex gap-1 bg-muted rounded-lg p-1 overflow-x-auto">
          {typeFilters.map(f => (
            <button key={f.value} onClick={() => setType(f.value as InsightType | 'all')}
              className={cn('px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap shrink-0', type === f.value ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}>
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} active insight{filtered.length !== 1 ? 's' : ''}</p>
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
