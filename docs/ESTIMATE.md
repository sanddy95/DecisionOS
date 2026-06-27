# DecisionOS — Development Estimate

> **Project:** DecisionOS — Enterprise AI Decision Intelligence SaaS
> **Prototype status:** Frontend complete (10 phases, all routes verified)
> **Delivery model:** End-to-end AI-assisted development (Claude Code)
> **Prepared:** June 2026

---

## Tech Stack Decision: Real PostgreSQL + Custom Auth

We are **not** using Supabase. All services are self-owned and self-managed:

| Layer | Choice | Reason |
|---|---|---|
| **Database** | PostgreSQL on **Neon** (serverless) or **Railway** | Real Postgres, no vendor lock-in, full SQL control |
| **Auth** | **Auth.js v5** (NextAuth) — Credentials + bcrypt + JWT | Industry standard for Next.js, no third-party auth vendor |
| **File Storage** | **Cloudflare R2** | S3-compatible, $0.015/GB, no egress fees |
| **Real-time** | **Server-Sent Events** (built into Next.js) | No extra service, sufficient for notifications + AI streaming |
| **Vector search** | **pgvector** extension on same Postgres DB | No extra vendor, runs alongside app data |
| **Background jobs** | **pg-boss** (Postgres-native queue) or **BullMQ on Railway** | Leverages existing Postgres, no Redis needed for jobs |
| **Caching** | **Upstash Redis** | Query result cache, rate limiting |
| **API** | **Next.js API Routes** (same monorepo) | No separate service needed, deploy with frontend |

---

## Summary

| Item | Detail |
|---|---|
| Total development | ~12 weeks AI-assisted (full scope) |
| MVP (3-week sprint) | Backend + 1 connector + LLM working end-to-end |
| Traditional equivalent | ~26–28 weeks |
| AI speed advantage | ~45–50% faster |
| Monthly infra cost (launch) | ~$45–75/month |
| Monthly infra cost (scale, 500+ users) | ~$200–500/month |
| One-time setup costs | ~$0 |
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
| Deployed to Vercel (github.com/sanddy95/DecisionOS) | Done |

**Effort:** 10 SDD phases · All reviewer-approved

---

### Phase 1 — Backend Foundation

**Scope:** Database schema, custom auth, multi-tenant API scaffolding

| Task | AI Estimate | Traditional |
|---|---|---|
| PostgreSQL schema design (tenants, users, sessions, data_sources, kpis, insights, recommendations, tasks, audit_logs) | 2 days | 4 days |
| Neon/Railway Postgres setup + migrations (Drizzle ORM) | 1 day | 2 days |
| **Auth.js v5** setup — Credentials provider, bcrypt password hashing, JWT sessions | 1.5 days | 4 days |
| Session middleware (JWT validation on every API route) | 1 day | 2 days |
| Multi-tenant middleware (tenant_id scoping on every DB query) | 2 days | 4 days |
| Next.js API Routes scaffolding (versioned, typed with Zod) | 1 day | 3 days |
| Zustand auth store → real JWT session (replace mock cookie) | 0.5 day | 1 day |

**Phase total:** ~9 days AI · ~20 days traditional

**Auth flow detail:**
- User logs in → Auth.js Credentials provider → bcrypt verify password → issue JWT (httpOnly cookie, 7-day expiry)
- Next.js middleware reads JWT → extracts `userId` + `tenantId` → passes to API routes via request header
- All API routes validate JWT; no request touches DB without verified `tenantId`

---

### Phase 2 — File Ingestion Pipeline

**Scope:** CSV/Excel upload → parse → store → index for AI queries

| Task | AI Estimate | Traditional |
|---|---|---|
| File upload endpoint (multipart → Cloudflare R2 via S3-compatible API) | 1 day | 3 days |
| CSV parser (Papa Parse) + Excel parser (xlsx library) | 1 day | 2 days |
| Schema inference (auto-detect column names + data types) | 2 days | 4 days |
| Data normalization → typed Postgres tables per source (dynamic DDL) | 1 day | 3 days |
| Upload wizard → real API integration (existing frontend) | 1 day | 2 days |
| Ingestion history logging | 0.5 day | 1 day |

**Phase total:** ~6.5 days AI · ~15 days traditional

---

### Phase 3 — Data Connectors

**Scope:** OAuth integrations + sync jobs for CRM/DB sources

