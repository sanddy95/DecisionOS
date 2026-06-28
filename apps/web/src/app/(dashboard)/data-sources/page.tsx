'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Database, FileSpreadsheet, Upload, CheckCircle, RefreshCw, Plus, Link2, Zap } from 'lucide-react'
import { UploadWizard } from '@/components/data/upload-wizard'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const mockSources = [
  { id: 'ds1', name: 'Customers Dataset', type: 'csv', status: 'active', rows: 10, lastSync: new Date(Date.now() - 3600000).toISOString(), tableName: 'customers' },
  { id: 'ds2', name: 'Revenue & Invoices', type: 'csv', status: 'active', rows: 9, lastSync: new Date(Date.now() - 7200000).toISOString(), tableName: 'revenue' },
  { id: 'ds3', name: 'Support Tickets', type: 'csv', status: 'active', rows: 7, lastSync: new Date(Date.now() - 7200000).toISOString(), tableName: 'support_tickets' },
  { id: 'ds4', name: 'Sales Pipeline', type: 'excel', status: 'active', rows: 8, lastSync: new Date(Date.now() - 86400000).toISOString(), tableName: 'sales_pipeline' },
  { id: 'ds5', name: 'Customer Engagement', type: 'csv', status: 'syncing', rows: 0, lastSync: null, tableName: 'engagement' },
]

const connectors = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Contacts, opportunities, accounts', available: true, color: 'bg-blue-500' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Deals, contacts, marketing data', available: true, color: 'bg-orange-500' },
  { id: 'postgres', name: 'PostgreSQL', category: 'Database', description: 'Direct database connection', available: true, color: 'bg-indigo-500' },
  { id: 'sheets', name: 'Google Sheets', category: 'Spreadsheet', description: 'Live sheet sync', available: true, color: 'bg-green-500' },
  { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Revenue, subscriptions, invoices', available: false, color: 'bg-purple-500' },
  { id: 'zendesk', name: 'Zendesk', category: 'Support', description: 'Tickets, agents, CSAT scores', available: false, color: 'bg-yellow-500' },
  { id: 'mysql', name: 'MySQL', category: 'Database', description: 'Direct database connection', available: false, color: 'bg-blue-600' },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Channel messages, user activity', available: false, color: 'bg-rose-500' },
]

const typeIcons = { csv: FileSpreadsheet, excel: FileSpreadsheet, postgres: Database }
const statusColors = { active: 'bg-green-100 text-green-700', syncing: 'bg-blue-100 text-blue-700', error: 'bg-red-100 text-red-700', inactive: 'bg-gray-100 text-gray-600' }

function ConnectorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [connecting, setConnecting] = useState<string | null>(null)

  async function handleConnect(id: string, name: string) {
    setConnecting(id)
    await new Promise(r => setTimeout(r, 1200))
    setConnecting(null)
    onOpenChange(false)
    toast.success(`${name} connected successfully`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Link2 size={18} /> Connect a Data Source</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {connectors.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className={`w-9 h-9 ${c.color} rounded-lg flex items-center justify-center shrink-0`}>
                <Database size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{c.name}</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{c.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.description}</p>
              </div>
              {c.available ? (
                <Button size="sm" variant="outline" className="h-7 text-xs shrink-0"
                  disabled={connecting === c.id}
                  onClick={() => void handleConnect(c.id, c.name)}>
                  {connecting === c.id ? <RefreshCw size={11} className="animate-spin" /> : 'Connect'}
                </Button>
              ) : (
                <Badge variant="secondary" className="text-[10px] shrink-0">Soon</Badge>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DataSourcesPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [showConnector, setShowConnector] = useState(false)
  const [sources, setSources] = useState(mockSources)
  const [syncing, setSyncing] = useState<string | null>(null)

  async function handleSync(id: string) {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 1500))
    setSyncing(null)
    toast.success('Data source synced successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <p className="text-sm text-muted-foreground">{sources.length} connected sources · {sources.reduce((acc, s) => acc + s.rows, 0).toLocaleString()} total rows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowConnector(true)}>
            <Zap size={15} /><span className="hidden sm:inline">Connect Source</span><span className="sm:hidden">Connect</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowUpload(true)}>
            <Upload size={15} /><span className="hidden sm:inline">Upload Data</span><span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </div>

      <ConnectorDialog open={showConnector} onOpenChange={setShowConnector} />

      {showUpload && <UploadWizard onClose={() => setShowUpload(false)} onComplete={(name) => { setSources(prev => [...prev, { id: `ds${Date.now()}`, name, type: 'csv', status: 'active', rows: 45, lastSync: new Date().toISOString(), tableName: name.toLowerCase().replace(/\s/g, '_') }]); setShowUpload(false) }} />}

      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="history">Ingestion History</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {sources.map(source => {
              const Icon = typeIcons[source.type as keyof typeof typeIcons] ?? Database
              return (
                <div key={source.id} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.rows > 0 ? `${source.rows.toLocaleString()} rows` : 'Syncing...'} · {source.lastSync ? formatDate(source.lastSync) : 'Never'}
                    </p>
                  </div>
                  <Badge className={`text-xs border-0 capitalize ${statusColors[source.status as keyof typeof statusColors] ?? 'bg-gray-100 text-gray-600'}`}>{source.status}</Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => void handleSync(source.id)} disabled={syncing === source.id}>
                    <RefreshCw size={13} className={syncing === source.id ? 'animate-spin' : ''} />
                  </Button>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="rounded-xl border bg-card divide-y">
            {[...sources].reverse().slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ingested: {s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rows} rows imported · {s.lastSync ? formatDate(s.lastSync) : 'Pending'}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">Success</Badge>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
