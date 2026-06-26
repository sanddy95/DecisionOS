'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, formatCurrency } from '@/lib/utils'
import { CheckCircle, X, User, Clock, Database } from 'lucide-react'
import type { Recommendation } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Medium: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-600',
}

const statusColors: Record<string, string> = {
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
