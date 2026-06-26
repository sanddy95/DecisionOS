# Phase 6: Ask AI Chat Interface

**Goal:** Build the full-height AI chat interface with simulated streaming responses, citations, follow-up chips, inline charts, and session history sidebar.

---

## Files Created

- `apps/web/src/app/(dashboard)/ask/page.tsx`
- `apps/web/src/components/chat/chat-layout.tsx`
- `apps/web/src/components/chat/message-bubble.tsx`
- `apps/web/src/components/chat/chat-input.tsx`
- `apps/web/src/components/chat/session-sidebar.tsx`
- `apps/web/src/components/chat/citation-badge.tsx`
- `apps/web/src/components/chat/follow-up-chips.tsx`
- `apps/web/src/components/chat/inline-chart.tsx`
- `apps/web/src/lib/mock-ai-responses.ts`

---

## Task 1: Mock AI Responses

`apps/web/src/lib/mock-ai-responses.ts`:
```typescript
import { mockMonthlyRevenue } from '@/lib/mock-data'

export interface AIResponse {
  text: string
  chart?: { type: 'line' | 'bar' | 'pie'; title: string; data: unknown[] }
  table?: { columns: string[]; rows: string[][] }
  citations: Array<{ dataset: string; table: string; sql: string }>
  followUps: string[]
  confidence?: number
}

type MockResponses = Record<string, AIResponse>

export const mockAIResponses: MockResponses = {
  default: {
    text: "Based on your current data, here's what I found:",
    citations: [{ dataset: 'Demo Dataset', table: 'revenue', sql: 'SELECT month, SUM(amount) FROM revenue GROUP BY month' }],
    followUps: ['What drove the revenue change?', 'Show customer breakdown', 'Which segment performs best?'],
  },
  revenue: {
    text: "**Revenue Analysis — Last 6 Months**\n\nYour MRR reached **$106,000** in June, a **21.8% increase** over May's $87,000. This is your highest monthly revenue in the tracked period. The June spike is driven primarily by the NovaTech renewal ($31,000) and strong new business from the Meridian Health deal closure.\n\nHowever, I should flag that the May dip to $87K was below the $100K target — the delta was caused by delayed payments from StartupXYZ ($2,200) and CloudBase Inc ($1,800).",
    chart: {
      type: 'bar', title: 'Monthly Revenue vs Target (Last 6 Months)',
      data: mockMonthlyRevenue,
    },
    citations: [
      { dataset: 'Demo Dataset', table: 'revenue', sql: 'SELECT DATE_TRUNC(\'month\', invoice_date) as month, SUM(amount) as revenue FROM revenue WHERE invoice_date >= NOW() - INTERVAL \'6 months\' GROUP BY 1 ORDER BY 1' },
    ],
    followUps: ['Why did revenue dip in May?', 'Show revenue by customer segment', 'Which customers contributed most to June revenue?'],
    confidence: 97,
  },
  churn: {
    text: "**Churn Risk Analysis — At-Risk Customer Report**\n\nI identified **3 customers** with renewal dates within the next 90 days and composite risk scores above 70:\n\n1. **Acme Corp** (Risk Score: 78) — Renewal July 15 · $12,500 MRR · 2 escalated tickets, no account manager contact in 45 days\n2. **CloudBase Inc** (Risk Score: 72) — Renewal July 1 · $1,800 MRR · Overdue invoice $1,800, low portal engagement\n3. **StartupXYZ** (Risk Score: 85) — Renewal July 10 · $2,200 MRR · Overdue invoice, 0 portal logins this month\n\n**Total revenue at risk: $16,500 MRR**\n\nThe primary risk drivers are: unresolved support escalations (32%), overdue invoices (29%), and lack of account manager engagement (25%).",
    table: {
      columns: ['Customer', 'Risk Score', 'Renewal Date', 'MRR at Risk', 'Primary Risk Factor'],
      rows: [
        ['Acme Corp', '78 🔴', 'Jul 15, 2026', '$12,500', 'Escalated tickets'],
        ['StartupXYZ', '85 🔴', 'Jul 10, 2026', '$2,200', 'Overdue invoice'],
        ['CloudBase Inc', '72 🟠', 'Jul 1, 2026', '$1,800', 'No engagement'],
      ],
    },
    citations: [
      { dataset: 'Demo Dataset', table: 'customers', sql: 'SELECT customer_id, risk_score FROM customers WHERE renewal_date <= NOW() + INTERVAL \'90 days\' AND risk_score > 70 ORDER BY risk_score DESC' },
      { dataset: 'Demo Dataset', table: 'support_tickets', sql: 'SELECT customer_id, COUNT(*) FROM support_tickets WHERE status = \'Escalated\' GROUP BY customer_id' },
    ],
    followUps: ['Create tasks for account managers', 'Show engagement history for Acme Corp', 'What actions reduced churn risk in Q1?'],
    confidence: 92,
  },
  pipeline: {
    text: "**Sales Pipeline Summary**\n\nYour current pipeline stands at **$328,000** across 6 active deals. The weighted pipeline (adjusted for probability) is **$218,450**.\n\n**Stage breakdown:**\n- Negotiation: $202,000 (2 deals, avg probability 77.5%)\n- Proposal: $83,000 (2 deals, avg probability 60%)\n- Discovery: $28,000 (1 deal, 40%)\n- Prospecting: $15,000 (1 deal, 20%)\n\n⚠️ **Risk flag:** The ClearPath AI deal ($120K) has an expected close date of July 10. Slippage past end-of-month would impact Q3 attainment by 14%.",
    chart: {
      type: 'bar', title: 'Pipeline Value by Stage',
      data: [
        { stage: 'Prospecting', value: 15000 },
        { stage: 'Discovery', value: 28000 },
        { stage: 'Proposal', value: 83000 },
        { stage: 'Negotiation', value: 202000 },
      ],
    },
    citations: [{ dataset: 'Demo Dataset', table: 'sales_pipeline', sql: 'SELECT stage, SUM(value) as total_value, AVG(probability) as avg_prob FROM sales_pipeline WHERE stage NOT IN (\'Closed-Won\', \'Closed-Lost\') GROUP BY stage' }],
    followUps: ['Show deals closing this month', 'Who owns the largest deals?', 'Compare pipeline to last quarter'],
    confidence: 99,
  },
}

export function getAIResponse(message: string): AIResponse {
  const lower = message.toLowerCase()
  if (lower.includes('revenue') || lower.includes('mrr') || lower.includes('sales by month')) return mockAIResponses.revenue!
  if (lower.includes('churn') || lower.includes('at risk') || lower.includes('renewal') || lower.includes('renew')) return mockAIResponses.churn!
  if (lower.includes('pipeline') || lower.includes('deal') || lower.includes('sales')) return mockAIResponses.pipeline!
  return mockAIResponses.default!
}

export const exampleQuestions = [
  'Show sales by month for the last 6 months',
  'Which customers are at risk of not renewing?',
  'Why did revenue drop last month?',
  'What is the current pipeline value?',
  'Show overdue invoices',
  'Compare this quarter\'s churn to last quarter',
]
```

