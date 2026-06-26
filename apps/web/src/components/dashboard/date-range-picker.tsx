'use client'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const ranges = [
  { label: 'Today', value: '1d' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'This year', value: '1y' },
]

interface DateRangePickerProps {
  value: string
  onChange: (value: string) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Calendar size={14} className="text-muted-foreground ml-1" />
      {ranges.map(r => (
        <button key={r.value} onClick={() => onChange(r.value)}
          className={cn(
            'px-3 py-1 text-sm rounded-md transition-colors',
            value === r.value ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
          )}>
          {r.label}
        </button>
      ))}
    </div>
  )
}
