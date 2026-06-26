'use client'
import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const summaries = [
  "Revenue performance is strong this month at $106K MRR (+21.8%), driven by the NovaTech and GlobalTech accounts. However, renewal rate has declined to 82% — 3 enterprise customers (Acme Corp, CloudBase Inc, StartupXYZ) require immediate account manager attention before their July renewal windows close. Overdue invoices have spiked 122% to $4,000, primarily from 2 SMB accounts. The ClearPath AI deal at $120K remains your highest-priority pipeline opportunity with a July 10 expected close. Recommended focus for today: contact Acme Corp, clear the overdue invoice backlog, and schedule the ClearPath executive sponsor meeting.",
  "Today's business intelligence summary indicates healthy top-line growth but three operational risks requiring action. Your MRR of $106K exceeds the June target by 6%. The primary concern is a deteriorating renewal cohort — risk score analysis identifies 3 customers totaling $16,500 MRR within 30-day renewal windows and scoring above 70 on the risk index. Support resolution time has increased to 3.2 days, a 52% increase over 4 months, which correlates with the elevated churn risk signals. Priority action: close-loop on Acme Corp escalated tickets before the July 15 renewal date.",
]

export function AISummaryCard() {
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshedAt] = useState(new Date())

  async function refresh() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setIndex(i => (i + 1) % summaries.length)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border bg-gradient-to-br from-navy-900 to-navy-800 text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Executive Summary</h3>
            <p className="text-white/50 text-xs">Updated {refreshedAt.toLocaleTimeString()}</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
          onClick={refresh} disabled={loading} aria-label="Refresh summary">
          <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
        </Button>
      </div>
      <p className={cn('text-sm leading-relaxed text-white/90 transition-opacity', loading && 'opacity-50')}>
        {summaries[index]}
      </p>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <span className="text-xs text-white/50">Sources cited:</span>
        {['revenue', 'customers', 'sales_pipeline', 'support_tickets'].map(src => (
          <span key={src} className="text-xs bg-white/10 rounded px-2 py-0.5 font-mono">{src}</span>
        ))}
      </div>
    </div>
  )
}
