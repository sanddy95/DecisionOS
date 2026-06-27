'use client'
import { useState } from 'react'
import { mockTenants, subscriptionPlans } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, Database, Brain, HardDrive, DollarSign, Mail, Globe, Calendar, Pause, RotateCcw, Trash2, ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Trial: 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
}

const activityLog = [
  { event: 'User login', user: 'Admin', time: '2 hours ago' },
  { event: 'Zoho CRM sync completed', user: 'System', time: '4 hours ago' },
  { event: 'AI query: "Top 5 accounts by revenue"', user: 'Analyst', time: '6 hours ago' },
  { event: 'Data source added: customers.csv', user: 'Admin', time: '1 day ago' },
  { event: 'LLM provider changed to Claude', user: 'Admin', time: '3 days ago' },
]

const planBadgeColors: Record<string, string> = {
  Enterprise: 'bg-violet-100 text-violet-700',
  Professional: 'bg-blue-100 text-blue-700',
  Starter: 'bg-green-100 text-green-700',
  Trial: 'bg-amber-100 text-amber-700',
}

export default function TenantDetailPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0]
  const tenant = mockTenants.find(t => t.id === id)
  const [currentPlan, setCurrentPlan] = useState(tenant?.plan ?? 'Starter')
  const [showPlanPicker, setShowPlanPicker] = useState(false)

  if (!tenant) return null

  const metrics = [
    { label: 'Users', value: tenant.users, icon: Users },
    { label: 'Data Sources', value: tenant.dataSources, icon: Database },
    { label: 'AI Queries / mo', value: tenant.aiQueriesMonth.toLocaleString(), icon: Brain },
    { label: 'Storage', value: `${tenant.storageGB} GB`, icon: HardDrive },
    { label: 'MRR', value: tenant.mrr > 0 ? `$${tenant.mrr}` : '—', icon: DollarSign },
  ]

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/platform/tenants" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-violet-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tenant.status] ?? 'bg-gray-100 text-gray-500'}`}>{tenant.status}</span>
            </div>
            <p className="text-sm text-gray-500">{tenant.domain}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="col-span-2 space-y-5">
          {/* Metrics */}
          <div className="grid grid-cols-5 gap-3">
            {metrics.map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <m.icon size={16} className="text-violet-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{m.value}</p>
                <p className="text-[10px] text-gray-400">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Tenant Details</h3>
            {[
              { icon: Mail, label: 'Admin Email', value: tenant.adminEmail },
              { icon: Globe, label: 'Domain', value: tenant.domain },
              { icon: Calendar, label: 'Created', value: tenant.createdAt },
              { icon: Brain, label: 'LLM Provider', value: tenant.llmProvider },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-400 w-28">{label}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {activityLog.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{a.event}</p>
                    <p className="text-xs text-gray-400">{a.user} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-4">
          {/* Plan management */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Subscription Plan</h3>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${planBadgeColors[currentPlan]}`}>{currentPlan}</span>
              <button
                onClick={() => setShowPlanPicker(v => !v)}
                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 transition-colors">
                Change <ChevronDown size={12} />
              </button>
            </div>
            {showPlanPicker && (
              <div className="space-y-1 pt-1">
                {subscriptionPlans.map(p => (
                  <button key={p.id}
                    onClick={() => { setCurrentPlan(p.name); setShowPlanPicker(false) }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${currentPlan === p.name ? 'bg-violet-50 text-violet-700' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-gray-400">{p.priceMonthly > 0 ? `$${p.priceMonthly}/mo` : 'Free'}</span>
                  </button>
                ))}
              </div>
            )}
            {(() => {
              const plan = subscriptionPlans.find(p => p.name === currentPlan)
              if (!plan) return null
              return (
                <div className="text-xs text-gray-500 space-y-1 pt-1 border-t border-gray-100">
                  <p>Schema: <code className="text-violet-600">{tenant.slug}_schema</code></p>
                  <p>LLM Access: {plan.allowedProviders.join(', ')}</p>
                  <p>Limits: {plan.maxUsers ?? '∞'} users · {plan.maxDataSources ?? '∞'} sources · {plan.maxAiQueriesMonth ? `${plan.maxAiQueriesMonth} AI queries` : '∞ AI queries'}</p>
                </div>
              )
            })()}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors">
              <RotateCcw size={14} /> Force Sync All Sources
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200">
              <Pause size={14} /> Suspend Tenant
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200">
              <Trash2 size={14} /> Delete Tenant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
