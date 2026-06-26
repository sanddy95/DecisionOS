'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { Shield, Users, Database, Key, ClipboardList, Settings } from 'lucide-react'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700',
  'Admin': 'bg-orange-100 text-orange-700',
  'Executive': 'bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300',
  'Analyst': 'bg-purple-100 text-purple-700',
  'Operations': 'bg-blue-100 text-blue-700',
  'Viewer': 'bg-gray-100 text-gray-600',
}

const auditEvents = [
  { id: 'a1', event: 'user.login', user: 'Alex Johnson', resource: 'auth', description: 'Successful login', ip: '192.168.1.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a2', event: 'recommendation.approved', user: 'Alex Johnson', resource: 'recommendations/rec1', description: 'Approved: Assign account manager to Acme Corp', ip: '192.168.1.1', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a3', event: 'data.upload', user: 'James Wilson', resource: 'datasets', description: 'Uploaded: customers.csv (10 rows)', ip: '10.0.0.5', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a4', event: 'query.executed', user: 'Sarah Chen', resource: 'query-engine', description: 'SQL: SELECT customer_id, risk_score FROM customers...', ip: '10.0.0.8', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'a5', event: 'user.login.failed', user: 'unknown@external.com', resource: 'auth', description: 'Failed login attempt', ip: '45.23.114.89', createdAt: new Date(Date.now() - 259200000).toISOString() },
]

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers)
  const [llmModel, setLlmModel] = useState('gpt-4o')
  const [temperature, setTemperature] = useState('0.3')

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="users" className="gap-1.5"><Users size={14} />Users</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5"><Shield size={14} />Roles</TabsTrigger>
          <TabsTrigger value="llm" className="gap-1.5"><Key size={14} />LLM</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><ClipboardList size={14} />Audit Logs</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings size={14} />Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="flex justify-between mb-4">
            <Input placeholder="Search users..." className="max-w-xs" />
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Invite User</Button>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-4 p-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.department}</p>
                </div>
                <Badge className={`border-0 text-xs ${roleColors[user.role] ?? 'bg-gray-100'}`}>{user.role}</Badge>
                <Switch checked={user.isActive} onCheckedChange={(v) => { setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: v } : u)); toast.success(v ? 'User activated' : 'User deactivated') }} aria-label={`Toggle ${user.name}`} />
              </div>
            ))}
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
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">LLM Provider Configuration</h3>
              <div className="space-y-1.5">
                <Label>Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude 4 Sonnet)</SelectItem>
                    <SelectItem value="gemini">Google (Gemini 2.0 Flash)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                    <SelectItem value="claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
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
                <p className="text-xs text-muted-foreground">Lower = more factual and deterministic. Recommended: 0.1–0.3</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => toast.success('LLM settings saved')}>Save Settings</Button>
            </div>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="mt-6">
          <div className="flex gap-3 mb-4">
            <Input placeholder="Search audit logs..." className="max-w-xs" />
            <Button variant="outline" size="sm">Export CSV</Button>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {auditEvents.map(event => (
              <div key={event.id} className="px-4 py-3 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{event.event}</Badge>
                    <span className="text-xs text-muted-foreground">{event.user}</span>
                  </div>
                  <p className="text-sm mt-1 truncate">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">IP: {event.ip} · {formatDate(event.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-lg space-y-4">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Organization Settings</h3>
              <div className="space-y-1.5"><Label>Organization Name</Label><Input defaultValue="Acme Demo Corp" /></div>
              <div className="space-y-1.5"><Label>Default Timezone</Label>
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
              <div className="space-y-1.5"><Label>Audit Log Retention</Label>
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
