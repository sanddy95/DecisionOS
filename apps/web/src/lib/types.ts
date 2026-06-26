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
