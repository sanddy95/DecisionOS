'use client'
import { useState } from 'react'
import { mockTenants } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Building2, Users, Brain } from 'lucide-react'
import Link from 'next/link'

type FilterTab = 'All' | 'Active' | 'Trial' | 'Suspended'

const planColors: Record<string, string> = {
  Enterprise: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Professional: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Starter: 'bg-green-500/20 text-green-300 border-green-500/30',
  Trial: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}
const statusDots: Record<string, string> = {
  Active: 'bg-green-400',
  Trial: 'bg-amber-400',
  Suspended: 'bg-red-400',
  Churned: 'bg-gray-400',
}

export default function TenantsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('All')

  const filtered = mockTenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.domain.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'All' || t.status === tab
    return matchSearch && matchTab
  })

  const tabs: FilterTab[] = ['All', 'Active', 'Trial', 'Suspended']

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="text-sm text-gray-400 mt-1">{mockTenants.length} total workspaces</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search tenants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 h-9"
          />
        </div>
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {tabs.map(t => (
            <button key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(t => (
          <Link key={t.id} href={`/platform/tenants/${t.id}`}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-700/50 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-900/50 rounded-lg flex items-center justify-center">
                  <Building2 size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-violet-400 transition-colors">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${statusDots[t.status]}`} />
                <span className="text-xs text-gray-400">{t.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${planColors[t.plan]}`}>{t.plan}</span>
              <span className="text-xs text-gray-500">· {t.llmProvider}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
              <div className="text-center">
                <p className="text-sm font-semibold">{t.users}</p>
                <p className="text-[10px] text-gray-500">Users</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{t.dataSources}</p>
                <p className="text-[10px] text-gray-500">Sources</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{t.mrr > 0 ? `$${t.mrr}` : '—'}</p>
                <p className="text-[10px] text-gray-500">MRR</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Building2 size={32} className="mx-auto mb-3 opacity-30" />
          <p>No tenants match your filters</p>
        </div>
      )}
    </div>
  )
}
