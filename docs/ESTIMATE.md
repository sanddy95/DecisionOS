# DecisionOS — Development Estimate

> **Project:** DecisionOS — Enterprise AI Decision Intelligence SaaS
> **Prototype status:** Frontend complete (10 phases, all routes verified)
> **Delivery model:** End-to-end AI-assisted development (Claude Code)
> **Prepared:** June 2026

---

## Client Requirements (Confirmed)

| Question | Client Answer | Impact |
|---|---|---|
| **Data sources** | Zoho CRM + Custom ERP (both integration + file upload) | Zoho OAuth connector + generic ERP REST/webhook adapter |
| **Connector priority** | Zoho is must-have for launch; others post-launch | Phase 3 focuses on Zoho first |
| **Multi-tenancy** | Yes — each client company gets isolated workspace | Schema-per-tenant from Phase 1 |
| **LLM configuration** | Tenant supplies their own LLM API key; simple wizard-style connection in tenant Admin Console | Plan gates which provider integrations are available; tenant pays LLM costs directly to the provider |
| **Subscription model** | Each tenant subscribes to a plan; plans configured by Platform Admin | Subscription plans enforced at API level; Platform Admin panel manages plan definitions |

---

## Tech Stack Decision: Real PostgreSQL + Custom Auth

We are **not** using Supabase. All services are self-owned and self-managed:

| Layer | Choice | Reason |
|---|---|---|
| **Database** | PostgreSQL on **Neon** (serverless) or **Railway** — **schema-per-tenant** | Real Postgres, strong tenant isolation, easy offboarding, no `tenant_id` column pollution |
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
| Total development | **~12 weeks** AI-assisted (full scope) |
| MVP (3-week sprint) | Backend + Zoho connector + LLM working end-to-end |
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
| PostgreSQL schema design (tenants, users, sessions, data_sources, kpis, insights, recommendations, tasks, audit_logs, llm_configs) | 2 days | 4 days |
| Neon/Railway Postgres setup + migrations (Drizzle ORM) | 0.5 day | 2 days |
| **Auth.js v5** — Credentials provider, bcrypt password hashing, JWT sessions | 1 day | 4 days |
| Session middleware (JWT validation on every API route) | 0.5 day | 2 days |
| Multi-tenant middleware (`tenant_id` scoping on every DB query) | 2 days | 4 days |
| Next.js API Routes scaffolding (versioned, typed with Zod) | 1 day | 3 days |
| Zustand auth store → real JWT session (replace mock cookie) | 0.5 day | 1 day |

**Phase total:** ~7.5 days AI · ~20 days traditional

**Auth flow:**
- Login → Auth.js Credentials → bcrypt verify → JWT issued as httpOnly cookie (7-day expiry)
- Middleware reads JWT → extracts `userId` + `tenantSlug` → sets `search_path = tenant_{slug}` on every DB connection
- Tenant isolation: **schema-per-tenant** (e.g. `acme`, `globaltech`) — each tenant is a completely separate Postgres schema with identical table structure

**Schema-per-tenant rationale:**
- Strong data isolation enforced at DB level — no risk of cross-tenant data leakage via missing WHERE clause
- Easy tenant offboarding: `DROP SCHEMA tenant_slug CASCADE`
- Easy per-tenant backup/restore
- Tenant-specific schema migrations possible
- Works well with Neon's branching feature (branch = tenant schema snapshot)
- Tradeoff: connection pooling needs `search_path` set per connection (handled by middleware); cross-tenant analytics done in a separate `platform` schema

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

**Scope:** Zoho CRM (launch), Custom ERP (launch), plus file-upload sources. Additional connectors post-launch.

| Connector | Tasks | AI Estimate | Traditional | Priority |
|---|---|---|---|---|
| **Zoho CRM** | OAuth 2.0 (Zoho Accounts Server), REST API v7, Contacts/Deals/Accounts/Activities sync, delta sync via `Modified_Time`, field mapping UI | 4 days | 8 days | **Launch** |
| **Custom ERP** | Generic REST adapter (configurable base URL, auth header, endpoint mapping), webhook receiver for push events, field mapper UI, manual sync trigger | 4 days | 9 days | **Launch** |
| **PostgreSQL direct** | Connection config UI, pg test, table/column browser, scheduled SELECT pull | 2 days | 4 days | **Launch** |
| **Google Sheets** | OAuth 2.0 (Google Cloud), Sheets API v4, range polling, revision-based change detection | 2 days | 4 days | Post-launch |
| **Salesforce** | OAuth 2.0 PKCE, SOQL queries, Contacts/Opportunities sync | 3 days | 7 days | Post-launch |
| **Sync scheduler** | pg-boss job queue, cron per source, retry + exponential backoff, sync status in DB | 2 days | 5 days | **Launch** |
| **Connector UI wiring** | Connect button → real OAuth redirect → callback → encrypted credential storage | 1 day | 2 days | **Launch** |