---

## Task 2: Citation Badge

`apps/web/src/components/chat/citation-badge.tsx`:
```tsx
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
```

---

## Task 3: Inline Chart

`apps/web/src/components/chat/inline-chart.tsx`:
```tsx
'use client'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface InlineChartProps {
  type: 'line' | 'bar' | 'pie'
  title: string
  data: unknown[]
}

export function InlineChart({ type, title, data }: InlineChartProps) {
  const chartData = data as Array<Record<string, unknown>>

  return (
    <div className="bg-muted/50 rounded-lg p-4 my-3">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{title}</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey={Object.keys(chartData[0] ?? {})[0]} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => typeof v === 'number' && v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip formatter={(v) => typeof v === 'number' && v >= 1000 ? formatCurrency(v) : v} />
              <Bar dataKey={Object.keys(chartData[0] ?? {})[1] ?? 'value'} fill="#2563EB" radius={[4, 4, 0, 0]} />
              {Object.keys(chartData[0] ?? {}).length > 2 && (
                <Bar dataKey={Object.keys(chartData[0] ?? {})[2] ?? 'target'} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey={Object.keys(chartData[0] ?? {})[0]} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey={Object.keys(chartData[0] ?? {})[1] ?? 'value'} stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

---

## Task 4: Message Bubble

`apps/web/src/components/chat/message-bubble.tsx`:
```tsx
'use client'
import { CitationBadge } from './citation-badge'
import { InlineChart } from './inline-chart'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
```

---

## Task 5: Chat Input

`apps/web/src/components/chat/chat-input.tsx`:
```tsx
'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizonal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  return (
    <div className="flex gap-2 items-end p-4 border-t bg-background">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your business data..."
        rows={1}
        disabled={disabled}
        className="resize-none min-h-[44px] max-h-40 overflow-y-auto"
      />
      <Button onClick={handleSend} disabled={!value.trim() || disabled}
        className="h-11 w-11 p-0 bg-blue-600 hover:bg-blue-700 shrink-0" aria-label="Send message">
        <SendHorizonal size={16} className="text-white" />
      </Button>
    </div>
  )
}
```

Note: shadcn Textarea needs to be added:
```bash
cd apps/web && pnpm dlx shadcn@latest add textarea
```

---

## Task 6: Session Sidebar

`apps/web/src/components/chat/session-sidebar.tsx`:
```tsx
'use client'
import { MessageSquareText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Session { id: string; title: string; createdAt: string }

interface SessionSidebarProps {
  sessions: Session[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}

export function SessionSidebar({ sessions, activeId, onSelect, onNew }: SessionSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col shrink-0">
      <div className="p-3 border-b">
        <Button onClick={onNew} variant="outline" size="sm" className="w-full gap-2">
          <Plus size={14} /> New conversation
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)}
            className={cn(
              'w-full text-left rounded-lg px-3 py-2.5 hover:bg-muted transition-colors',
              activeId === s.id && 'bg-muted font-medium'
            )}>
            <div className="flex items-center gap-2">
              <MessageSquareText size={13} className="text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{s.title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 pl-5">
              {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 7: Follow-up Chips

`apps/web/src/components/chat/follow-up-chips.tsx`:
```tsx
interface FollowUpChipsProps { questions: string[]; onSelect: (q: string) => void }

export function FollowUpChips({ questions, onSelect }: FollowUpChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map(q => (
        <button key={q} onClick={() => onSelect(q)}
          className="text-xs bg-muted hover:bg-muted/80 border rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground">
          {q}
        </button>
      ))}
    </div>
  )
}
```

---

## Task 8: Assemble Ask AI Page

`apps/web/src/app/(dashboard)/ask/page.tsx`:
```tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { SessionSidebar } from '@/components/chat/session-sidebar'
import { MessageBubble } from '@/components/chat/message-bubble'
import { ChatInput } from '@/components/chat/chat-input'
import { FollowUpChips } from '@/components/chat/follow-up-chips'
import { ScrollArea } from '@/components/ui/scroll-area'
import { exampleQuestions, getAIResponse } from '@/lib/mock-ai-responses'
import { Sparkles } from 'lucide-react'
import type { AIResponse } from '@/lib/mock-ai-responses'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  aiData?: AIResponse
}

interface Session {
  id: string
  title: string
  createdAt: string
  messages: Message[]
}

const initialSessions: Session[] = [
  { id: 'default', title: 'New conversation', createdAt: new Date().toISOString(), messages: [] },
]

export default function AskAIPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [activeId, setActiveId] = useState('default')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const active = sessions.find(s => s.id === activeId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active.messages, streaming])

  async function handleSend(message: string) {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: message }
    const placeholderId = crypto.randomUUID()
    const placeholder: Message = { id: placeholderId, role: 'assistant', content: '' }

    setSessions(prev => prev.map(s => s.id === activeId
      ? { ...s, title: s.messages.length === 0 ? message.slice(0, 40) : s.title, messages: [...s.messages, userMsg, placeholder] }
      : s
    ))
    setStreaming(true)

    await new Promise(r => setTimeout(r, 1200))
    const response = getAIResponse(message)

    setSessions(prev => prev.map(s => s.id === activeId
      ? { ...s, messages: s.messages.map(m => m.id === placeholderId
          ? { ...m, content: response.text, aiData: response }
          : m
        )}
      : s
    ))
    setStreaming(false)
  }

  function handleNew() {
    const id = crypto.randomUUID()
    setSessions(prev => [...prev, { id, title: 'New conversation', createdAt: new Date().toISOString(), messages: [] }])
    setActiveId(id)
  }

  const lastAssistantMsg = [...active.messages].reverse().find(m => m.role === 'assistant')

  return (
    <div className="-m-6 h-[calc(100vh-4rem)] flex">
      <SessionSidebar sessions={sessions} activeId={activeId} onSelect={setActiveId} onNew={handleNew} />

      <div className="flex-1 flex flex-col min-w-0">
        <ScrollArea className="flex-1 p-6">
          {active.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Ask anything about your business</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                I have access to your revenue, customers, support tickets, and sales pipeline data.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {exampleQuestions.map(q => (
                  <button key={q} onClick={() => void handleSend(q)}
                    className="text-sm bg-muted hover:bg-muted/80 border rounded-full px-4 py-2 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {active.messages.map((msg, i) => (
                <div key={msg.id}>
                  <MessageBubble
                    role={msg.role} content={msg.content} aiData={msg.aiData}
                    isStreaming={streaming && i === active.messages.length - 1 && msg.role === 'assistant'}
                  />
                  {msg.role === 'assistant' && msg.aiData && !streaming && i === active.messages.length - 1 && (
                    <div className="pl-11 mt-2">
                      <FollowUpChips questions={msg.aiData.followUps} onSelect={q => void handleSend(q)} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        <ChatInput onSend={q => void handleSend(q)} disabled={streaming} />
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add apps/web/src/app/\(dashboard\)/ask apps/web/src/components/chat apps/web/src/lib/mock-ai-responses.ts
git commit -m "feat: build Ask AI chat interface with streaming simulation, citations, and follow-up chips"
```
