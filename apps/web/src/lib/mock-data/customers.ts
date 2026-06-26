import type { Customer } from '@/lib/types'

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Acme Corp', segment: 'Enterprise', industry: 'Technology', accountManager: 'Sarah Chen', startDate: '2022-01-15', renewalDate: '2026-07-15', status: 'At-Risk', riskScore: 78, mrr: 12500 },
  { id: 'c2', name: 'GlobalTech', segment: 'Enterprise', industry: 'Finance', accountManager: 'James Wilson', startDate: '2021-06-01', renewalDate: '2026-08-01', status: 'Active', riskScore: 22, mrr: 18000 },
  { id: 'c3', name: 'StartupXYZ', segment: 'SMB', industry: 'E-commerce', accountManager: 'Emily Ross', startDate: '2023-03-10', renewalDate: '2026-07-10', status: 'At-Risk', riskScore: 85, mrr: 2200 },
  { id: 'c4', name: 'MidCo Industries', segment: 'Mid-Market', industry: 'Manufacturing', accountManager: 'Sarah Chen', startDate: '2022-09-01', renewalDate: '2026-09-01', status: 'Active', riskScore: 35, mrr: 6800 },
  { id: 'c5', name: 'TechPeak Solutions', segment: 'Mid-Market', industry: 'Healthcare', accountManager: 'James Wilson', startDate: '2023-01-20', renewalDate: '2026-09-20', status: 'New', riskScore: 15, mrr: 4500 },
  { id: 'c6', name: 'Vertex Analytics', segment: 'Enterprise', industry: 'Analytics', accountManager: 'Emily Ross', startDate: '2020-11-05', renewalDate: '2026-11-05', status: 'Active', riskScore: 18, mrr: 22000 },
  { id: 'c7', name: 'CloudBase Inc', segment: 'SMB', industry: 'SaaS', accountManager: 'Sarah Chen', startDate: '2023-07-01', renewalDate: '2026-07-01', status: 'At-Risk', riskScore: 72, mrr: 1800 },
  { id: 'c8', name: 'DataStream Co', segment: 'Mid-Market', industry: 'Media', accountManager: 'James Wilson', startDate: '2022-04-15', renewalDate: '2026-10-15', status: 'Active', riskScore: 28, mrr: 7200 },
  { id: 'c9', name: 'NovaTech', segment: 'Enterprise', industry: 'Telecom', accountManager: 'Emily Ross', startDate: '2021-08-20', renewalDate: '2026-12-20', status: 'Active', riskScore: 12, mrr: 31000 },
  { id: 'c10', name: 'PivotPoint', segment: 'SMB', industry: 'Retail', accountManager: 'Sarah Chen', startDate: '2024-01-05', renewalDate: '2026-07-05', status: 'Churned', riskScore: 95, mrr: 0 },
]
