'use client'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import type { KPIData } from '@/lib/types'

const statusConfig = {
  good: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', icon: CheckCircle, iconColor: 'text-green-600' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', icon: AlertTriangle, iconColor: 'text-amber-600' },
  critical: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', icon: XCircle, iconColor: 'text-red-600' },
}

interface KPICardProps { kpi: KPIData; onClick?: () => void }

export function KPICard({ kpi, onClick }: KPICardProps) {
  const config = statusConfig[kpi.status]
  const StatusIcon = config.icon

  const formattedValue = kpi.unit === '$'
    ? formatCurrency(kpi.value)
    : kpi.unit === '%'
    ? formatPercent(kpi.value)
    : `${kpi.value} ${kpi.unit}`

  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
  const trendColor = kpi.trend === 'up'
    ? (kpi.status === 'critical' ? 'text-red-600' : 'text-green-600')
    : kpi.trend === 'down'
    ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600')
    : 'text-muted-foreground'

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-5 transition-all',
        config.bg, config.border,
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
        <StatusIcon size={16} className={config.iconColor} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight">{formattedValue}</p>
          <div className={cn('flex items-center gap-1 mt-1 text-sm font-medium', trendColor)}>
            <TrendIcon size={14} />
            <span>{formatPercent(Math.abs(kpi.changePercent))} vs last period</span>
          </div>
        </div>

        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.history.slice(-8)}>
              <Line
                type="monotone" dataKey="value" dot={false} strokeWidth={2}
                stroke={kpi.status === 'critical' ? '#ef4444' : kpi.status === 'warning' ? '#f59e0b' : '#22c55e'}
              />
              <Tooltip
                content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="bg-popover border rounded px-2 py-1 text-xs">
                    {kpi.unit === '$' ? formatCurrency(payload[0].value as number) : `${payload[0].value} ${kpi.unit}`}
                  </div>
                ) : null}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
