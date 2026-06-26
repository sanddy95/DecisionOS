# Phase 2: Mock Data Layer

**Goal:** Create realistic mock data matching all 5 PRD demo datasets + Zustand auth store so all pages can render without a backend.

---

## Files Created

- `apps/web/src/lib/mock-data/customers.ts`
- `apps/web/src/lib/mock-data/revenue.ts`
- `apps/web/src/lib/mock-data/tickets.ts`
- `apps/web/src/lib/mock-data/pipeline.ts`
- `apps/web/src/lib/mock-data/engagement.ts`
- `apps/web/src/lib/mock-data/kpis.ts`
- `apps/web/src/lib/mock-data/insights.ts`
- `apps/web/src/lib/mock-data/recommendations.ts`
- `apps/web/src/lib/mock-data/tasks.ts`
- `apps/web/src/lib/mock-data/users.ts`
- `apps/web/src/lib/mock-data/index.ts`
- `apps/web/src/lib/types.ts`
- `apps/web/src/store/auth.store.ts`
- `apps/web/src/store/ui.store.ts`
- `apps/web/src/store/notification.store.ts`
- `apps/web/src/hooks/use-mock-query.ts`

---

## Task 1: Define Shared Types

`apps/web/src/lib/types.ts`:
```typescript
export type CustomerSegment = 'Enterprise' | 'Mid-Market' | 'SMB'
export type CustomerStatus = 'Active' | 'At-Risk' | 'Churned' | 'New'
export type PaidStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Partially Paid'
export type TicketCategory = 'Bug' | 'Feature Request' | 'Billing' | 'General'
export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type TicketStatus = 'Open' | 'In-Progress' | 'Resolved' | 'Escalated'
export type Sentiment = 'Positive' | 'Neutral' | 'Negative'
export type DealStage = 'Prospecting' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost'
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type Urgency = 'Immediate' | 'This Week' | 'This Month' | 'Quarterly'
export type RecommendationStatus = 'Pending' | 'Approved' | 'Rejected' | 'In-Progress' | 'Completed'
export type TaskStatus = 'Open' | 'In-Progress' | 'Completed' | 'Overdue'
export type InsightType = 'anomaly' | 'trend' | 'risk' | 'opportunity'
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Customer {
  id: string
  name: string
  segment: CustomerSegment
  industry: string
  accountManager: string
  startDate: string
  renewalDate: string
  status: CustomerStatus
  riskScore: number
  mrr: number
}

export interface RevenueRecord {
  id: string
  customerId: string
  customerName: string
  invoiceDate: string
  amount: number
  paidStatus: PaidStatus
  dueDate: string
}

export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  ticketDate: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  resolutionDays: number | null
  sentiment: Sentiment
}

export interface SalesDeal {
  id: string
  companyName: string
  stage: DealStage
  value: number
  expectedCloseDate: string
  owner: string
  probability: number
}

export interface CustomerEngagement {
  customerId: string
  customerName: string
  lastMeetingDate: string
  lastEmailDate: string
  portalLoginCount: number
  eventAttendanceCount: number
}

export interface KPIData {
  id: string
  name: string
  slug: string
  value: number
  previousValue: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  changePercent: number
  status: 'good' | 'warning' | 'critical'
  history: Array<{ date: string; value: number }>
}

export interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
  severity: InsightSeverity
  affectedEntities: string[]
  evidenceSummary: string
  estimatedImpact: string
  createdAt: string
  status: 'active' | 'reviewed' | 'dismissed'
}

export interface Recommendation {
  id: string
  title: string
  description: string
  evidence: Array<{ text: string; source: string }>
  impactEstimate: string
  impactValue: number
  priority: Priority
  urgency: Urgency
  department: string
  suggestedOwner: string
  confidenceScore: number
  status: RecommendationStatus
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  owner: string
  ownerAvatar: string
  dueDate: string
  priority: Priority
  status: TaskStatus
  sourceRecommendation?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Executive' | 'Analyst' | 'Operations' | 'Viewer'
  department: string
  avatar: string
  isActive: boolean
  lastLogin: string
}

export interface Notification {
  id: string
  type: 'recommendation' | 'kpi_alert' | 'task_overdue' | 'approval_request' | 'anomaly' | 'ingestion'
  title: string
  body: string
  isRead: boolean
  actionUrl: string
  createdAt: string
}
```

---

## Task 2: Create Mock Datasets

- [ ] **Step 1: Customers mock data**

`apps/web/src/lib/mock-data/customers.ts`:
```typescript
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
```

- [ ] **Step 2: Revenue mock data**

