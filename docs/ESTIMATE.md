# DecisionOS — Development Estimate

> **Project:** DecisionOS — Enterprise AI Decision Intelligence SaaS
> **Prototype status:** Frontend complete (10 phases, all routes verified)
> **Delivery model:** End-to-end AI-assisted development (Claude Code)
> **Prepared:** June 2026

---

## Summary

| Item | Detail |
|---|---|
| Total development | ~12 weeks (AI-assisted) |
| Traditional equivalent | ~22–26 weeks |
| AI speed advantage | ~45–50% faster |
| Monthly infra cost (launch) | ~$150–300/month |
| Monthly infra cost (scale, 500+ users) | ~$600–1,200/month |
| One-time setup costs | ~$0–50 |
| LLM API cost | Usage-based (estimated below) |

---

## Phase Breakdown

### ✅ Phase 0 — Frontend Prototype (COMPLETE)

| Deliverable | Status |
|---|---|
| Next.js 14 App Router, Turborepo monorepo | Done |
| All 11 routes (Command Center, Ask AI, Dashboards, Insights, Recommendations, Data Sources, KPIs, Workflows, Admin, Auth) | Done |
| shadcn/ui component library, dark/light mode | Done |
| Mock data layer (static fixtures) | Done |
| Chrome MCP visual verification | Done |
| Deployed to Vercel | Done |

**Effort:** 10 SDD phases · All reviewer-approved

---

### Phase 1 — Backend Foundation

**Scope:** Auth, database, multi-tenant API, project scaffolding

| Task | AI Estimate | Traditional |
|---|---|---|
| PostgreSQL schema design (tenants, users, data_sources, kpis, insights, recommendations, tasks) | 2 days | 4 days |
| Supabase project setup + Row Level Security policies | 1 day | 3 days |
| Auth (Supabase Auth — email/password + OAuth) | 1 day | 3 days |
| Multi-tenant middleware (tenant_id scoping on every query) | 2 days | 4 days |
| REST API layer (Next.js API Routes or FastAPI) | 2 days | 5 days |
| Zustand auth store → real JWT session | 1 day | 2 days |

**Phase total:** ~9 days AI · ~21 days traditional

---

### Phase 2 — File Ingestion Pipeline

**Scope:** CSV/Excel upload → parse → store → index for AI queries

| Task | AI Estimate | Traditional |
|---|---|---|
| File upload endpoint (multipart, S3/Supabase Storage) | 1 day | 3 days |
| CSV + Excel parser (Papa Parse / xlsx) | 1 day | 2 days |
| Schema inference (auto-detect columns + types) | 2 days | 4 days |
| Data normalization + storage (PostgreSQL tables per source) | 1 day | 3 days |
| Upload wizard → real API integration | 1 day | 2 days |

**Phase total:** ~6 days AI · ~14 days traditional

---

### Phase 3 — Data Connectors

**Scope:** OAuth integrations + scheduled sync jobs for CRM/DB sources

| Connector | Tasks | AI Estimate | Traditional |
|---|---|---|---|
| **Salesforce** | OAuth 2.0 flow, SOQL queries, object sync (Contacts, Opportunities, Accounts), webhook | 3 days | 7 days |
| **HubSpot** | OAuth 2.0, REST API v3, Deals/Contacts/Companies sync, incremental updates | 3 days | 6 days |
| **Google Sheets** | OAuth 2.0, Sheets API v4, live range sync, change detection | 2 days | 4 days |
| **PostgreSQL** | Direct connection config, schema browsing, table selection, scheduled pull | 2 days | 4 days |
| **Sync scheduler** | Background jobs (cron via Vercel Cron or BullMQ on Railway), retry logic, status tracking | 2 days | 5 days |
| **Connector UI wiring** | Connect button → real OAuth redirect flow | 1 day | 2 days |

**Phase total:** ~13 days AI · ~28 days traditional

---

### Phase 4 — AI / LLM Engine

**Scope:** Real AI reasoning over ingested data — replaces all mock responses

| Task | AI Estimate | Traditional |
|---|---|---|
| Vector embeddings pipeline (pgvector in Supabase — no extra vendor needed) | 2 days | 5 days |
| RAG retrieval — query → embed → similarity search → context window | 2 days | 6 days |
| LLM router (Anthropic Claude claude-sonnet-4-6 primary, GPT-4o fallback) | 1 day | 2 days |
| Prompt engineering — query decomposition, SQL generation, citation extraction | 3 days | 7 days |
| Streaming response (Server-Sent Events → existing chat UI) | 1 day | 2 days |
| AI Executive Summary generator (scheduled, per-tenant) | 2 days | 4 days |
| Insight + Recommendation auto-generation (LLM + rule engine) | 3 days | 7 days |

