export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'Trial' | 'Starter' | 'Professional' | 'Enterprise'
  status: 'Active' | 'Trial' | 'Suspended' | 'Churned'
  users: number
  dataSources: number
  aiQueriesMonth: number
  storageGB: number
  llmProvider: string
  mrr: number
  createdAt: string
  adminEmail: string
  domain: string
}

export const mockTenants: Tenant[] = [
  { id: 't1', name: 'Acme Corp', slug: 'acme', plan: 'Enterprise', status: 'Active', users: 24, dataSources: 5, aiQueriesMonth: 1840, storageGB: 12.4, llmProvider: 'Claude', mrr: 1200, createdAt: '2026-01-15', adminEmail: 'alex@acmedemo.com', domain: 'acme.decisionos.app' },
  { id: 't2', name: 'GlobalTech Inc', slug: 'globaltech', plan: 'Professional', status: 'Active', users: 12, dataSources: 3, aiQueriesMonth: 920, storageGB: 5.2, llmProvider: 'GPT-4o', mrr: 600, createdAt: '2026-02-20', adminEmail: 'admin@globaltech.com', domain: 'globaltech.decisionos.app' },
  { id: 't3', name: 'NovaTech Solutions', slug: 'novatech', plan: 'Professional', status: 'Active', users: 8, dataSources: 4, aiQueriesMonth: 540, storageGB: 3.1, llmProvider: 'Claude', mrr: 600, createdAt: '2026-03-10', adminEmail: 'info@novatech.com', domain: 'novatech.decisionos.app' },
  { id: 't4', name: 'StartupXYZ', slug: 'startupxyz', plan: 'Starter', status: 'Trial', users: 3, dataSources: 1, aiQueriesMonth: 120, storageGB: 0.4, llmProvider: 'GPT-4o-mini', mrr: 0, createdAt: '2026-06-01', adminEmail: 'founder@startupxyz.io', domain: 'startupxyz.decisionos.app' },
  { id: 't5', name: 'CloudBase Inc', slug: 'cloudbase', plan: 'Starter', status: 'Active', users: 5, dataSources: 2, aiQueriesMonth: 310, storageGB: 1.8, llmProvider: 'Gemini', mrr: 199, createdAt: '2026-04-05', adminEmail: 'ops@cloudbase.io', domain: 'cloudbase.decisionos.app' },
  { id: 't6', name: 'RetailCo', slug: 'retailco', plan: 'Enterprise', status: 'Suspended', users: 18, dataSources: 6, aiQueriesMonth: 0, storageGB: 8.9, llmProvider: 'Claude', mrr: 1200, createdAt: '2025-11-12', adminEmail: 'it@retailco.com', domain: 'retailco.decisionos.app' },
]

export const platformStats = {
  totalTenants: 6,
  activeTenants: 4,
  totalUsers: 70,
  totalMRR: 3799,
  totalAiQueries: 3730,
  totalStorageGB: 31.8,
  avgQueriesPerTenant: 622,
}
