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
