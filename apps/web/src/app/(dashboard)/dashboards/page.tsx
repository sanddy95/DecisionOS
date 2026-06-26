'use client'
import { mockDashboards } from '@/lib/mock-data/dashboards'
import { BarChart3, ChevronRight, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

const categoryColors: Record<string, string> = {
  Executive: 'bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300',
  Sales: 'bg-green-100 text-green-700',
  'Customer Success': 'bg-blue-100 text-blue-700',
  Support: 'bg-purple-100 text-purple-700',
  Finance: 'bg-amber-100 text-amber-700',
}

export default function DashboardsPage() {
  const [search, setSearch] = useState('')
  const filtered = mockDashboards.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input placeholder="Search dashboards..." value={search} onChange={e => setSearch(e.target.value)}
          className="max-w-xs" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <Link key={d.id} href={`/dashboards/${d.id}`}
            className="rounded-xl border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                <BarChart3 size={18} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                {d.isDefault && <Star size={14} className="text-amber-500 fill-amber-500" />}
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
            <div className="flex items-center justify-between">
              <Badge className={`text-xs border-0 ${categoryColors[d.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {d.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{d.widgetCount} widgets</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
