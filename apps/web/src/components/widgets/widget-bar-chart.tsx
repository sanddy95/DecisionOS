'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface WidgetBarChartProps {
  title: string
  data: Array<Record<string, unknown>>
  dataKeys: Array<{ key: string; color: string; label: string }>
  yFormatter?: (v: number) => string
}

export function WidgetBarChart({ title, data, dataKeys, yFormatter }: WidgetBarChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={Object.keys(data[0] ?? {})[0] ?? 'name'} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={yFormatter ?? (v => String(v))} />
            <Tooltip />
            <Legend />
            {dataKeys.map(dk => (
              <Bar key={dk.key} dataKey={dk.key} name={dk.label} fill={dk.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
