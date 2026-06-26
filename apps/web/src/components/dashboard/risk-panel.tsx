import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { mockInsights } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  high: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  medium: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  low: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/30', badge: 'bg-gray-100 text-gray-600' },
}

export function RiskPanel() {
  const activeRisks = mockInsights.filter(i => i.status === 'active' && (i.severity === 'critical' || i.severity === 'high'))

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold text-sm">Active Risks</h3>
        <Link href="/insights" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      <div className="divide-y">
        {activeRisks.map(risk => {
          const config = severityConfig[risk.severity]
          const Icon = config.icon
          return (
            <div key={risk.id} className="px-5 py-4 flex gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{risk.title}</p>
                  <Badge className={cn('text-xs shrink-0 capitalize border-0', config.badge)}>
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{risk.estimatedImpact}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
