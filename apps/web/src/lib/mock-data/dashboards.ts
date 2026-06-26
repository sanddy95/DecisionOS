export interface DashboardMeta {
  id: string
  name: string
  description: string
  category: string
  widgetCount: number
  updatedAt: string
  isDefault: boolean
}

export const mockDashboards: DashboardMeta[] = [
  { id: 'exec', name: 'Executive Command Center', description: 'Revenue, renewals, churn risk, collections, and pipeline at a glance', category: 'Executive', widgetCount: 8, updatedAt: new Date().toISOString(), isDefault: true },
  { id: 'sales', name: 'Sales Performance', description: 'Pipeline analysis, deal stage breakdown, rep performance, and forecast', category: 'Sales', widgetCount: 6, updatedAt: new Date(Date.now() - 3600000).toISOString(), isDefault: false },
  { id: 'customer', name: 'Customer Health', description: 'Risk scores, engagement metrics, renewal calendar, and churn signals', category: 'Customer Success', widgetCount: 7, updatedAt: new Date(Date.now() - 7200000).toISOString(), isDefault: false },
  { id: 'support', name: 'Support Operations', description: 'Ticket volume, resolution time, sentiment analysis, and escalations', category: 'Support', widgetCount: 5, updatedAt: new Date(Date.now() - 86400000).toISOString(), isDefault: false },
  { id: 'finance', name: 'Finance & Collections', description: 'MRR trends, overdue invoices, payment velocity, and aging buckets', category: 'Finance', widgetCount: 6, updatedAt: new Date(Date.now() - 172800000).toISOString(), isDefault: false },
]
