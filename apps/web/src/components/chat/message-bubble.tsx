'use client'
import { CitationBadge } from './citation-badge'
import { InlineChart } from './inline-chart'
import { cn } from '@/lib/utils'
import type { AIResponse } from '@/lib/mock-ai-responses'
import { Sparkles, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  aiData?: AIResponse
  isStreaming?: boolean
}

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function MessageBubble({ role, content, aiData, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={14} className="text-blue-400" />
      </div>
      <div className="flex-1 max-w-[90%]">
        <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3">
          {isStreaming ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {content.split('\n').map((line, i) => (
                  <span key={i} className="block"><MarkdownText text={line} /></span>
                ))}
              </p>

              {aiData?.chart && (
                <InlineChart type={aiData.chart.type} title={aiData.chart.title} data={aiData.chart.data} />
              )}

              {aiData?.table && (
                <div className="overflow-x-auto mt-3 rounded-lg border">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="bg-muted">
                        {aiData.table.columns.map(col => (
                          <th key={col} className="px-3 py-2 text-left font-semibold text-muted-foreground">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {aiData.table.rows.map((row, i) => (
                        <tr key={i} className="border-t hover:bg-muted/50">
                          {row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {aiData?.citations && aiData.citations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground self-center">Sources:</span>
                  {aiData.citations.map((c, i) => (
                    <CitationBadge key={i} dataset={c.dataset} table={c.table} sql={c.sql} />
                  ))}
                  {aiData.confidence && (
                    <span className="text-xs text-muted-foreground self-center ml-auto">
                      Confidence: {aiData.confidence}%
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy response">
                  {copied ? <CheckCircle size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
