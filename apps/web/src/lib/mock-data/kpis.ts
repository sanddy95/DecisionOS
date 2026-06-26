import type { KPIData } from '@/lib/types'

const last12Months = (base: number, variance = 0.1) =>
  Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2025, i + 6, 1).toISOString().split('T')[0] ?? '',
    value: Math.round(base * (1 + (Math.random() - 0.5) * variance)),
  }))

export const mockKPIs: KPIData[] = [
  {
    id: 'kpi1', name: 'Monthly Recurring Revenue', slug: 'mrr',
    value: 106000, previousValue: 87000, unit: '$', trend: 'up',
    changePercent: 21.8, status: 'good',
    history: last12Months(95000, 0.15),
  },
  {
    id: 'kpi2', name: 'Renewal Rate', slug: 'renewal-rate',
    value: 82, previousValue: 91, unit: '%', trend: 'down',
    changePercent: -9.9, status: 'warning',
    history: last12Months(87, 0.08),
  },
  {
    id: 'kpi3', name: 'Churn Rate', slug: 'churn-rate',
    value: 4.2, previousValue: 2.8, unit: '%', trend: 'up',
    changePercent: 50, status: 'critical',
    history: last12Months(3.1, 0.2),
  },
  {
    id: 'kpi4', name: 'Overdue Invoices', slug: 'overdue-invoices',
    value: 4000, previousValue: 1800, unit: '$', trend: 'up',
    changePercent: 122, status: 'critical',
    history: last12Months(2500, 0.3),
  },
  {
    id: 'kpi5', name: 'Pipeline Value', slug: 'pipeline-value',
    value: 328000, previousValue: 285000, unit: '$', trend: 'up',
    changePercent: 15.1, status: 'good',
    history: last12Months(300000, 0.12),
  },
  {
    id: 'kpi6', name: 'Avg Resolution Time', slug: 'avg-resolution-time',
    value: 3.2, previousValue: 2.1, unit: 'days', trend: 'up',
    changePercent: 52.4, status: 'warning',
    history: last12Months(2.5, 0.25),
  },
]
