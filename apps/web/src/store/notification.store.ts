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