| Connector | Tasks | AI Estimate | Traditional |
|---|---|---|---|
| **Salesforce** | OAuth 2.0 PKCE flow, SOQL queries, Contacts/Opportunities/Accounts sync, incremental updates via `SystemModstamp` | 3 days | 7 days |
| **HubSpot** | OAuth 2.0, REST API v3, Deals/Contacts/Companies/Engagements sync, delta sync via `lastModifiedDate` | 3 days | 6 days |
| **Google Sheets** | OAuth 2.0 (Google Cloud project), Sheets API v4, range polling, change detection via `revision` | 2 days | 4 days |
| **PostgreSQL** | Direct connection config UI, pg connection test, table/column browser, scheduled SELECT pull | 2 days | 4 days |
| **Sync scheduler** | pg-boss job queue (runs in same Postgres), cron scheduling per source, retry + backoff, sync status updates | 2 days | 5 days |
| **Connector UI wiring** | Connect button → real OAuth redirect → callback → store encrypted credentials | 1 day | 2 days |

**Phase total:** ~13 days AI · ~28 days traditional

**Credential storage:** OAuth tokens and DB credentials stored encrypted (`AES-256-GCM`) in Postgres, never in env vars or logs.

---

### Phase 4 — AI / LLM Engine

**Scope:** Real AI reasoning over ingested data — replaces all mock responses

| Task | AI Estimate | Traditional |
|---|---|---|
| pgvector extension on Postgres (no new service) — embedding schema | 1 day | 3 days |
| Embedding pipeline — chunk ingested rows → `text-embedding-3-small` (OpenAI) → store vectors | 2 days | 5 days |
| RAG retrieval — natural language query → embed → cosine similarity search → context assembly | 2 days | 6 days |
| SQL generation — LLM converts query intent to SQL, executes against tenant's data, returns structured result | 2 days | 5 days |
| LLM router — Anthropic Claude (claude-sonnet-4-6 for complex, claude-haiku-4-5 for bulk) | 1 day | 2 days |
| Prompt engineering — query decomposition, citation extraction, confidence scoring | 3 days | 7 days |
| Server-Sent Events streaming — AI response streams to existing chat UI in real time | 1 day | 2 days |
| AI Executive Summary generator — scheduled nightly per tenant, stored in DB | 1 day | 3 days |
| Insight + Recommendation auto-generation (LLM analysis + threshold rule engine) | 2 days | 5 days |

**Phase total:** ~15 days AI · ~38 days traditional

---

### Phase 5 — Frontend → Backend Integration

**Scope:** Replace all mock fixtures with live API calls

| Task | AI Estimate | Traditional |
|---|---|---|
| TanStack Query hooks for all endpoints (users, kpis, insights, recommendations, tasks) | 2 days | 4 days |
| Real KPI computation (SQL aggregates per tenant, configurable formulas) | 2 days | 4 days |
| Real dashboard charts (live data → Recharts via API) | 1 day | 2 days |
| Notification system (SSE endpoint → existing notification bell) | 1 day | 2 days |
| Workflow / task CRUD persistence | 1 day | 2 days |
| Admin Console — real user management, role assignment, LLM config per tenant | 1 day | 2 days |

**Phase total:** ~8 days AI · ~16 days traditional

---

### Phase 6 — Production Hardening

**Scope:** Security, performance, observability

| Task | AI Estimate | Traditional |
|---|---|---|
| API rate limiting (Upstash Redis sliding window, per user + per tenant) | 1 day | 2 days |
| Error boundaries + structured logging (Sentry + Pino logger) | 1 day | 2 days |
| Query result caching (Upstash Redis, 5-min TTL for repeated AI queries) | 1 day | 3 days |
| Security audit — SQL injection (parameterized queries audit), XSS, OWASP headers, CSRF | 1 day | 3 days |
| Multi-tenant data isolation audit — every query has `WHERE tenant_id = ?`, pen-test cross-tenant access | 1 day | 3 days |
| Password policy enforcement (min length, bcrypt cost factor) + account lockout | 0.5 day | 1 day |

**Phase total:** ~5.5 days AI · ~14 days traditional

---

### Phase 7 — QA, CI/CD & Deployment

