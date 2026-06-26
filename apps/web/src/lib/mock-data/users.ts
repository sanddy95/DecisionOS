import type { User } from '@/lib/types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@acmedemo.com', role: 'Executive', department: 'Executive', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=1B2A4A&color=fff', isActive: true, lastLogin: new Date(Date.now() - 3600000).toISOString() },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@acmedemo.com', role: 'Operations', department: 'Customer Success', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=2563EB&color=fff', isActive: true, lastLogin: new Date(Date.now() - 7200000).toISOString() },
  { id: 'u3', name: 'James Wilson', email: 'james@acmedemo.com', role: 'Analyst', department: 'Sales', avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=059669&color=fff', isActive: true, lastLogin: new Date(Date.now() - 86400000).toISOString() },
  { id: 'u4', name: 'Emily Ross', email: 'emily@acmedemo.com', role: 'Operations', department: 'Support', avatar: 'https://ui-avatars.com/api/?name=Emily+Ross&background=7C3AED&color=fff', isActive: true, lastLogin: new Date(Date.now() - 172800000).toISOString() },
  { id: 'u5', name: 'Admin User', email: 'admin@acmedemo.com', role: 'Admin', department: 'IT', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=DC2626&color=fff', isActive: true, lastLogin: new Date(Date.now() - 43200000).toISOString() },
]

export const currentUser = mockUsers[0]!
