# DecisionOS — 3–4 Week End-to-End Delivery Estimate

> **Project:** DecisionOS — Enterprise AI Decision Intelligence SaaS
> **Prototype status:** Frontend complete (Phase 0 done)
> **Delivery model:** Claude Code AI-assisted development with parallel agent streams (SDD)
> **Target:** Full production deployment in 3–4 weeks
> **Based on:** [ESTIMATE.md](./ESTIMATE.md) — same scope, same tech stack, compressed via parallelism

---

## How 3–4 Weeks Is Achievable

The main estimate totals **~69.5 days of sequential AI work**. With Claude Code's Subagent-Driven Development (SDD), we run **4–5 parallel agent streams simultaneously** — each stream is a fresh Claude Code agent working on an independent task.

```
Sequential:    69.5 days ÷ 1 stream  = 69.5 days (~14 weeks)
With SDD:      69.5 days ÷ 4.5 avg streams = ~15 effective days + buffer = 3–4 weeks
```

Each agent stream:
- Has its own isolated context — no confusion between tasks
- Writes, tests, and self-reviews its own code
- Gets a task reviewer before merging
- Works from shared types in `packages/shared` (no interface mismatches)

**The critical path** (sequential dependencies that can't be parallelised) runs through:
Phase 1 foundation → Phase 4 AI core → Phase 5 integration → Phase 7 deployment

Everything else (file ingestion, connectors, hardening, CI/CD setup) runs in parallel alongside the critical path.

---

## Parallel Stream Strategy

5 streams run simultaneously at peak. Each column below is one parallel Claude Code agent:

```
         STREAM A              STREAM B              STREAM C              STREAM D              STREAM E
WEEK 1   Phase 1: DB schema    Phase 1: Auth.js v5   Phase 1: Multi-       Phase 7: CI/CD        Phase 2: File
         + Drizzle ORM         + JWT sessions        tenant middleware      pipeline setup        upload + R2
         + Neon setup          + bcrypt              + API scaffold         (GitHub Actions,      storage
                                                                            Vercel, env vars)

WEEK 2   Phase 4: pgvector     Phase 4: RAG          Phase 3: Zoho CRM     Phase 2: CSV/Excel    Phase 5: TanStack
         + embedding pipeline  retrieval + SQL gen   OAuth + data sync     parser + schema       hooks for Phase 1
         + LLM integrations    + chat sessions API                         inference             endpoints
         (OpenAI + Anthropic)

WEEK 3   Phase 4: 7-agent      Phase 4: LLM connect  Phase 5: Subscription Phase 3: Custom ERP   Phase 6: Rate
         orchestration         wizard + usage        enforcement + Admin   connector + pg-boss   limiting + Sentry
         pipeline + SSE        logging + exec        Console (LLM UI       sync scheduler        + Redis cache
         streaming             summary               + usage dashboard)

WEEK 4   Phase 4: Insight +    Phase 5: Real         Phase 7: Vitest       Phase 7: Playwright   Phase 6: Security
         Rec auto-generation   dashboard charts +    unit + integration    E2E tests +           audit + data
                               notification system   tests                 production deploy     isolation pen-test
```

---

## Week-by-Week Deliverables

### Week 1 — Foundation Live

**Goal:** Everything a working backend needs. Database live, auth working, CI running.

| Stream | Tasks | Output |
|---|---|---|
| A | Drizzle ORM schema (all 7 table groups), Neon Postgres setup, migrations | Live DB on Neon with all tables, pgvector extension enabled |
| B | Auth.js v5 Credentials provider, bcrypt, JWT httpOnly cookie, AuthGuard | Login/logout working against real DB |
| C | Schema-per-tenant middleware (`search_path` per connection), Zod-typed API routes | All API routes tenant-scoped; mock auth replaced with JWT |
| D | GitHub Actions CI (type-check + lint + test + Vercel preview), custom domain SSL, env var management | Every PR gets a preview deploy URL |
| E | Multipart upload endpoint → Cloudflare R2, R2 bucket setup | Files upload to R2, URL stored in DB |

**End of Week 1 checkpoint:**
- ✅ Real login (Auth.js + bcrypt + Postgres)
- ✅ Multi-tenant DB live (schema-per-tenant on Neon)
- ✅ File upload to Cloudflare R2 working
- ✅ CI/CD pipeline running (every PR → preview URL on Vercel)

---

### Week 2 — Core AI + First Connector

**Goal:** The core product value prop working end-to-end: upload data → ask AI → get answer.

| Stream | Tasks | Output |
|---|---|---|
| A | pgvector setup, embedding pipeline (chunk → embed → store), OpenAI + Anthropic LLM adapters, multi-provider router | Embeddings stored in Postgres; LLM calls routed to tenant's API key |
| B | RAG retrieval (cosine similarity → context), SQL generation (LLM → SQL → AST safety check → execute), chat session CRUD API | Ask AI returns real answers with SQL citations; sessions saved |
| C | Zoho CRM OAuth 2.0 flow, REST API v7 sync (Contacts/Deals/Accounts), delta sync via `Modified_Time`, encrypted credential storage | Zoho data syncing into tenant schema |
| D | CSV parser (Papa Parse) + Excel parser (xlsx), schema inference (auto-detect types), dynamic DDL → typed Postgres tables | Uploaded CSV/Excel queryable by Ask AI |
| E | TanStack Query hooks for users, KPIs, insights, recommendations wired to real Phase 1 API endpoints | Dashboard KPI cards showing real data |

**End of Week 2 checkpoint:**
- ✅ Upload CSV → Ask AI answers from it (core value prop)
- ✅ Zoho CRM connected → data syncs → Ask AI queries live CRM data
- ✅ Real dashboard KPIs from DB
- ✅ Chat history persisted (session sidebar works)

---

### Week 3 — Full AI Engine + All Connectors + Admin

**Goal:** Complete AI intelligence layer, all launch connectors, admin consoles.

| Stream | Tasks | Output |
|---|---|---|
| A | 7-agent orchestration pipeline (Intent → Governance → Data Analyst → BI → Insight → Recommendation → Workflow), SSE streaming token-by-token to chat UI | Full AI chain per query; PII masked; results stream to UI; `decision_logs` written |
| B | LLM connect wizard (provider selector → API key → test → save), LLM usage logging (`llm_usage_logs`), AI Executive Summary (nightly BullMQ job) | Tenant can connect any supported LLM; usage dashboard populated; morning briefing generated |
| C | Subscription enforcement middleware (user + data source limits → 402), Tenant Admin Console (LLM settings + usage dashboard with token/cost/user breakdown), Platform Admin panel (plan CRUD + tenant assignment) | Plan limits enforced; tenant sees their LLM spend; Platform Admin manages plans |
| D | Custom ERP generic REST adapter (configurable URL + auth + field mapping), webhook receiver, pg-boss sync scheduler (cron + retry + backoff) | Custom ERP connected; scheduled syncs running |
| E | Upstash Redis rate limiting (sliding window per user + per tenant), Sentry error monitoring, Redis query result cache (5-min TTL for repeated AI queries) | Rate limits active; errors tracked in Sentry; AI responses cached |

**End of Week 3 checkpoint:**
- ✅ Full 7-agent AI chain with SSE streaming
- ✅ All launch connectors live (Zoho + Custom ERP + PostgreSQL direct + file upload)
- ✅ Tenant Admin Console — LLM wizard + usage dashboard
- ✅ Platform Admin panel — plan management
- ✅ Rate limiting + error monitoring active

---

### Week 4 — QA, Hardening & Production Deployment

**Goal:** Production URL live, tested, secured.

| Stream | Tasks | Output |
|---|---|---|
| A | Insight + Recommendation auto-generation (LLM analysis + threshold rule engine, 4h BullMQ cron) | Proactive insights and recommendations auto-generated and visible in UI |
| B | Real dashboard charts (Recharts on live data), notification system (SSE → notification bell), workflow/task CRUD persistence | All UI screens showing live data; notifications working |
| C | Vitest unit + integration tests (API routes, auth middleware, data ingestion, LLM router) | Test suite passing in CI |
| D | Playwright E2E tests (5 core flows: login, upload CSV, Zoho connect, ask AI, workflow create), production Neon + R2 + Upstash setup, Vercel production deploy | Production URL live; E2E passing against production |
| E | Security audit (SQL injection / XSS / OWASP headers / CSRF review), cross-tenant data isolation pen-test, password policy + account lockout, LLM API key encryption audit | Security audit report; no critical findings before go-live |

**End of Week 4 checkpoint:**
- ✅ All features live in production
- ✅ Test suite passing (unit + integration + E2E)
- ✅ Security audit complete — no critical issues
- ✅ Custom domain with SSL
- ✅ Zero-downtime DB migration strategy confirmed

---

## Full Scope — Nothing Cut

This is the same scope as the main estimate. No features deferred. All launch items delivered in 4 weeks:

| Area | Included in 3–4 weeks |
|---|---|
| Auth | Auth.js v5, bcrypt, JWT, session middleware |
| Multi-tenancy | Schema-per-tenant, Postgres search_path isolation |
| File ingestion | CSV + Excel upload → R2 → parse → DB → queryable |
| Zoho CRM | OAuth 2.0, REST API v7, delta sync, field mapping |
| Custom ERP | Generic REST adapter, webhook receiver, field mapper |
| PostgreSQL direct | Connection config, table browser, scheduled pull |
| AI Engine | pgvector, RAG, SQL gen, 7-agent orchestration, SSE streaming |
| Chat | Session persistence, history, auto-title |
| LLM | OpenAI + Anthropic + Gemini adapters, per-tenant API keys, usage dashboard |
| Subscription | Plan enforcement (users + data sources), tenant + platform admin |
| Dashboards | Real KPIs, charts (Recharts), live data |
| Insights | Auto-generated (4h cron), proactive alerts |
| Recommendations | LLM-generated, ranked by evidence |
| Workflows | Task CRUD, approvals |
| Notifications | SSE → bell, in-app |
| Hardening | Redis rate limiting, Sentry, query caching, security audit |
| CI/CD | GitHub Actions, Vercel preview deploys, Vitest, Playwright E2E |
| Deployment | Vercel (frontend + API), Neon (Postgres), R2 (files), Upstash (Redis), custom domain |

**Post-launch only (not in 3–4 week scope):**
- Stripe self-serve billing (~3 days)
- Google Sheets connector (~2 days)
- Salesforce connector (~3 days)
- Ollama (self-hosted LLM) integration (~1 day)

---

## Dependencies That Could Affect Timeline

These are external — outside our control. Flag and resolve in Week 1:

| Dependency | Owner | Risk | Mitigation |
|---|---|---|---|
| Custom ERP API documentation | Client | HIGH — without docs, ERP connector can't be scoped | Share API docs by Day 2; if delayed, ERP connector shifts to post-launch |
| Zoho app registration (Server-based App in Zoho Developer Console) | Client | MEDIUM — takes 10 min but requires client action | Client registers app and shares `client_id` + `client_secret` by Day 3 |
| Tenant LLM API keys (OpenAI / Anthropic) | Client | LOW — needed for end-to-end testing | Client shares test API key by Day 7 (Week 2 start) |
| DNS access for custom domain | Client | LOW — Vercel handles SSL, just need DNS record added | Provide DNS record to client by Day 18 |

---

## 3-Week Option (If Timeline Must Tighten Further)

If 3 weeks is firm, one item shifts post-launch:

| Cut | Impact | Post-launch effort |
|---|---|---|
| Custom ERP connector | ERP data not in Ask AI at launch; Zoho + CSV + PostgreSQL direct still work | 4 days in sprint 2 |
| Playwright E2E tests | Manual QA replaces automated E2E; unit + integration tests still run in CI | 2 days in sprint 2 |
| Insight + Rec auto-generation (cron) | Insights shown from manual triggers only; manual "Generate Insights" button in UI | 2 days in sprint 2 |

With these three cuts: **Week 3 = production deployment**. All core AI, auth, Zoho, file upload, admin consoles, dashboards still ship.

---

## Infrastructure Provisioned at Deployment

| Service | Purpose | Plan at launch | Monthly cost |
|---|---|---|---|
| **Vercel** | Frontend + API Routes + preview deploys | Pro | $20 |
| **Neon** | PostgreSQL + pgvector (schema-per-tenant) | Launch ($19) | $19 |
| **Cloudflare R2** | File storage (CSV, Excel, ERP exports) | Pay-as-you-go | $0–5 |
| **Upstash Redis** | Rate limiting + AI response cache | Pay-as-you-go | $0–10 |
| **Sentry** | Error monitoring | Developer (free) | $0 |
| **GitHub** | Source control + CI/CD | Free | $0 |
| **Total** | | | **~$39–54/month** |

All provisioned and configured by **end of Week 1** (Stream D), so Weeks 2–4 deploy to real infrastructure on every PR.

---

## AI Development Tooling

| Tool | Role |
|---|---|
| **Claude Code (claude-sonnet-4-6)** | Primary implementer — all code written and reviewed by AI |
| **Subagent-Driven Development (SDD)** | 4–5 parallel agent streams per week; fresh implementer + reviewer per task |
| **GitHub Actions** | CI: type-check → lint → Vitest → Playwright on every PR |
| **Vercel Preview Deploys** | Every PR gets a live preview URL for visual QA |
| **Chrome MCP** | Visual verification after every UI-touching task |
| **Drizzle ORM** | Type-safe SQL + zero-downtime migration on every deploy |

---

## Summary

| | 3-Week Option | 4-Week Full |
|---|---|---|
| **Scope** | Core + Zoho + CSV + AI + Admin (ERP + E2E + auto-insights deferred) | Everything in ESTIMATE.md |
| **Parallel streams** | 5 streams at peak | 4–5 streams at peak |
| **End state** | Production URL, core value prop working, client can demo | Production URL, all connectors, full test suite, security audit |
| **Post-launch work** | ~9 days (ERP + E2E + auto-insights + Stripe) | ~8 days (Stripe + Google Sheets + Salesforce) |
| **Infrastructure** | Vercel + Neon + R2 + Upstash — all live | Same |
| **Traditional equivalent** | ~15–18 weeks | ~33 weeks |
| **AI speed advantage** | ~5x faster | ~8x faster |

---

*Compressed delivery is achievable because Claude Code SDD eliminates the coordination overhead between developers — each agent stream has zero ramp-up time, works 10+ hours per day, and never needs a standup. The bottleneck is the critical path, not the team size.*
