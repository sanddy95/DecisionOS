'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers, subscriptionPlans, mockTenants } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Shield, Users, Database, Key, ClipboardList, Settings, ExternalLink,
  Info, Brain, CreditCard, Check, CheckCircle2, User, LogIn, Upload, Search,
} from 'lucide-react'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700',
  'Admin': 'bg-orange-100 text-orange-700',
  'Executive': 'bg-slate-100 text-slate-700',
  'Analyst': 'bg-purple-100 text-purple-700',
  'Operations': 'bg-blue-100 text-blue-700',
  'Viewer': 'bg-gray-100 text-gray-600',
}

const userLastActive = ['2 hours ago', '1 day ago', '3 days ago', '5 hours ago', 'Just now']

const auditEvents = [
  { id: 'a1', event: 'user.login', type: 'auth', user: 'Alex Johnson', description: 'Successful login', ip: '192.168.1.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a2', event: 'recommendation.approved', type: 'admin', user: 'Alex Johnson', description: 'Approved: Assign account manager to Acme Corp', ip: '192.168.1.1', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a3', event: 'data.upload', type: 'data', user: 'James Wilson', description: 'Uploaded: customers.csv (10 rows)', ip: '10.0.0.5', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a4', event: 'query.executed', type: 'query', user: 'Sarah Chen', description: 'SQL: SELECT customer_id, risk_score FROM customers...', ip: '10.0.0.8', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'a5', event: 'user.login.failed', type: 'failed', user: 'unknown@external.com', description: 'Failed login attempt from external IP', ip: '45.23.114.89', createdAt: new Date(Date.now() - 259200000).toISOString() },
]

const auditIconStyles: Record<string, { bg: string; icon: React.ElementType }> = {
  auth: { bg: 'bg-blue-100 text-blue-600', icon: LogIn },
  admin: { bg: 'bg-orange-100 text-orange-600', icon: Shield },
  data: { bg: 'bg-green-100 text-green-600', icon: Upload },
  query: { bg: 'bg-purple-100 text-purple-600', icon: Search },
  failed: { bg: 'bg-red-100 text-red-600', icon: User },
}

