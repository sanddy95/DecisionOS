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