**Phase total:** ~14 days AI · ~33 days traditional

---

### Phase 5 — Frontend → Backend Integration

**Scope:** Replace all mock fixtures with live API calls

| Task | AI Estimate | Traditional |
|---|---|---|
| TanStack Query hooks for all endpoints | 2 days | 4 days |
| Real KPI computation (SQL aggregates per tenant) | 2 days | 4 days |
| Real dashboard charts (live data → Recharts) | 1 day | 2 days |
| Notification system (real-time via Supabase Realtime) | 1 day | 3 days |
| Workflow / task status persistence | 1 day | 2 days |

**Phase total:** ~7 days AI · ~15 days traditional

---

### Phase 6 — Production Hardening

**Scope:** Security, performance, observability

| Task | AI Estimate | Traditional |
|---|---|---|
| API rate limiting + abuse protection | 1 day | 2 days |
| Error boundaries + logging (Sentry) | 1 day | 2 days |
| Performance (caching layer — Upstash Redis for query results) | 1 day | 3 days |
| Security audit (SQL injection, XSS, OWASP headers) | 1 day | 3 days |
| Tenant data isolation audit (RLS verification) | 1 day | 2 days |

**Phase total:** ~5 days AI · ~12 days traditional

---

### Phase 7 — QA, CI/CD & Deployment

| Task | AI Estimate | Traditional |
|---|---|---|
| Unit + integration tests (Vitest) | 2 days | 5 days |
| E2E tests (Playwright — critical paths: login, ask AI, data sync) | 2 days | 5 days |
| GitHub Actions CI pipeline | 1 day | 2 days |
| Production environment setup (Vercel + Railway + Supabase) | 1 day | 2 days |
| Custom domain, SSL, env var management | 0.5 day | 1 day |

**Phase total:** ~6.5 days AI · ~15 days traditional

---

## Total Development Timeline

| Phase | AI-Assisted | Traditional |
|---|---|---|
| ✅ 0 — Frontend Prototype | Complete | — |
| 1 — Backend Foundation | 9 days | 21 days |
| 2 — File Ingestion | 6 days | 14 days |
| 3 — Data Connectors | 13 days | 28 days |
| 4 — AI/LLM Engine | 14 days | 33 days |
| 5 — Frontend Integration | 7 days | 15 days |
| 6 — Production Hardening | 5 days | 12 days |
| 7 — QA & Deployment | 6.5 days | 15 days |
| **TOTAL** | **~60 days (12 weeks)** | **~138 days (28 weeks)** |

> AI-assisted development delivers the same output in ~43% of traditional time.
> Assumes 5-day work weeks, single developer + AI pair.

---

## Infrastructure & Monthly Costs

### Core Infrastructure

| Service | Purpose | Plan | Monthly Cost |
|---|---|---|---|
| **Vercel** | Frontend hosting, edge functions, cron | Pro | $20 |
| **Supabase** | PostgreSQL + Auth + Storage + Realtime + pgvector | Pro | $25 |
| **Railway** | Background job worker (sync scheduler, ingestion queue) | Starter | $5–20 |
| **Upstash Redis** | Query result caching, rate limiting | Pay-as-you-go | $0–15 |
| **Sentry** | Error monitoring | Developer (free tier) | $0 |
| **GitHub** | Source control, CI/CD Actions | Free | $0 |
| **Total infra** | | | **$50–80/month** |

---

### LLM API Costs (Usage-Based)

| Provider | Model | Use Case | Estimated Cost |
|---|---|---|---|
| **Anthropic Claude** | claude-sonnet-4-6 | Ask AI queries, insight generation | ~$3 / 1M input tokens · ~$15 / 1M output tokens |
| **Anthropic Claude** | claude-haiku-4-5 | Bulk summarisation, scheduled reports | ~$0.25 / 1M input tokens · ~$1.25 / 1M output tokens |

**Estimated monthly LLM spend by usage tier:**

