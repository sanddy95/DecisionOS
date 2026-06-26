'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { X, Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface UploadWizardProps {
  onClose: () => void
  onComplete: (name: string) => void
}

type Step = 'upload' | 'preview' | 'confirm' | 'done'

const previewData = {
  columns: ['customer_id', 'customer_name', 'segment', 'industry', 'start_date', 'status'],
  rows: [
    ['C001', 'Apex Corp', 'Enterprise', 'Technology', '2024-01-15', 'Active'],
    ['C002', 'Nova Health', 'Mid-Market', 'Healthcare', '2024-03-20', 'Active'],
    ['C003', 'Swift Labs', 'SMB', 'SaaS', '2024-06-01', 'At-Risk'],
  ],
  quality: { nulls: 0, duplicates: 0, typeIssues: 0, totalRows: 45 },
}

export function UploadWizard({ onClose, onComplete }: UploadWizardProps) {
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [datasetName, setDatasetName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setDatasetName(f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '))
    let p = 0
    const interval = setInterval(() => {
      p += 15
      setProgress(p)
      if (p >= 100) { clearInterval(interval); setTimeout(() => setStep('preview'), 300) }
    }, 100)
  }

  async function handleConfirm() {
    setStep('confirm')
    let p = 0
    const interval = setInterval(() => {
      p += 8
      setProgress(p)
      if (p >= 100) { clearInterval(interval); setStep('done') }
    }, 80)
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Upload Data Source</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-xs">
        {(['upload', 'preview', 'confirm', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-border" />}
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center font-semibold', step === s ? 'bg-blue-600 text-white' : ['upload', 'preview', 'confirm', 'done'].indexOf(step) > i ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground')}>
              {['upload', 'preview', 'confirm', 'done'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            <span className={cn('capitalize', step === s && 'font-medium')}>{s}</span>
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={cn('border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors', dragging ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'border-border hover:border-blue-400')}
        >
          <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">Drop CSV or Excel file here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse · max 50MB</p>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
      )}

      {step === 'upload' && file && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <FileText size={16} className="text-muted-foreground" />
            <span className="flex-1 truncate">{file.name}</span>
            <span className="text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">Analyzing schema...</p>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[['Total Rows', previewData.quality.totalRows], ['Null Values', previewData.quality.nulls], ['Duplicates', previewData.quality.duplicates]].map(([label, val]) => (
              <div key={label as string} className="text-center rounded-lg bg-muted p-3">
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="text-xs w-full">
              <thead><tr className="bg-muted">{previewData.columns.map(c => <th key={c} className="px-3 py-2 text-left font-semibold">{c}</th>)}</tr></thead>
              <tbody>{previewData.rows.map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Dataset name</label>
            <Input value={datasetName} onChange={e => setDatasetName(e.target.value)} placeholder="e.g. Q2 Customers" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => void handleConfirm()}>Confirm Import</Button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-3">
          <p className="text-sm">Ingesting {previewData.quality.totalRows} rows...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {step === 'done' && (
        <div className="text-center space-y-3 py-4">
          <CheckCircle size={40} className="text-green-600 mx-auto" />
          <h4 className="font-semibold">Data imported successfully</h4>
          <p className="text-sm text-muted-foreground">{previewData.quality.totalRows} rows from <strong>{datasetName}</strong> are now available for AI queries and dashboards.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onComplete(datasetName)}>Done</Button>
        </div>
      )}
    </div>
  )
}