**Launch connectors total:** ~13 days AI · ~28 days traditional
**Post-launch connectors:** ~5 days AI (added in a future sprint)

**Custom ERP note:** Since the ERP is bespoke, we build a generic connector template with:
- Configurable API base URL, auth type (API key / Bearer / Basic)
- JSON field path mapping (drag-and-drop in Admin Console)
- Webhook endpoint for real-time push from ERP
- The client provides ERP API docs; we map fields during sprint

**Credential storage:** OAuth tokens + API keys stored encrypted (`AES-256-GCM`) in Postgres, never in env vars or logs.

---

### Phase 4 — AI / LLM Engine

**Scope:** Real AI reasoning over ingested data + multi-provider LLM switcher per tenant

| Task | AI Estimate | Traditional |
|---|---|---|
| pgvector extension on same Postgres — embedding schema | 0.5 day | 2 days |
| Embedding pipeline — chunk ingested rows → embed via selected provider → store vectors | 2 days | 5 days |
| RAG retrieval — natural language query → embed → cosine similarity → context assembly | 2 days | 6 days |
| SQL generation — LLM converts query intent to SQL → executes → returns structured result + citations | 2 days | 5 days |
| **Multi-provider LLM router** — route to whichever provider the tenant has configured | 2 days | 4 days |
| **LLM provider integrations:** Anthropic Claude, OpenAI GPT-4o, Google Gemini, Ollama (self-hosted) | 2 days | 5 days |
| **LLM Connect wizard** (Admin Console) — provider selector with logos → paste API key (masked) → model selector → instant test connection (real call) → save as default. Multi-provider: tenant can connect OpenAI + Anthropic + Gemini simultaneously and switch per-session | 1 day | 2 days |
| **LLM usage logging** — log every API call in tenant schema (`llm_usage_logs`: timestamp, user_id, provider, model, input_tokens, output_tokens, cost_estimate_usd, query_type). Foundation for tenant usage dashboard | 0.5 day | 1 day |
| Prompt engineering — query decomposition, citation extraction, confidence scoring | 3 days | 7 days |
| Server-Sent Events streaming — AI response streams to existing chat UI in real time | 1 day | 2 days |
| AI Executive Summary generator — scheduled nightly per tenant, stored in DB | 1 day | 3 days |
| Insight + Recommendation auto-generation (LLM analysis + threshold rule engine) | 2 days | 5 days |

**Phase total:** ~19 days AI · ~47 days traditional

**Subscription-gated LLM model:**

Each tenant's subscription plan controls which LLM provider integrations are available and the platform feature limits. **Tenants supply their own API keys and pay LLM costs directly to the provider** — DecisionOS does not intermediate or mark up LLM costs.

| Plan | Price/month | Users | Data Sources | Supported LLM Providers |
|---|---|---|---|---|
| **Trial** | $0 | 3 | 1 | OpenAI (GPT-4o-mini) |
| **Starter** | $199 | 10 | 3 | OpenAI (GPT-4o) + Anthropic (Claude Haiku) |
| **Professional** | $599 | 25 | 6 | OpenAI + Anthropic (Claude Sonnet) + Google Gemini Pro |
| **Enterprise** | $1,199 | Unlimited | Unlimited | All providers + Ollama (self-hosted) + custom model endpoints |

**How it works:**
- Tenant Admin Console → LLM Settings shows only the providers their plan supports
- Tenant pastes their own API key for each provider they want to use → test connection → save
- Tenant can connect multiple providers simultaneously and switch per-session or set a default
- API enforces plan limits: **user count and data source count** only (no query cap — tenant controls their own LLM spend)
- Platform Admin can change a tenant's plan at any time (instant effect)
- New provider = add adapter class (~1 day) + Platform Admin adds it to relevant plans

**Platform Admin plan management:**
- Create / edit / archive plans from Platform Admin → Settings → Subscription Plans
- Configure per plan: price, user limit, data source limit, supported LLM providers (multi-select), feature flags

---

### Phase 5 — Frontend → Backend Integration + Subscription Enforcement

