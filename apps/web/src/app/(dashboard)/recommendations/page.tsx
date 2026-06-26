'use client'
import { useState } from 'react'
import { RecommendationCard } from '@/components/recommendations/recommendation-card'
import { mockRecommendations } from '@/lib/mock-data'
import type { Recommendation, RecommendationStatus } from '@/lib/types'
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
