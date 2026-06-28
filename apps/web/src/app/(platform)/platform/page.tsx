import { mockTenants, platformStats } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, DollarSign, Brain, TrendingUp, AlertCircle } from 'lucide-react'

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Trial: 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
  Churned: 'bg-gray-100 text-gray-600',
}

const planColors: Record<string, string> = {
  Enterprise: 'bg-violet-100 text-violet-700',
  Professional: 'bg-blue-100 text-blue-700',
  Starter: 'bg-green-100 text-green-700',
  Trial: 'bg-amber-100 text-amber-700',
}

export default function PlatformPage() {
  const stats = [
    { label: 'Total Tenants', value: platformStats.totalTenants, sub: `${platformStats.activeTenants} active`, icon: Building2, color: 'text-violet-400' },
    { label: 'Total Users', value: platformStats.totalUsers, sub: 'across all tenants', icon: Users, color: 'text-blue-400' },
    { label: 'Monthly MRR', value: `$${platformStats.totalMRR.toLocaleString()}`, sub: 'net active tenants', icon: DollarSign, color: 'text-green-400' },
    { label: 'AI Queries / mo', value: platformStats.totalAiQueries.toLocaleString(), sub: `avg ${platformStats.avgQueriesPerTenant}/tenant`, icon: Brain, color: 'text-amber-400' },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time health across all tenant workspaces</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
              </div>
              <s.icon size={20} className={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Tenant health table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm">Tenant Health</h2>
          <span className="text-xs text-gray-500">{mockTenants.length} total</span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200">
              {['Tenant', 'Plan', 'Status', 'Users', 'Data Sources', 'AI Queries/mo', 'MRR'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockTenants.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <a href={`/platform/tenants/${t.id}`} className="font-medium hover:text-violet-400 transition-colors">{t.name}</a>
                  <p className="text-xs text-gray-500">{t.domain}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${planColors[t.plan]}`}>{t.plan}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                    {t.status === 'Suspended' && <AlertCircle size={10} />}
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{t.users}</td>
                <td className="px-6 py-4 text-gray-700">{t.dataSources}</td>
                <td className="px-6 py-4 text-gray-700">{t.aiQueriesMonth.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-700">{t.mrr > 0 ? `$${t.mrr.toLocaleString()}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
