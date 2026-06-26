import type { SalesDeal } from '@/lib/types'

export const mockPipeline: SalesDeal[] = [
  { id: 'd1', companyName: 'Quantum Systems', stage: 'Proposal', value: 45000, expectedCloseDate: '2026-07-30', owner: 'Alex Park', probability: 65 },
  { id: 'd2', companyName: 'Meridian Health', stage: 'Negotiation', value: 82000, expectedCloseDate: '2026-07-15', owner: 'Sarah Chen', probability: 80 },
  { id: 'd3', companyName: 'BlueRock Capital', stage: 'Discovery', value: 28000, expectedCloseDate: '2026-08-30', owner: 'Alex Park', probability: 40 },
  { id: 'd4', companyName: 'Synergy Corp', stage: 'Closed-Won', value: 55000, expectedCloseDate: '2026-06-20', owner: 'James Wilson', probability: 100 },
  { id: 'd5', companyName: 'TerraData', stage: 'Prospecting', value: 15000, expectedCloseDate: '2026-09-30', owner: 'Emily Ross', probability: 20 },
  { id: 'd6', companyName: 'Apex Ventures', stage: 'Proposal', value: 38000, expectedCloseDate: '2026-07-20', owner: 'Sarah Chen', probability: 55 },
  { id: 'd7', companyName: 'ClearPath AI', stage: 'Negotiation', value: 120000, expectedCloseDate: '2026-07-10', owner: 'James Wilson', probability: 75 },
  { id: 'd8', companyName: 'Nexus Labs', stage: 'Closed-Lost', value: 32000, expectedCloseDate: '2026-06-01', owner: 'Emily Ross', probability: 0 },
]
