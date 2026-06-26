import type { Insight } from '@/lib/types'

export const mockInsights: Insight[] = [
  {
    id: 'i1', type: 'risk', severity: 'critical',
    title: 'Renewal rate dropped 18% — 3 enterprise customers at high risk',
    description: 'Analysis detected a significant renewal rate decline driven by 3 enterprise accounts with unresolved support tickets older than 14 days and no account manager contact in the past 60 days.',
    affectedEntities: ['Acme Corp', 'CloudBase Inc', 'StartupXYZ'],
    evidenceSummary: '32 open tickets, 18 overdue invoices, 11 customers with no recent contact',
    estimatedImpact: '$47,000 ARR at risk',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'active',
  },
  {
    id: 'i2', type: 'anomaly', severity: 'high',
    title: 'Overdue invoice volume increased 122% month-over-month',
    description: 'Statistical anomaly detected: overdue invoices spiked from $1,800 to $4,000 — 2.4 standard deviations above the 6-month average.',
    affectedEntities: ['StartupXYZ', 'CloudBase Inc'],
    evidenceSummary: 'Z-score: 2.4σ. Last 6-month avg: $1,850. Current: $4,000.',
    estimatedImpact: '$4,000 immediate collections risk',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'active',
  },
  {
    id: 'i3', type: 'opportunity', severity: 'medium',
    title: 'ClearPath AI deal at $120K showing 75% close probability',
    description: 'The ClearPath AI deal in negotiation stage represents the highest-value pipeline opportunity with a strong probability signal. Closing this month would push Q3 target attainment to 112%.',
    affectedEntities: ['ClearPath AI'],
    evidenceSummary: 'Stage: Negotiation, Probability: 75%, Expected close: July 10',
    estimatedImpact: '+$120,000 ARR, Q3 target overachievement',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    status: 'active',
  },
  {
    id: 'i4', type: 'trend', severity: 'medium',
    title: 'Average support ticket resolution time increased 52% to 3.2 days',
    description: 'Support resolution time has increased consistently over 3 months, potentially impacting customer satisfaction scores and renewal likelihood for affected accounts.',
    affectedEntities: ['Support Operations'],
    evidenceSummary: 'Trend: 2.1 → 2.4 → 2.8 → 3.2 days over 4 months',
    estimatedImpact: 'NPS risk for 7 accounts with open tickets',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active',
  },
]
