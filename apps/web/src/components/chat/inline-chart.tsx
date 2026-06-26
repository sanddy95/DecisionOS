'use client'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface InlineChartProps {
  type: 'line' | 'bar' | 'pie'
  title: string
  data: unknown[]
}

export function InlineChart({ type, title, data }: InlineChartProps) {
  const chartData = data as Array<Record<string, unknown>>

  return (
    <div className="bg-muted/50 rounded-lg p-4 my-3">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{title}</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey={Object.keys(chartData[0] ?? {})[0] ?? 'x'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => typeof v === 'number' && v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip formatter={(v) => typeof v === 'number' && v >= 1000 ? formatCurrency(v) : v} />
              <Bar dataKey={Object.keys(chartData[0] ?? {})[1] ?? 'value'} fill="#2563EB" radius={[4, 4, 0, 0]} />
              {Object.keys(chartData[0] ?? {}).length > 2 && (
                <Bar dataKey={Object.keys(chartData[0] ?? {})[2] ?? 'target'} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey={Object.keys(chartData[0] ?? {})[0] ?? 'x'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey={Object.keys(chartData[0] ?? {})[1] ?? 'value'} stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