`apps/web/src/lib/mock-data/revenue.ts`:
```typescript
import type { RevenueRecord } from '@/lib/types'

export const mockRevenue: RevenueRecord[] = [
  { id: 'r1', customerId: 'c1', customerName: 'Acme Corp', invoiceDate: '2026-06-01', amount: 12500, paidStatus: 'Paid', dueDate: '2026-06-15' },
  { id: 'r2', customerId: 'c2', customerName: 'GlobalTech', invoiceDate: '2026-06-01', amount: 18000, paidStatus: 'Paid', dueDate: '2026-06-15' },
  { id: 'r3', customerId: 'c3', customerName: 'StartupXYZ', invoiceDate: '2026-05-01', amount: 2200, paidStatus: 'Overdue', dueDate: '2026-05-15' },
  { id: 'r4', customerId: 'c4', customerName: 'MidCo Industries', invoiceDate: '2026-06-01', amount: 6800, paidStatus: 'Paid', dueDate: '2026-06-15' },
  { id: 'r5', customerId: 'c5', customerName: 'TechPeak Solutions', invoiceDate: '2026-06-01', amount: 4500, paidStatus: 'Unpaid', dueDate: '2026-07-01' },
  { id: 'r6', customerId: 'c6', customerName: 'Vertex Analytics', invoiceDate: '2026-06-01', amount: 22000, paidStatus: 'Paid', dueDate: '2026-06-15' },
  { id: 'r7', customerId: 'c7', customerName: 'CloudBase Inc', invoiceDate: '2026-04-01', amount: 1800, paidStatus: 'Overdue', dueDate: '2026-04-15' },
  { id: 'r8', customerId: 'c8', customerName: 'DataStream Co', invoiceDate: '2026-06-01', amount: 7200, paidStatus: 'Partially Paid', dueDate: '2026-06-15' },
  { id: 'r9', customerId: 'c9', customerName: 'NovaTech', invoiceDate: '2026-06-01', amount: 31000, paidStatus: 'Paid', dueDate: '2026-06-10' },
]

export const mockMonthlyRevenue = [
  { month: 'Jan', revenue: 82000, target: 90000 },
  { month: 'Feb', revenue: 88000, target: 90000 },
  { month: 'Mar', revenue: 95000, target: 95000 },
  { month: 'Apr', revenue: 91000, target: 95000 },
  { month: 'May', revenue: 87000, target: 100000 },
  { month: 'Jun', revenue: 106000, target: 100000 },
]
```

- [ ] **Step 3: Support tickets mock data**

`apps/web/src/lib/mock-data/tickets.ts`:
```typescript
import type { SupportTicket } from '@/lib/types'

export const mockTickets: SupportTicket[] = [
  { id: 't1', customerId: 'c1', customerName: 'Acme Corp', ticketDate: '2026-06-01', category: 'Bug', priority: 'Critical', status: 'Escalated', resolutionDays: null, sentiment: 'Negative' },
  { id: 't2', customerId: 'c3', customerName: 'StartupXYZ', ticketDate: '2026-05-20', category: 'Billing', priority: 'High', status: 'Open', resolutionDays: null, sentiment: 'Negative' },
  { id: 't3', customerId: 'c2', customerName: 'GlobalTech', ticketDate: '2026-06-10', category: 'Feature Request', priority: 'Medium', status: 'In-Progress', resolutionDays: null, sentiment: 'Neutral' },
  { id: 't4', customerId: 'c7', customerName: 'CloudBase Inc', ticketDate: '2026-06-05', category: 'Bug', priority: 'High', status: 'Open', resolutionDays: null, sentiment: 'Negative' },
  { id: 't5', customerId: 'c4', customerName: 'MidCo Industries', ticketDate: '2026-06-15', category: 'General', priority: 'Low', status: 'Resolved', resolutionDays: 2, sentiment: 'Positive' },
  { id: 't6', customerId: 'c8', customerName: 'DataStream Co', ticketDate: '2026-06-18', category: 'Bug', priority: 'Medium', status: 'In-Progress', resolutionDays: null, sentiment: 'Neutral' },
  { id: 't7', customerId: 'c1', customerName: 'Acme Corp', ticketDate: '2026-06-14', category: 'Feature Request', priority: 'High', status: 'Open', resolutionDays: null, sentiment: 'Neutral' },
]
```

- [ ] **Step 4: Sales pipeline mock data**

