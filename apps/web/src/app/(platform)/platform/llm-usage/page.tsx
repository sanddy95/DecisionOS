import { mockTenants } from '@/lib/mock-data'
import { Brain, TrendingUp } from 'lucide-react'

const providerColors: Record<string, string> = {
  'Claude': 'bg-orange-100 text-orange-700',
  'Claude Sonnet': 'bg-orange-100 text-orange-700',
  'GPT-4o': 'bg-green-100 text-green-700',
  'GPT-4o-mini': 'bg-green-100 text-green-700',
  'Gemini': 'bg-blue-100 text-blue-700',
  'Gemini Pro': 'bg-blue-100 text-blue-700',
}

function estimateCost(queries: number, provider: string): number {
  const ratePerQuery: Record<string, number> = {
    'Claude': 0.012, 'Claude Sonnet': 0.012, 'GPT-4o': 0.010,
    'GPT-4o-mini': 0.002, 'Gemini': 0.007, 'Gemini Pro': 0.007,
  }
  const rate = ratePerQuery[provider] ?? 0.010
  return Math.round(queries * rate * 100) / 100
}

export default function LLMUsagePage() {
  const totalQueries = mockTenants.reduce((a, t) => a + t.aiQueriesMonth, 0)
  const totalCost = mockTenants.reduce((a, t) => a + estimateCost(t.aiQueriesMonth, t.llmProvider), 0)

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">LLM Usage</h1>
        <p className="text-sm text-gray-500 mt-1">Cross-tenant AI query usage and cost estimates</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Queries / mo', value: totalQueries.toLocaleString(), sub: 'across all tenants', icon: Brain },
          { label: 'Estimated Cost / mo', value: `$${totalCost.toFixed(2)}`, sub: 'based on provider rates', icon: TrendingUp },
          { label: 'Active Providers', value: new Set(mockTenants.map(t => t.llmProvider)).size.toString(), sub: 'unique LLM providers in use', icon: Brain },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
              </div>
              <s.icon size={20} className="text-violet-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Per-tenant table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm">Usage by Tenant</h2>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-200">
              {['Tenant', 'Plan', 'LLM Provider', 'Queries / mo', 'Est. Cost', 'Avg / Day'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {[...mockTenants].sort((a, b) => b.aiQueriesMonth - a.aiQueriesMonth).map(t => {
              const cost = estimateCost(t.aiQueriesMonth, t.llmProvider)
              return (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{t.name}</td>
                  <td className="px-6 py-4 text-gray-500">{t.plan}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${providerColors[t.llmProvider] ?? 'bg-gray-500/20 text-gray-700'}`}>
                      {t.llmProvider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{t.aiQueriesMonth.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">${cost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{Math.round(t.aiQueriesMonth / 30)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700 bg-gray-50">
              <td className="px-6 py-3 font-semibold text-gray-700" colSpan={3}>Total</td>
              <td className="px-6 py-3 font-semibold">{totalQueries.toLocaleString()}</td>
              <td className="px-6 py-3 font-semibold">${totalCost.toFixed(2)}</td>
              <td className="px-6 py-3 text-gray-500">{Math.round(totalQueries / 30)}</td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
    </div>
  )
}
