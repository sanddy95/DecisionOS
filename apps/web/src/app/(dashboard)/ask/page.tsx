'use client'
import { useState, useRef, useEffect } from 'react'
import { SessionSidebar } from '@/components/chat/session-sidebar'
import { MessageBubble } from '@/components/chat/message-bubble'
import { ChatInput } from '@/components/chat/chat-input'
import { FollowUpChips } from '@/components/chat/follow-up-chips'
import { ScrollArea } from '@/components/ui/scroll-area'
import { exampleQuestions, getAIResponse } from '@/lib/mock-ai-responses'
import { Sparkles, Plus } from 'lucide-react'
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

  const active = sessions.find(s => s.id === activeId) ?? sessions[0]!

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

  return (
    <div className="-m-4 md:-m-6 h-[calc(100vh-4rem)] flex">
      <SessionSidebar sessions={sessions} activeId={activeId} onSelect={setActiveId} onNew={handleNew} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only new conversation bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
          <span className="text-xs text-muted-foreground truncate">{active.title}</span>
          <button onClick={handleNew} className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0 ml-2">
            <Plus size={13} /> New
          </button>
        </div>
        <ScrollArea className="flex-1 p-4 md:p-6">
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
                    role={msg.role} content={msg.content}
                    {...(msg.aiData !== undefined ? { aiData: msg.aiData } : {})}
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