`apps/web/src/lib/mock-data/pipeline.ts`:
```typescript
import type { SalesDeal } from '@/lib/types'

export const mockPipeline: SalesDeal[] = [
  { id: 'd1', companyName: 'Quantum Systems', stage: 'Proposal', value: 45000, expectedCloseDate: '2026-07-30', owner: 'Alex Park', probability: 65 },
  { id: 'd2', companyName: 'Meridian Health', stage: 'Negotiation', value: 82000, expectedCloseDate: '2026-07-15', owner: 'Sarah Chen', probability: 80 },
  { id: 'd3', companyName: 'BlueRock Capital', stage: 'Discovery', value: 28000, expectedCloseDate: '2026-08-30', owner: 'Alex Park', probability: 40 },
  { id: 'd4', companyName: 'Synergy Corp', stage: 'Closed-Won', value: 55000, expectedCloseDate: '2026-06-20', owner: 'James Wilson', probability: 100 },
  { id: 'd5', companyName: 'TerraData', stage: 'Prospecting', value: 15000, expectedCloseDate: '2026-09-30', owner: 'Emily Ross', probability: 20 },
  { id: 'd6', companyName: 'Apex Ventures', stage: 'Proposal', value: 38000, expectedCloseDate: '2026-07-20', owner: 'Sarah Chen', probability: 55 },
  { id: 'd7', companyName: 'ClearPath AI', stage: 'Negotiation', value: 120000, expectedCloseDate: '2026-07-10', owner: 'James Wilson', probability: 75 },
  { id: 'd8', companyName: 'Nexus Labs', stage: 'Closed-Lost', value: 32000, expectedCloseDate: '2026-06-01', owner: 'Emily Ross', probability: 0 },
]
```

- [ ] **Step 5: KPIs mock data**

`apps/web/src/lib/mock-data/kpis.ts`:
```typescript
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
```

- [ ] **Step 6: Insights mock data**

`apps/web/src/lib/mock-data/insights.ts`:
```typescript
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
```

- [ ] **Step 7: Recommendations mock data**

`apps/web/src/lib/mock-data/recommendations.ts`:
```typescript
import type { Recommendation } from '@/lib/types'

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Assign account manager to contact Acme Corp immediately',
    description: 'Acme Corp shows a risk score of 78 with 2 open escalated tickets and renewal in 19 days. Immediate account manager outreach is required to prevent churn.',
    evidence: [
      { text: '2 escalated support tickets unresolved for 25+ days', source: 'support_tickets' },
      { text: 'Renewal date: July 15, 2026 (19 days away)', source: 'customers' },
      { text: 'MRR: $12,500 at risk', source: 'revenue' },
    ],
    impactEstimate: 'Prevent $12,500 MRR churn risk',
    impactValue: 12500,
    priority: 'Critical', urgency: 'Immediate',
    department: 'Customer Success',
    suggestedOwner: 'Sarah Chen',
    confidenceScore: 91,
    status: 'Pending',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'rec2',
    title: 'Initiate collections process for 2 overdue accounts',
    description: 'StartupXYZ and CloudBase Inc have invoices overdue by 45+ days totalling $4,000. Automated reminder escalation recommended.',
    evidence: [
      { text: 'StartupXYZ: $2,200 overdue 45 days', source: 'revenue' },
      { text: 'CloudBase Inc: $1,800 overdue 72 days', source: 'revenue' },
    ],
    impactEstimate: 'Recover $4,000 outstanding payments',
    impactValue: 4000,
    priority: 'High', urgency: 'This Week',
    department: 'Finance',
    suggestedOwner: 'Finance Team',
    confidenceScore: 96,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'rec3',
    title: 'Accelerate ClearPath AI deal — schedule executive sponsor call',
    description: 'ClearPath AI is in negotiation with 75% win probability at $120K. Engaging an executive sponsor at this stage increases close rates by an estimated 23%.',
    evidence: [
      { text: 'Stage: Negotiation, Value: $120K, Probability: 75%', source: 'sales_pipeline' },
      { text: 'Expected close: July 10 — 14 days away', source: 'sales_pipeline' },
    ],
    impactEstimate: '+$120,000 ARR if closed this month',
    impactValue: 120000,
    priority: 'High', urgency: 'This Week',
    department: 'Sales',
    suggestedOwner: 'James Wilson',
    confidenceScore: 84,
    status: 'Approved',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]
```

- [ ] **Step 8: Tasks mock data**

