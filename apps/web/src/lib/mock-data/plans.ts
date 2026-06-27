export interface SubscriptionPlan {
  id: string
  name: 'Trial' | 'Starter' | 'Professional' | 'Enterprise'
  priceMonthly: number
  maxUsers: number | null
  maxDataSources: number | null
  maxAiQueriesMonth: number | null
  allowedProviders: string[]
  color: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_trial',
    name: 'Trial',
    priceMonthly: 0,
    maxUsers: 3,
    maxDataSources: 1,
    maxAiQueriesMonth: 50,
    allowedProviders: ['GPT-4o-mini'],
    color: 'amber',
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    priceMonthly: 199,
    maxUsers: 10,
    maxDataSources: 3,
    maxAiQueriesMonth: 300,
    allowedProviders: ['GPT-4o', 'Claude Haiku'],
    color: 'green',
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    priceMonthly: 599,
    maxUsers: 25,
    maxDataSources: 6,
    maxAiQueriesMonth: 1500,
    allowedProviders: ['Claude Sonnet', 'GPT-4o', 'Gemini Pro'],
    color: 'blue',
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    priceMonthly: 1199,
    maxUsers: null,
    maxDataSources: null,
    maxAiQueriesMonth: null,
    allowedProviders: ['Claude Sonnet', 'Claude Opus', 'GPT-4o', 'GPT-4o-mini', 'Gemini Pro', 'Ollama (self-hosted)'],
    color: 'violet',
  },
]

export function getPlanByName(name: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find(p => p.name === name)
}