**Scope:** Replace all mock fixtures with live API calls; enforce subscription plan limits at API + UI level

| Task | AI Estimate | Traditional |
|---|---|---|
| TanStack Query hooks for all endpoints (users, kpis, insights, recommendations, tasks) | 2 days | 4 days |
| Real KPI computation (SQL aggregates per tenant, configurable formulas) | 2 days | 4 days |
| Real dashboard charts (live data → Recharts via API) | 1 day | 2 days |
| Notification system (SSE endpoint → existing notification bell) | 1 day | 2 days |
| Workflow / task CRUD persistence | 1 day | 2 days |
| **Subscription enforcement middleware** — check plan limits (user count, data source count) on every relevant API route; return 402 with upgrade prompt when limit hit. Query count no longer enforced — tenant controls their own LLM spend | 1 day | 3 days |
| **Tenant Admin Console — LLM Settings + Usage** — provider connect wizard (plan-gated), usage dashboard: token consumption, estimated cost (input+output tokens × provider pricing), daily query chart, per-user breakdown, CSV export for billing reconciliation | 1 day | 2 days |
| **Platform Admin panel** — plan management (CRUD: price, limits, supported providers), per-tenant plan assignment. No cross-tenant LLM usage tracking needed | 0.5 day | 1 day |

**Phase total:** ~9.5 days AI · ~21 days traditional

---

### Phase 6 — Production Hardening

**Scope:** Security, performance, observability

| Task | AI Estimate | Traditional |
|---|---|---|
| API rate limiting (Upstash Redis sliding window, per user + per tenant) | 1 day | 2 days |
| Error boundaries + structured logging (Sentry + Pino logger) | 1 day | 2 days |
| Query result caching (Upstash Redis, 5-min TTL for repeated AI queries) | 1 day | 3 days |
| Security audit — SQL injection (parameterized queries), XSS, OWASP headers, CSRF | 1 day | 3 days |
| Multi-tenant data isolation audit — cross-tenant access pen-test | 0.5 day | 3 days |
| Password policy + account lockout | 0.5 day | 1 day |

**Phase total:** ~5 days AI · ~14 days traditional

---

### Phase 7 — QA, CI/CD & Deployment

| Task | AI Estimate | Traditional |
|---|---|---|
| Unit + integration tests (Vitest — API routes, auth middleware, data ingestion) | 2 days | 5 days |
| E2E tests (Playwright — login, upload CSV, Zoho connect, ask AI) | 2 days | 5 days |
| GitHub Actions CI pipeline (type-check, lint, test, preview deploy on PR) | 1 day | 2 days |
| Production environment setup (Vercel + Neon/Railway + Cloudflare R2) | 0.5 day | 1 day |
| Custom domain, SSL (Vercel handles), env var management | 0.5 day | 1 day |
| DB migration strategy (Drizzle migrate on deploy, zero-downtime) | 0.5 day | 1 day |

**Phase total:** ~6.5 days AI · ~15 days traditional

> Deployment is simpler without Supabase — no Supabase project config, no RLS verification step, no Supabase CLI in CI.

---

## Total Development Timeline

| Phase | AI-Assisted | Traditional |
|---|---|---|
| ✅ 0 — Frontend Prototype | Complete | — |
| 1 — Backend Foundation (Postgres + Auth.js + schema-per-tenant) | 7.5 days | 20 days |
| 2 — File Ingestion (R2 + parser) | 6.5 days | 15 days |
| 3 — Connectors (Zoho + Custom ERP + PostgreSQL) | 13 days | 28 days |
| 4 — AI/LLM Engine (pgvector + RAG + multi-provider + usage logging) | 19 days | 47 days |
| 5 — Frontend Integration + Subscription Enforcement | 9.5 days | 21 days |
| 6 — Production Hardening | 5 days | 14 days |
| 7 — QA & Deployment | 6.5 days | 15 days |
| **TOTAL** | **~67.5 days (~12–13 weeks)** | **~159 days (~32 weeks)** |

> Client confirmed tenants bring their own LLM API keys (2026-06-30). Query-count enforcement removed; tenant LLM usage dashboard added to Admin Console. Net: -0.5 days vs original estimate.
> Post-launch: Stripe self-serve billing (~3 days), Google Sheets + Salesforce connectors (~5 days).

