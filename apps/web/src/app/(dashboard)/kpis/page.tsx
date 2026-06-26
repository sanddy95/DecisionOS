'use client'
import { useState } from 'react'
import { mockKPIs } from '@/lib/mock-data'
import type { KPIData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, TrendingDown, Minus, Plus, Edit2, Bell } from 'lucide-react'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'
import { toast } from 'sonner'

const statusColors = {
  good: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
}

export default function KPIsPage() {
  const [kpis] = useState<KPIData[]>(mockKPIs)
  const [newKpiOpen, setNewKpiOpen] = useState(false)

  function formatValue(kpi: KPIData): string {
    if (kpi.unit === '$') return formatCurrency(kpi.value)
    if (kpi.unit === '%') return formatPercent(kpi.value)
    return `${kpi.value} ${kpi.unit}`
  }

  const TrendIcon = (trend: KPIData['trend']) =>
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{kpis.length} configured KPIs</p>
        <Dialog open={newKpiOpen} onOpenChange={setNewKpiOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={14} /> Add KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create New KPI</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5"><Label>KPI Name</Label><Input placeholder="e.g. Customer Satisfaction Score" /></div>
              <div className="space-y-1.5"><Label>Formula</Label><Input placeholder="e.g. AVG(satisfaction_score)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Source Table</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="customers">customers</SelectItem><SelectItem value="revenue">revenue</SelectItem><SelectItem value="support_tickets">support_tickets</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Unit</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent><SelectItem value="%">%</SelectItem><SelectItem value="$">$</SelectItem><SelectItem value="days">days</SelectItem><SelectItem value="count">count</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Warning Threshold</Label><Input type="number" placeholder="e.g. 80" /></div>
                <div className="space-y-1.5"><Label>Critical Threshold</Label><Input type="number" placeholder="e.g. 60" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Refresh Interval</Label>
                <Select defaultValue="60">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="15">Every 15 min</SelectItem><SelectItem value="60">Every hour</SelectItem><SelectItem value="240">Every 4 hours</SelectItem><SelectItem value="1440">Daily</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNewKpiOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setNewKpiOpen(false); toast.success('KPI created') }}>Create KPI</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(kpi => {
          const Icon = TrendIcon(kpi.trend)
          const trendColor = kpi.trend === 'up' ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600') : kpi.trend === 'down' ? (kpi.status === 'good' ? 'text-green-600' : 'text-red-600') : 'text-muted-foreground'

          return (
            <div key={kpi.id} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-mono">{kpi.slug}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Bell size={13} /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 size={13} /></Button>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1">{kpi.name}</h3>

              <div className="flex items-end justify-between mb-3">
                <p className="text-2xl font-bold">{formatValue(kpi)}</p>
                <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
                  <Icon size={14} />
                  <span>{formatPercent(Math.abs(kpi.changePercent))}</span>
                </div>
              </div>

              <Badge className={cn('text-xs border-0 mb-3', statusColors[kpi.status])}>{kpi.status}</Badge>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Warning threshold</span>
                  <span>{kpi.unit === '$' ? formatCurrency(kpi.previousValue * 0.9) : `${Math.round(kpi.previousValue * 0.9)}${kpi.unit}`}</span>
                </div>
                <Progress value={Math.min(100, (kpi.value / (kpi.previousValue * 1.1)) * 100)} className="h-1.5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
