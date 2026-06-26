'use client'
import { useState } from 'react'
import { Database, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CitationBadgeProps {
  dataset: string
  table: string
  sql: string
}

export function CitationBadge({ dataset, table, sql }: CitationBadgeProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="text-xs">
      <button
        onClick={() => setExpanded(v => !v)}
        className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded px-2 py-1 hover:bg-blue-100 transition-colors"
        aria-expanded={expanded}
      >
        <Database size={11} />
        <span>{dataset} · {table}</span>
        {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {expanded && (
        <div className="mt-1.5 bg-muted rounded p-2 font-mono text-xs text-muted-foreground overflow-x-auto">
          {sql}
        </div>
      )}
    </div>
  )
}
