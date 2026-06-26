'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface WidgetLineChartProps {
  title: string
  data: Array<Record<string, unknown>>
  dataKeys: Array<{ key: string; color: string; label: string }>
  yFormatter?: (v: number) => string
}

export function WidgetLineChart({ title, data, dataKeys, yFormatter }: WidgetLineChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={Object.keys(data[0] ?? {})[0] ?? 'name'} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={yFormatter ?? (v => String(v))} />
            <Tooltip formatter={(v) => yFormatter ? yFormatter(v as number) : v} />
            <Legend />
            {dataKeys.map(dk => (
              <Line key={dk.key} type="monotone" dataKey={dk.key} name={dk.label} stroke={dk.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
