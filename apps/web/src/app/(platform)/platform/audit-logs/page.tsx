import { ScrollText, Shield, Database, User, Settings, Brain } from 'lucide-react'

const auditLogs = [
  { id: 'al1', event: 'tenant.created', tenant: 'StartupXYZ', actor: 'platform-admin', ip: '10.0.0.1', time: '2 hours ago', type: 'admin' },
  { id: 'al2', event: 'tenant.plan_changed', tenant: 'GlobalTech Inc', actor: 'platform-admin', ip: '10.0.0.1', time: '4 hours ago', type: 'billing' },
  { id: 'al3', event: 'user.login', tenant: 'Acme Corp', actor: 'alex@acmedemo.com', ip: '192.168.1.1', time: '5 hours ago', type: 'auth' },
  { id: 'al4', event: 'data.sync_completed', tenant: 'NovaTech Solutions', actor: 'system', ip: '—', time: '6 hours ago', type: 'sync' },
  { id: 'al5', event: 'llm.provider_changed', tenant: 'CloudBase Inc', actor: 'ops@cloudbase.io', ip: '172.16.0.5', time: '8 hours ago', type: 'config' },
  { id: 'al6', event: 'tenant.suspended', tenant: 'RetailCo', actor: 'platform-admin', ip: '10.0.0.1', time: '1 day ago', type: 'admin' },
  { id: 'al7', event: 'ai.query', tenant: 'Acme Corp', actor: 'analyst@acmedemo.com', ip: '192.168.1.5', time: '1 day ago', type: 'ai' },
  { id: 'al8', event: 'data.source_added', tenant: 'GlobalTech Inc', actor: 'admin@globaltech.com', ip: '203.0.113.10', time: '2 days ago', type: 'data' },
]

const typeIcons: Record<string, React.ElementType> = {
  admin: Shield, auth: User, sync: Database, config: Settings, ai: Brain, billing: ScrollText, data: Database,
}
const typeColors: Record<string, string> = {
  admin: 'text-violet-400 bg-violet-500/10',
  auth: 'text-blue-400 bg-blue-500/10',
  sync: 'text-green-400 bg-green-500/10',
  config: 'text-amber-400 bg-amber-500/10',
  ai: 'text-orange-400 bg-orange-500/10',
  billing: 'text-pink-400 bg-pink-500/10',
  data: 'text-cyan-400 bg-cyan-500/10',
}

export default function AuditLogsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide activity trail across all tenants</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {auditLogs.map(log => {
            const Icon = typeIcons[log.type] ?? ScrollText
            return (
              <div key={log.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[log.type]}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-gray-200">{log.event}</p>
                  </div>
                  <p className="text-xs text-gray-500">{log.tenant} · {log.actor} · IP: {log.ip}</p>
                </div>
                <p className="text-xs text-gray-600 shrink-0">{log.time}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