**Parallelism brings wall-clock to ~12 weeks:** Phases 1+2 can run concurrently (file ingestion schema doesn't block auth schema). Phase 3 connector work can be split across parallel agents. Running overlapping phases with AI subagent streams saves ~6–8 days wall-clock, delivering in **~12 weeks**.

---

## 3-Week MVP Scope

| Week | Phases | Deliverable |
|---|---|---|
| **Week 1** | Phase 1 + Phase 2 | Real login (Auth.js + Postgres), multi-tenant workspaces, CSV upload → stored in DB |
| **Week 2** | Phase 4 (core RAG + streaming + 2 LLM providers) + Phase 5 (partial) | Ask AI works on real uploaded data, LLM switcher in Admin (Claude + OpenAI) |
| **Week 3** | Phase 3 (Zoho CRM only) + Phase 7 (deployment) | Zoho connected, data syncs to Ask AI, production URL on custom domain |

**MVP cuts:**
- Custom ERP connector deferred to sprint 2 (needs ERP API docs from client)
- Google Sheets, Salesforce: post-launch
- No Redis caching (direct LLM calls)
- No Playwright E2E tests (manual QA only)
- Gemini + Ollama LLM providers deferred (Claude + OpenAI at launch)
- No pg-boss scheduler (manual sync trigger only)

---

## Infrastructure & Monthly Costs

### Core Infrastructure

| Service | Purpose | Plan | Monthly Cost |
|---|---|---|---|
| **Vercel** | Frontend + API Routes hosting, preview deploys | Pro | $20 |
| **Neon** (Postgres) | Primary DB + pgvector + pg-boss jobs | Free → Launch ($19) | $0–19 |
| **Cloudflare R2** | File storage (CSV/Excel/ERP exports) | Pay-as-you-go | $0–5 |
| **Upstash Redis** | API rate limiting + LLM response cache | Pay-as-you-go | $0–10 |
| **Railway** | Background sync worker (if pg-boss hits Neon connection limits) | Starter | $0–10 |
| **Sentry** | Error monitoring | Developer (free) | $0 |
| **GitHub** | Source control + CI/CD Actions | Free | $0 |
| **Total infra** | | | **$20–64/month** |

---

### LLM API Costs — Multi-Provider (Usage-Based)

The tenant chooses which provider to use. Costs are billed directly to the tenant's own API keys — DecisionOS does not mark up LLM costs.

| Provider | Model | Price (input / output per 1M tokens) |
|---|---|---|
| **Anthropic Claude** | claude-sonnet-4-6 | $3 / $15 |
| **Anthropic Claude** | claude-haiku-4-5 | $0.25 / $1.25 |
| **OpenAI** | gpt-4o | $2.50 / $10 |
| **OpenAI** | gpt-4o-mini | $0.15 / $0.60 |
| **Google Gemini** | gemini-1.5-pro | $1.25 / $5 |
| **Embeddings** | text-embedding-3-small (OpenAI) | $0.02 / 1M tokens |

**Estimated monthly LLM spend by usage tier (using Claude Sonnet as baseline):**

| Users | Queries/Day | Est. Monthly LLM Cost |
|---|---|---|
| 10 (pilot) | 50 | ~$10–25 |
| 50 (early SaaS) | 300 | ~$50–100 |
| 200 (growth) | 1,500 | ~$180–350 |
| 500+ (scale) | 5,000 | ~$500–900 |

> Tenants using gpt-4o-mini or claude-haiku can reduce LLM costs by ~80% for bulk/scheduled tasks.

---

### Third-Party Connector Costs

| Connector | API Access Cost | Notes |
|---|---|---|
| **Zoho CRM** | Free | OAuth 2.0 via Zoho Accounts Server. Client registers a Zoho Server-based App (free). API calls free within Zoho plan limits. |
| **Custom ERP** | Free | Client provides REST API base URL + auth credentials. No third-party cost — direct integration. |
| **PostgreSQL direct** | Free | Client provides host/credentials. TCP connection. |
| **Google Sheets** *(post-launch)* | Free | Google Cloud project, Sheets API v4. Free within 300 req/min. |
| **Salesforce** *(post-launch)* | Free | Connected App in client's org. No per-API-call cost. |
| **Total connector cost** | | **$0/month** — all connectors use client's own credentials |

---

### Subscription Billing (Optional — Phase 2)

For MVP, plan assignment is manual (Platform Admin sets plan per tenant). For self-serve billing:

| Service | Purpose | Cost |
|---|---|---|
| **Stripe** | Subscription billing, plan upgrades, invoices | 0.5% + payment processing |
| **Stripe Billing Portal** | Self-serve plan upgrade/downgrade for tenants | Included with Stripe |

> Stripe integration is post-MVP. At launch, Platform Admin manually assigns plans. Stripe can be added in ~3 days when needed.

---

### Optional Additions

| Service | Purpose | Cost |
|---|---|---|
| **Resend** | Transactional email (plan upgrade confirmations, query limit warnings, invites) | Free up to 3,000/month |
| **Cloudflare** | CDN + WAF + DDoS protection | Free tier sufficient |
| **PostHog** | Product analytics (per-tenant feature usage, plan conversion tracking) | Free up to 1M events/month |

---

## Total Monthly Cost Summary

| Scale | Infra | LLM API* | Total/Month |
|---|---|---|---|
| Pilot (10 users) | $20–45 | $10–25 | **~$30–70** |
| Early SaaS (50 users) | $45–65 | $50–100 | **~$95–165** |
| Growth (200 users) | $65–100 | $180–350 | **~$245–450** |
| Scale (500+ users) | $100–200 | $500–900 | **~$600–1,100** |

*LLM costs billed to tenant's own API key — can be passed through to client at cost or marked up.

---

## AI Development Stack

| Tool | Role |
|---|---|
| **Claude Code (claude-sonnet-4-6)** | Primary implementer + reviewer per phase |
| **Subagent-Driven Development (SDD)** | Fresh implementer + reviewer per task — same methodology used for frontend |
| **GitHub Actions** | CI: type-check, lint, Vitest, Playwright on every PR |
| **Vercel Preview Deployments** | Every PR gets a live preview URL for visual QA |
| **Chrome MCP** | Visual verification after each phase |
| **Drizzle ORM** | Type-safe SQL, migration management |

---

## Risk & Contingency

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Custom ERP API unpredictability** — undocumented endpoints, inconsistent field names | High | Generic adapter + field mapping UI; budget 1 extra day after client provides API docs |
| **Zoho OAuth scope differences** — sandbox vs production, rate limits (100 req/min on free plan) | Medium | Use Zoho sandbox for dev; test rate limit handling before go-live |
| **LLM provider API changes** — provider updates breaking our adapter | Low | Each provider is a separate adapter class; swap without touching core router |
| **Multi-tenant data isolation** — cross-tenant query leakage | Low | Enforced at middleware layer + audit in Phase 6; automated pen-test in Playwright |
| **pgvector query latency on large datasets** | Low | Add `ivfflat` index after 100K+ vectors; benchmark before launch |
| **Client ERP rate limits or IP allowlisting requirements** | Medium | Build retry + backoff into sync scheduler; coordinate IP allowlist with client IT |

**Recommended buffer:** +10% (~6–7 days) for unknowns, especially Custom ERP integration.

---

## Deliverables at Each Phase Completion

| Phase | Client-Visible Deliverable |
|---|---|
| Phase 1 | Working login, multi-tenant workspaces (each client = isolated DB namespace) |
| Phase 2 | Upload CSV/Excel → appears in Data Sources → Ask AI answers from it |
| Phase 3 | Zoho CRM connected → contacts/deals sync → Ask AI answers from live CRM data |
| Phase 4 | Ask AI streams real answers with SQL citations; tenant can switch between Claude / GPT-4o / Gemini in Admin |
| Phase 5 | All dashboard KPIs, charts, insights driven entirely by live data |
| Phase 6 | Security audit report + rate limiting confirmed + performance benchmarks |
| Phase 7 | Full test coverage + production URL on custom domain + Zoho + ERP both connected |

---

## Open Questions for Client

| Question | Why It Matters |
|---|---|
| Can you share the Custom ERP API documentation (base URL, auth type, key endpoints)? | Needed to scope the ERP connector accurately; missing docs = 1–2 day risk buffer |
| Which Zoho plan are you on? (Free = 100 API req/min; Professional+ = higher limits) | Determines sync frequency we can offer without hitting rate limits |
| How many tenant organizations do you expect at launch? | We are using schema-per-tenant (confirmed). This informs connection pool sizing on Neon. |
| ~~Do tenants bring their own LLM API keys, or does DecisionOS hold one shared key?~~ | **Answered (2026-06-30): Tenants bring their own keys and pay the LLM provider directly.** |

---

*Estimate prepared using DecisionOS frontend prototype as the baseline. Stack: real PostgreSQL (Neon/Railway) + Auth.js v5 + Cloudflare R2. Connectors updated to Zoho CRM + Custom ERP per client confirmation. LLM multi-provider switcher added per client requirement.*