// Demo: Acme Corp (t1) is Enterprise
const acme = mockTenants.find(t => t.id === 't1')!
const tenantPlan = subscriptionPlans.find(p => p.name === 'Enterprise')!

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers.map((u, i) => ({ ...u, lastActive: userLastActive[i] ?? '1 day ago' })))
  const [llmModel, setLlmModel] = useState('gpt-4o')
  const [temperature, setTemperature] = useState('0.3')

  const statCards = [
    {
      label: 'Users',
      value: `${acme.users}`,
      sub: 'Unlimited on Enterprise',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'AI Queries / mo',
      value: acme.aiQueriesMonth.toLocaleString(),
      sub: 'Unlimited on Enterprise',
      icon: Brain,
      color: 'text-violet-600',
    },
    {
      label: 'Data Sources',
      value: `${acme.dataSources} connected`,
      sub: 'Unlimited on Enterprise',
      icon: Database,
      color: 'text-green-600',
    },
    {
      label: 'Plan',
      value: acme.plan,
      sub: 'Active · Renews Aug 1',
      icon: CreditCard,
      color: 'text-amber-600',
      badge: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Admin Console</h2>
          <p className="text-sm text-muted-foreground">Manage users, roles, LLM settings, and organization configuration</p>
        </div>
        <a href="/platform" target="_blank"
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
          <ExternalLink size={12} /> Platform Admin Panel
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{c.label}</p>
                {c.badge ? (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-violet-100 text-violet-700">{c.value}</span>
                  </div>
                ) : (
                  <p className="text-xl font-bold mt-1">{c.value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
              </div>
              <c.icon size={18} className={c.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="flex">
          <TabsTrigger value="users" className="gap-1.5"><Users size={14} />Users</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5"><Shield size={14} />Roles</TabsTrigger>
          <TabsTrigger value="llm" className="gap-1.5"><Key size={14} />LLM</TabsTrigger>
          <TabsTrigger value="subscription" className="gap-1.5"><CreditCard size={14} />Subscription</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><ClipboardList size={14} />Audit Logs</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings size={14} />Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input placeholder="Search users..." className="max-w-xs" />
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{users.length} / unlimited users</span>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Invite User</Button>
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Last Active</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select defaultValue={user.role} onValueChange={(v) => { setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: v as (typeof users)[number]['role'] } : u)); toast.success('Role updated') }}>
                        <SelectTrigger className="h-7 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(roleColors).map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <Switch checked={user.isActive} onCheckedChange={(v) => { setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: v } : u)); toast.success(v ? 'User activated' : 'User deactivated') }} aria-label={`Toggle ${user.name}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(roleColors).map(([role, color]) => (
              <div key={role} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`border-0 text-sm ${color}`}>{role}</Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {role === 'Admin' && <><p>✓ Manage users & roles</p><p>✓ Configure data sources</p><p>✓ View audit logs</p><p>✓ Manage KPIs</p></>}
                  {role === 'Executive' && <><p>✓ View all dashboards</p><p>✓ Approve recommendations</p><p>✓ Access Ask AI</p><p>✓ View insights</p></>}
                  {role === 'Analyst' && <><p>✓ Run AI queries</p><p>✓ Manage datasets</p><p>✓ Create dashboards</p><p>✓ Configure KPIs</p></>}
                  {role === 'Operations' && <><p>✓ Manage tasks</p><p>✓ Process approvals</p><p>✓ View workflows</p><p>✓ View dashboards</p></>}
                  {role === 'Viewer' && <><p>✓ View dashboards</p><p>✓ View insights</p><p>✓ View recommendations</p></>}
                  {role === 'Super Admin' && <><p>✓ Full platform access</p><p>✓ All admin operations</p><p>✓ System configuration</p></>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* LLM Settings Tab */}
        <TabsContent value="llm" className="mt-6">
          <div className="max-w-lg space-y-6">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Info size={15} className="text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold">Enterprise Plan — All providers available</p>
                <p className="text-blue-600 mt-0.5">Available providers are determined by your subscription plan.</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">LLM Provider Configuration</h3>
              <div className="space-y-1.5">
                <Label>Active Provider</Label>
                <Select defaultValue="anthropic">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tenantPlan.allowedProviders.map(p => (
                      <SelectItem key={p} value={p.toLowerCase().replace(/\s/g, '-')}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{tenantPlan.allowedProviders.length} providers available on your plan</p>
              </div>
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                    <SelectItem value="claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
                    <SelectItem value="claude-opus-4-8">Claude Opus 4.8</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>API Key</Label>
                <Input type="password" defaultValue="sk-••••••••••••••••••••••••••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>Temperature ({temperature})</Label>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full" />
                <p className="text-xs text-muted-foreground">Lower = more factual. Recommended: 0.1–0.3</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => toast.success('LLM settings saved')}>Save Settings</Button>
            </div>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: current plan + usage */}
            <div className="col-span-2 space-y-4">
              {/* Plan card */}
              <div className="rounded-xl border border-l-4 border-l-violet-500 bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Current Plan</p>
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-bold text-violet-600">Enterprise</h3>
                      <span className="text-lg font-semibold text-muted-foreground">$1,199/mo</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    'Unlimited users',
                    'Unlimited data sources',
                    'Unlimited AI queries/month',
                    'All LLM providers (Claude, GPT-4o, Gemini, Ollama)',
                    'Priority support',
                    'Custom model integration',
                  ].map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={13} className="text-green-600 mt-0.5 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">Contact your sales representative to modify your plan.</p>
              </div>

              {/* Usage meters */}
              <div className="rounded-xl border bg-card p-6 space-y-5">
                <h3 className="font-semibold text-sm">Usage — Current Billing Period</h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Users</span>
                    <span className="font-semibold">{acme.users} <span className="text-muted-foreground font-normal">/ unlimited</span></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">AI Queries</span>
                    <span className="font-semibold">{acme.aiQueriesMonth.toLocaleString()} <span className="text-muted-foreground font-normal">/ unlimited</span></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: '49%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Avg 61 queries/day across {acme.users} users</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Data Sources</span>
                    <span className="font-semibold">{acme.dataSources} <span className="text-muted-foreground font-normal">/ unlimited</span></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: plan comparison */}
            <div className="col-span-1">
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">All Plans</p>
                </div>
                <div className="divide-y">
                  {subscriptionPlans.map(plan => {
                    const isCurrent = plan.name === 'Enterprise'
                    return (
                      <div key={plan.id} className={`px-4 py-3 ${isCurrent ? 'bg-violet-50' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${isCurrent ? 'text-violet-700' : ''}`}>{plan.name}</span>
                          {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-200 text-violet-700 font-medium">Current</span>}
                        </div>
                        <p className="text-xs font-medium">{plan.priceMonthly > 0 ? `$${plan.priceMonthly}/mo` : 'Free'}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {plan.maxUsers ? `${plan.maxUsers} users` : '∞ users'} · {plan.maxAiQueriesMonth ? `${plan.maxAiQueriesMonth.toLocaleString()} queries` : '∞ queries'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="mt-6 space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search audit logs..." className="max-w-xs" />
            <Button variant="outline" size="sm">Export CSV</Button>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {auditEvents.map(event => {
              const style = auditIconStyles[event.type] ?? auditIconStyles['auth']!
              const Icon = style.icon
              return (
                <div key={event.id} className="px-4 py-3 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">{event.event}</Badge>
                      <span className="text-xs text-muted-foreground">{event.user}</span>
                    </div>
                    <p className="text-sm mt-1 truncate">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">IP: {event.ip} · {formatDate(event.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-lg space-y-4">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Organization Settings</h3>
              <div className="space-y-1.5"><Label>Organization Name</Label><Input defaultValue="Acme Demo Corp" /></div>
              <div className="space-y-1.5">
                <Label>Default Timezone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">UTC</SelectItem>
                    <SelectItem value="utc+5.5">IST (UTC+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audit Log Retention</Label>
                <Select defaultValue="12m">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12m">12 months</SelectItem>
                    <SelectItem value="24m">24 months</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => toast.success('Settings saved')}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