| Users | Queries/Day | Est. Monthly LLM Cost |
|---|---|---|
| 10 (pilot) | 50 | ~$15–30 |
| 50 (early SaaS) | 300 | ~$60–120 |
| 200 (growth) | 1,500 | ~$200–400 |
| 500+ (scale) | 5,000 | ~$600–1,000 |

> Costs drop significantly if caching is applied (repeated queries for same tenant data return cached LLM output via Redis — estimated 40–60% cache hit rate in production).

---

### Third-Party Connector Costs

| Connector | API Access Cost | Notes |
|---|---|---|
| **Salesforce** | Free | Requires a Connected App (OAuth) in client's Salesforce org. No licensing cost for API access. |
| **HubSpot** | Free | Private App with scoped API token. No cost for API reads. |
| **Google Sheets** | Free | Google Cloud project, Sheets API v4. Free within 300 requests/min. |
| **PostgreSQL** | Free | Direct TCP connection. No third-party cost — client provides credentials. |
| **Stripe** *(future)* | Free | Read-only API key. No per-request cost. |
| **Zendesk** *(future)* | Free | API token from client's Zendesk account. |
| **Total connector cost** | | **$0/month** (connectors use client's own SaaS accounts) |

---

### Optional / Recommended Additions

| Service | Purpose | Cost |
|---|---|---|
| **Cloudflare** | CDN, DDoS protection, WAF | Free tier sufficient |
| **Resend** | Transactional email (alerts, invites) | Free up to 3,000/month |
| **PostHog** | Product analytics (feature usage tracking) | Free up to 1M events |
| **Loops.so** | User onboarding email sequences | $49/month (optional) |

---

## Total Monthly Cost Summary

| Scale | Infra | LLM API | Total/Month |
|---|---|---|---|
| Pilot (10 users) | $50–80 | $15–30 | **~$65–110** |
| Early SaaS (50 users) | $50–80 | $60–120 | **~$110–200** |
| Growth (200 users) | $80–150 | $200–400 | **~$280–550** |
| Scale (500+ users) | $150–300 | $600–1,000 | **~$750–1,300** |

---

## AI Development Stack

All phases will be implemented using **Claude Code (claude-sonnet-4-6)** with the Subagent-Driven Development (SDD) methodology already used for the prototype:

| Tool | Role |
|---|---|
| Claude Code (claude-sonnet-4-6) | Primary implementer + reviewer per phase |
| Subagent-Driven Development | Fresh implementer + reviewer per task — same methodology used for frontend |
| GitHub Actions | CI: type-check, lint, test on every PR |
| Vercel Preview Deployments | Every PR gets a preview URL for visual QA |
| Chrome MCP | Visual verification after each phase (same as prototype) |

**AI development advantages used:**
- Parallel subagent dispatch for independent tasks
- Task reviewer catches spec gaps before merge
- No context pollution between phases
- Automatic type-checking and linting in CI

---

## Risk & Contingency

| Risk | Likelihood | Mitigation |
|---|---|---|
| Salesforce/HubSpot OAuth complexity (sandbox vs production scopes) | Medium | Budget 1 extra day per connector for OAuth edge cases |
| LLM response quality on client's specific data | Medium | Prompt engineering iteration sprint (3 days buffer) |
| Supabase RLS policy edge cases in multi-tenant setup | Low | Dedicated RLS audit in Phase 6 |
| Vercel cold-start latency on AI streaming routes | Low | Move LLM calls to Railway worker if needed |
| Client data schema unpredictability | High | Schema inference engine (Phase 2) handles this; manual override UI as fallback |

**Recommended buffer:** +10% on total timeline (~6 additional days) for unknowns.

---

## Deliverables at Each Phase Completion

| Phase | Client-Visible Deliverable |
|---|---|
| Phase 1 | Working login with real user accounts; tenant isolation |
| Phase 2 | Upload a CSV → see it appear in Data Sources → Ask AI a question about it |
| Phase 3 | Connect Salesforce → data syncs → appears in Ask AI |
| Phase 4 | Ask AI returns real answers with SQL citations from live data |
| Phase 5 | All dashboard KPIs, charts, insights driven by live data |
| Phase 6 | Security report + performance benchmarks |
| Phase 7 | Full test coverage report + production URL on custom domain |

---

*Estimate prepared using DecisionOS frontend prototype as the baseline. All phase estimates assume AI-assisted development with Claude Code. Actual timelines may vary based on client data complexity and connector availability.*
