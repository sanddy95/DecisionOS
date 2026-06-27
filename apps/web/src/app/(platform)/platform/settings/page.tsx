'use client'
import { useState } from 'react'
import { subscriptionPlans } from '@/lib/mock-data'
import { Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'

const colorBorders: Record<string, string> = {
  amber: 'border-l-amber-400',
  green: 'border-l-green-400',
  blue: 'border-l-blue-400',
  violet: 'border-l-violet-400',
}
const colorText: Record<string, string> = {
  amber: 'text-amber-400', green: 'text-green-400', blue: 'text-blue-400', violet: 'text-violet-400',
}

const featureFlags = [
  { key: 'sso_enabled', label: 'SSO / SAML Support', enabled: true },
  { key: 'custom_models', label: 'Custom LLM Models (Enterprise)', enabled: true },
  { key: 'audit_log_export', label: 'Audit Log Export (CSV/JSON)', enabled: false },
  { key: 'api_access', label: 'Public API Access (Beta)', enabled: false },
]

export default function PlatformSettingsPage() {
  const [flags, setFlags] = useState(featureFlags)

  function toggleFlag(key: string) {
    setFlags(f => f.map(flag => flag.key === key ? { ...flag, enabled: !flag.enabled } : flag))
    toast.success('Feature flag updated')
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Subscription plans, LLM providers, and feature flags</p>
      </div>

      {/* Subscription plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Subscription Plans</h2>
          <p className="text-xs text-gray-500">LLM provider access is enforced per plan</p>
        </div>
        <div className="space-y-3">
          {subscriptionPlans.map(plan => (
            <div key={plan.id} className={`bg-white border border-gray-200 border-l-4 ${colorBorders[plan.color]} rounded-xl p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`font-bold text-lg ${colorText[plan.color]}`}>{plan.name}</h3>
                    <span className="text-gray-700 font-semibold">{plan.priceMonthly > 0 ? `$${plan.priceMonthly}/mo` : 'Free'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Max Users</p>
                      <p className="font-medium">{plan.maxUsers ?? '∞'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Data Sources</p>
                      <p className="font-medium">{plan.maxDataSources ?? '∞'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">AI Queries/mo</p>
                      <p className="font-medium">{plan.maxAiQueriesMonth?.toLocaleString() ?? '∞'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">LLM Providers</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {plan.allowedProviders.map(p => (
                          <span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 border border-gray-300">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300">
                  <Pencil size={11} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature flags */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-800">Feature Flags</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {flags.map(flag => (
            <div key={flag.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium">{flag.label}</p>
                <p className="text-xs text-gray-500 font-mono">{flag.key}</p>
              </div>
              <button
                onClick={() => toggleFlag(flag.key)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${flag.enabled ? 'bg-violet-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${flag.enabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