| Task | AI Estimate | Traditional |
|---|---|---|
| Unit + integration tests (Vitest — API routes, auth middleware, data ingestion) | 2 days | 5 days |
| E2E tests (Playwright — login, upload CSV, ask AI, connector OAuth flow) | 2 days | 5 days |
| GitHub Actions CI pipeline (type-check, lint, test, preview deploy on PR) | 1 day | 2 days |
| Production environment setup (Vercel + Neon/Railway + Cloudflare R2) | 0.5 day | 1 day |
| Custom domain, SSL (Vercel handles), env var management | 0.5 day | 1 day |
| DB migration strategy (Drizzle migrate on deploy, zero-downtime) | 0.5 day | 1 day |

**Phase total:** ~6.5 days AI · ~15 days traditional

---

## Total Development Timeline

| Phase | AI-Assisted | Traditional |
|---|---|---|
| ✅ 0 — Frontend Prototype | Complete | — |
| 1 — Backend Foundation (Postgres + Auth.js) | 9 days | 20 days |
| 2 — File Ingestion (R2 + parser) | 6.5 days | 15 days |
| 3 — Data Connectors (4 connectors + scheduler) | 13 days | 28 days |
| 4 — AI/LLM Engine (pgvector + RAG + streaming) | 15 days | 38 days |
| 5 — Frontend Integration | 8 days | 16 days |
| 6 — Production Hardening | 5.5 days | 14 days |
| 7 — QA & Deployment | 6.5 days | 15 days |
| **TOTAL** | **~64 days (~13 weeks)** | **~146 days (~29 weeks)** |

> AI-assisted development delivers the same output in ~44% of traditional time.
> Assumes 5-day work weeks, 1 developer + Claude Code AI pair.

---

## 3-Week MVP Scope

For a fast client demo / pilot delivery:

| Week | Phases | Deliverable |
|---|---|---|
| **Week 1** | Phase 1 + Phase 2 | Real login (Auth.js + Postgres), CSV upload → stored in DB, Ask AI works on uploaded data |
| **Week 2** | Phase 4 (core RAG + streaming) + Phase 5 (partial) | Ask AI returns real answers from real data, streaming responses, KPI cards live |
| **Week 3** | Phase 3 (HubSpot only) + Phase 7 (deployment) | 1 live CRM connected, production URL on custom domain |

**MVP cuts:**
- Salesforce, Google Sheets, PostgreSQL connector deferred to sprint 2
- No Redis caching (direct LLM calls)
- No Playwright E2E tests (manual QA only)
- Multi-tenancy: single tenant, multiple users (full multi-tenant in sprint 2)
- No pg-boss scheduler (manual sync trigger only)

**Full product:** Sprints 2–3 (remaining 9 weeks) complete all connectors, multi-tenancy, caching, and test coverage.

---

## Infrastructure & Monthly Costs

### Core Infrastructure

| Service | Purpose | Plan | Monthly Cost |
|---|---|---|---|
| **Vercel** | Frontend + API Routes hosting, preview deploys | Pro | $20 |
| **Neon** (Postgres) | Primary database + pgvector | Free → Launch ($19) | $0–19 |
| **Cloudflare R2** | File storage (CSV/Excel uploads) | Pay-as-you-go | $0–5 |
| **Upstash Redis** | API rate limiting + LLM response cache | Pay-as-you-go | $0–10 |
| **Railway** | Background sync worker (pg-boss jobs) | Starter | $5–10 |
| **Sentry** | Error monitoring | Developer (free) | $0 |
| **GitHub** | Source control + CI/CD Actions | Free | $0 |
| **Total infra** | | | **$25–64/month** |

> No Supabase. No Auth0/Clerk. No third-party auth vendor fees.

---

### Auth Cost: $0

Auth.js v5 is open-source. Auth is handled entirely within the Next.js app using:
- `bcryptjs` for password hashing (npm package, free)
- JWT sessions stored as httpOnly cookies (no external service)
- Postgres `sessions` table for server-side session validation if needed

---

### LLM API Costs (Usage-Based)

| Provider | Model | Use Case | Price |
|---|---|---|---|
| **Anthropic Claude** | claude-sonnet-4-6 | Ask AI queries, insight generation | $3 / 1M input · $15 / 1M output tokens |
| **Anthropic Claude** | claude-haiku-4-5 | Bulk summarisation, scheduled reports | $0.25 / 1M input · $1.25 / 1M output tokens |
| **OpenAI** | text-embedding-3-small | Vector embeddings for RAG | $0.02 / 1M tokens |

