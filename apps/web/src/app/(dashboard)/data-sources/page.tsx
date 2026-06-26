'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, FileSpreadsheet, Upload, CheckCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react'
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

const typeIcons = { csv: FileSpreadsheet, excel: FileSpreadsheet, postgres: Database }
const statusColors = { active: 'bg-green-100 text-green-700', syncing: 'bg-blue-100 text-blue-700', error: 'bg-red-100 text-red-700', inactive: 'bg-gray-100 text-gray-600' }

export default function DataSourcesPage() {
  const [showUpload, setShowUpload] = useState(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <p className="text-sm text-muted-foreground">{sources.length} connected sources · {sources.reduce((acc, s) => acc + s.rows, 0).toLocaleString()} total rows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowUpload(true)}>
          <Upload size={15} /> Upload Data
        </Button>
      </div>

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
