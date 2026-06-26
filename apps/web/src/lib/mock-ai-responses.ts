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
  if (lower.includes('revenue') || lower.includes('mrr') || lower.includes('sales by month')) return mockAIResponses['revenue']!
  if (lower.includes('churn') || lower.includes('at risk') || lower.includes('renewal') || lower.includes('renew')) return mockAIResponses['churn']!
  if (lower.includes('pipeline') || lower.includes('deal') || lower.includes('sales')) return mockAIResponses['pipeline']!
  return mockAIResponses['default']!
}

export const exampleQuestions = [
  'Show sales by month for the last 6 months',
  'Which customers are at risk of not renewing?',
  'Why did revenue drop last month?',
  'What is the current pipeline value?',
  'Show overdue invoices',
  'Compare this quarter\'s churn to last quarter',
]