`apps/web/src/lib/mock-data/tasks.ts`:
```typescript
import type { Task } from '@/lib/types'

export const mockTasks: Task[] = [
  {
    id: 'task1', title: 'Contact Acme Corp — renewal risk intervention',
    description: 'Schedule call with Acme Corp CEO to discuss escalated support tickets and present renewal options.',
    owner: 'Sarah Chen', ownerAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=1B2A4A&color=fff',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'Critical', status: 'Open',
    sourceRecommendation: 'rec1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task2', title: 'Send collections notice to StartupXYZ',
    description: 'Issue formal collections notice for $2,200 overdue invoice. CC legal team.',
    owner: 'Finance Team', ownerAvatar: 'https://ui-avatars.com/api/?name=Finance+Team&background=2563EB&color=fff',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'High', status: 'In-Progress',
    sourceRecommendation: 'rec2',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'task3', title: 'Schedule executive sponsor call with ClearPath AI',
    description: 'Set up exec sponsor introduction with ClearPath AI CTO. Use deal room template.',
    owner: 'James Wilson', ownerAvatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=059669&color=fff',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    priority: 'High', status: 'Overdue',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'task4', title: 'Review support SLA policy for escalated tickets',
    description: 'Audit current escalation process. Propose updated SLA targets to reduce avg resolution from 3.2 to 2 days.',
    owner: 'Emily Ross', ownerAvatar: 'https://ui-avatars.com/api/?name=Emily+Ross&background=7C3AED&color=fff',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    priority: 'Medium', status: 'Open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]
```

- [ ] **Step 9: Users mock data**

`apps/web/src/lib/mock-data/users.ts`:
```typescript
import type { User } from '@/lib/types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@acmedemo.com', role: 'Executive', department: 'Executive', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=1B2A4A&color=fff', isActive: true, lastLogin: new Date(Date.now() - 3600000).toISOString() },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@acmedemo.com', role: 'Operations', department: 'Customer Success', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=2563EB&color=fff', isActive: true, lastLogin: new Date(Date.now() - 7200000).toISOString() },
  { id: 'u3', name: 'James Wilson', email: 'james@acmedemo.com', role: 'Analyst', department: 'Sales', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=059669&color=fff', isActive: true, lastLogin: new Date(Date.now() - 86400000).toISOString() },
  { id: 'u4', name: 'Emily Ross', email: 'emily@acmedemo.com', role: 'Operations', department: 'Support', avatar: 'https://ui-avatars.com/api/?name=Emily+Ross&background=7C3AED&color=fff', isActive: true, lastLogin: new Date(Date.now() - 172800000).toISOString() },
  { id: 'u5', name: 'Admin User', email: 'admin@acmedemo.com', role: 'Admin', department: 'IT', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=DC2626&color=fff', isActive: true, lastLogin: new Date(Date.now() - 43200000).toISOString() },
]

export const currentUser = mockUsers[0]!
```

- [ ] **Step 10: Create mock data index**

`apps/web/src/lib/mock-data/index.ts`:
```typescript
export * from './customers'
export * from './revenue'
export * from './tickets'
export * from './pipeline'
export * from './kpis'
export * from './insights'
export * from './recommendations'
export * from './tasks'
export * from './users'
```

---

## Task 3: Create Zustand Stores

- [ ] **Step 1: Auth store**

`apps/web/src/store/auth.store.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import { currentUser } from '@/lib/mock-data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800))
        if (email === 'alex@acmedemo.com' || email.includes('@')) {
          set({ user: currentUser, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'decisionos-auth' }
  )
)
```

- [ ] **Step 2: UI store**

`apps/web/src/store/ui.store.ts`:
```typescript
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
```

- [ ] **Step 3: Notification store**

`apps/web/src/store/notification.store.ts`:
```typescript
import { create } from 'zustand'
import type { Notification } from '@/lib/types'

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'recommendation', title: 'New critical recommendation', body: 'Acme Corp renewal risk requires immediate action', isRead: false, actionUrl: '/recommendations', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'n2', type: 'kpi_alert', title: 'KPI Alert: Churn Rate critical', body: 'Churn rate exceeded critical threshold at 4.2%', isRead: false, actionUrl: '/insights', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', type: 'task_overdue', title: 'Task overdue', body: 'Schedule executive sponsor call is 1 day overdue', isRead: true, actionUrl: '/workflows', createdAt: new Date(Date.now() - 86400000).toISOString() },
]

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.isRead).length,
  markRead: (id) => set((state) => {
    const updated = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    return { notifications: updated, unreadCount: updated.filter(n => !n.isRead).length }
  }),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),
}))
```

- [ ] **Step 4: Create mock query hook**

`apps/web/src/hooks/use-mock-query.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'

export function useMockQuery<T>(key: string[], data: T, delayMs = 400) {
  return useQuery({
    queryKey: key,
    queryFn: () => new Promise<T>(resolve => setTimeout(() => resolve(data), delayMs)),
    staleTime: Infinity,
  })
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib apps/web/src/store apps/web/src/hooks
git commit -m "feat: add mock data layer, types, and Zustand stores"
```
