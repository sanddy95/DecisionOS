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
