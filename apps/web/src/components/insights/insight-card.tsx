'use client'
import { AlertTriangle, TrendingUp, Zap, Target, X } from 'lucide-react'
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

const severityColors: Record<string, string> = {
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
