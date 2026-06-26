# DecisionOS Frontend Prototype — Implementation Plan Index

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute each phase plan in order.

**Goal:** Build a fully working, enterprise-grade frontend prototype for DecisionOS with realistic mock data — no backend required.

**Architecture:** Next.js 14 (App Router) + TypeScript + shadcn/ui + Tailwind CSS + Recharts + Zustand + TanStack Query (mock adapters). All data served from static mock fixtures in `lib/mock-data/`.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS 3.4, shadcn/ui, Recharts, ECharts, TanStack Query 5, Zustand 4, Framer Motion, cmdk, next-themes, React Hook Form + Zod

## Global Constraints

- Node.js ≥ 20
- pnpm ≥ 9 as package manager
- TypeScript strict mode enabled
- All components must support dark mode via `dark:` Tailwind variants
- Primary color: `#1B2A4A` (Navy), Accent: `#2563EB` (Blue)
- Font: Inter (Google Fonts)
- WCAG 2.1 AA — all interactive elements need `aria-label`, visible focus rings
- No `any` TypeScript types
- All pages must have loading skeletons and empty states
- App lives at `apps/web/` in the monorepo root `/Users/yashcomputers/Desktop/Sandeep/Projects/DecisionOS/`

## Phase Files (execute in order)

| File | Contents |
|---|---|
| [01-scaffold.md](./01-scaffold.md) | Monorepo init, Next.js setup, Tailwind, shadcn/ui, design tokens |
| [02-mock-data.md](./02-mock-data.md) | Mock data layer — 5 demo datasets + API hook wrappers |
| [03-auth-pages.md](./03-auth-pages.md) | Login, forgot-password, reset-password pages |
| [04-layout.md](./04-layout.md) | Sidebar, header, notification bell, command palette |
| [05-command-center.md](./05-command-center.md) | Executive Command Center (home dashboard) |
| [06-ask-ai.md](./06-ask-ai.md) | Ask AI chat interface with streaming simulation |
| [07-dashboards.md](./07-dashboards.md) | Dashboard list + individual dashboard with widgets |
| [08-insights.md](./08-insights.md) | Insights page with filters and cards |
| [09-recommendations.md](./09-recommendations.md) | Recommendations + approve/reject flow |
| [10-data-sources.md](./10-data-sources.md) | Data sources list + CSV upload wizard |
| [11-workflows.md](./11-workflows.md) | Tasks, approvals, workflow tracking |
| [12-admin.md](./12-admin.md) | Admin console — users, roles, audit logs, LLM settings |
| [13-polish.md](./13-polish.md) | Dark mode, animations, responsive, a11y, Lighthouse pass |