**Estimated monthly LLM spend by usage tier:**

| Users | Queries/Day | Est. Monthly LLM Cost |
|---|---|---|
| 10 (pilot) | 50 | ~$10–25 |
| 50 (early SaaS) | 300 | ~$50–100 |
| 200 (growth) | 1,500 | ~$180–350 |
| 500+ (scale) | 5,000 | ~$500–900 |

> Redis caching cuts repeated LLM calls by ~40–60% at scale.

---

### Third-Party Connector Costs

| Connector | API Access Cost | Notes |
|---|---|---|
| **Salesforce** | Free | Connected App in client's Salesforce org. No per-API-call cost. |
| **HubSpot** | Free | Private App with scoped token. Free for API reads. |
| **Google Sheets** | Free | Google Cloud project (free), Sheets API v4, 300 req/min quota. |
| **PostgreSQL** | Free | Direct TCP. Client provides host/credentials. |
| **Stripe** *(future)* | Free | Read-only restricted key from client's Stripe dashboard. |
| **Zendesk** *(future)* | Free | API token from client's Zendesk account. |
| **Total** | | **$0/month** — all connectors use client's own credentials |

---

### Optional Additions

| Service | Purpose | Cost |
|---|---|---|
| **Resend** | Transactional email (password reset, alerts) | Free up to 3,000/month |
| **Cloudflare** | CDN + WAF + DDoS | Free tier sufficient |
| **PostHog** | Product analytics | Free up to 1M events/month |

---

## Total Monthly Cost Summary

| Scale | Infra | LLM API | Total/Month |
|---|---|---|---|
| Pilot (10 users) | $25–45 | $10–25 | **~$35–70** |
| Early SaaS (50 users) | $45–65 | $50–100 | **~$95–165** |
| Growth (200 users) | $65–100 | $180–350 | **~$245–450** |
| Scale (500+ users) | $100–200 | $500–900 | **~$600–1,100** |

> ~35–40% cheaper than the Supabase-based architecture at every tier.

---

## AI Development Stack

| Tool | Role |
|---|---|
| **Claude Code (claude-sonnet-4-6)** | Primary implementer + reviewer per phase |
| **Subagent-Driven Development (SDD)** | Fresh implementer + reviewer per task (same methodology used for frontend) |
| **GitHub Actions** | CI: type-check, lint, Vitest, Playwright on every PR |
| **Vercel Preview Deployments** | Every PR gets a live preview URL for visual QA |
| **Chrome MCP** | Visual verification after each phase |
| **Drizzle ORM** | Type-safe SQL, migration management |

---

## Risk & Contingency

| Risk | Likelihood | Mitigation |
|---|---|---|
| OAuth complexity — Salesforce sandbox vs production scope differences | Medium | Budget 1 extra day per connector for scope debugging |
| Auth.js v5 session edge cases (concurrent requests, session refresh race) | Low | Use database sessions (not JWT) if stateless JWT proves unreliable |
| LLM response quality on client's specific data schema | Medium | 3-day prompt engineering buffer included in Phase 4 |
| pgvector cold query latency on large datasets | Low | Add `ivfflat` index after 100K+ vectors; benchmark before launch |
| Client data schema unpredictability (unusual CRM field names) | High | Schema inference + manual field mapping UI covers this |
| Neon connection limits on free tier | Low | Upgrade to Launch plan ($19/month) if >100 concurrent connections |

**Recommended buffer:** +10% (~6–7 days) for unknowns.

---

## Deliverables at Each Phase Completion

| Phase | Client-Visible Deliverable |
|---|---|
| Phase 1 | Working login (real Postgres users), multi-tenant isolation confirmed |
| Phase 2 | Upload CSV → appears in Data Sources → can query it via Ask AI |
| Phase 3 | Connect HubSpot → data syncs automatically → Ask AI answers from CRM data |
| Phase 4 | Ask AI returns real streaming answers with SQL citations from live data |
| Phase 5 | All dashboard KPIs, charts, insights driven entirely by live data |
| Phase 6 | Security audit report + rate limiting confirmed + performance benchmarks |
| Phase 7 | Full test coverage report + production URL on custom domain |

---

*Estimate prepared using DecisionOS frontend prototype as the baseline. Stack updated to real PostgreSQL (Neon/Railway) + Auth.js v5 — no Supabase. All phase estimates assume AI-assisted development with Claude Code.*
