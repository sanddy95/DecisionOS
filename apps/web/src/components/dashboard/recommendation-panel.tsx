'use client'
import { useState } from 'react'
import { mockRecommendations } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Low: 'bg-gray-100 text-gray-600',
}

export function RecommendationPanel() {
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())
  const pending = mockRecommendations.filter(r => r.status === 'Pending').slice(0, 3)

  function handleApprove(id: string, title: string) {
    setApproved(prev => new Set([...prev, id]))
    toast.success(`Approved: ${title}`)
  }

  function handleReject(id: string, title: string) {
    setRejected(prev => new Set([...prev, id]))
    toast.error(`Rejected: ${title}`)
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
              ) : rejected.has(rec.id) ? (
                <span className="flex items-center gap-1 text-sm text-red-500 font-medium">
                  <XCircle size={14} /> Rejected
                </span>
              ) : (
                <>
                  <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                    onClick={() => handleApprove(rec.id, rec.title)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs px-3 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    onClick={() => handleReject(rec.id, rec.title)}>
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-muted-foreground ml-auto" asChild>
                    <Link href="/recommendations">
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
