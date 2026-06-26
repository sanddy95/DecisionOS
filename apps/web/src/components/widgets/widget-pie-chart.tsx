'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563EB', '#1B2A4A', '#059669', '#7C3AED', '#DC2626', '#F59E0B']

interface WidgetPieChartProps {
  title: string
  data: Array<{ name: string; value: number }>
}

export function WidgetPieChart({ title, data }: WidgetPieChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
