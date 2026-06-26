# DecisionOS — Architecture & Design Specification

**Date:** 2026-06-26  
**Version:** 1.0  
**Status:** Approved  
**Source:** DecisionOS_PRD_v1.0.docx (authoritative reference)

---

## 1. Product Overview

DecisionOS is a production-ready, multi-tenant SaaS platform that places an LLM at the core of business intelligence, analytics, and decision-making. It enables business leaders to understand performance, detect risks, explain root causes, and receive evidence-backed recommendations — entirely through a natural-language interface backed by real business data.

**Five target personas:** Executive/CEO, Department Head, Analyst, Operations Manager, Admin.

**Five required demo scenarios (must work with seed data):**
1. Executive Morning Briefing
2. Churn Risk Analysis
3. Revenue Drop Root Cause
4. Workflow Creation from AI
5. CSV Upload → Instant Query

---

## 2. Clarified Requirements & Assumptions

### Decisions Made During Design

| Topic | Decision | Rationale |
|---|---|---|
| LLM Provider | Provider-agnostic adapter (OpenAI default + Anthropic + Gemini) | Master prompt requires multi-provider; PRD's OpenAI-only restriction is a v1.0 deployment default, not an architectural constraint |
| Data Processing | Consolidated into NestJS (no Python microservice) | Node.js libraries (xlsx, csv-parse) sufficient for v1.0; Python microservice extractable later |
| Monorepo Tool | Turborepo | Best Next.js + NestJS support, minimal config, build caching |
| Architecture | Option A: Turborepo Monorepo with shared packages | Clean separation, full type safety, one docker compose up |

### Assumptions (PRD gaps filled with enterprise defaults)

- **Tenant isolation:** `org_id` row-level filtering on all queries (schema-per-tenant reserved for Phase 2+)
- **Email (v1.0):** In-app notifications ship in v1.0; email via SendGrid ships in v1.1 as PRD specifies. Nodemailer/SendGrid service is wired but gated by config flag.
- **Embedding model:** `text-embedding-3-small` (OpenAI, 1536 dimensions). Provider-specific embeddings use the active LLM provider's embed endpoint.
- **Dynamic dataset storage:** Ingested CSV/Excel data stored in `org_{id}_dataset_{id}` PostgreSQL tables managed by Prisma raw SQL migrations. Schema tracked in `datasets` metadata table.
- **KPI refresh:** BullMQ cron job, default 60-minute interval (configurable per KPI).
- **Insight refresh:** BullMQ cron job, every 4 hours (PRD §6.11).
- **Risk score computation:** Composite z-score across engagement, support ticket age, payment delay, and renewal proximity. Weights configurable in org settings.
- **File scanning:** ClamAV integration in Docker Compose; cloud-native AV (S3 Object Lambda) in production.
- **Audit log retention:** Soft-delete blocked on `audit_logs` at DB user permission level; retention enforced via BullMQ cleanup job (default 12 months, configurable).

---

## 3. Project Structure

```
decisionos/                          # Turborepo root
├── apps/
│   ├── web/                         # Next.js 14 (App Router) frontend
│   └── api/                         # NestJS backend
├── packages/
│   ├── shared/                      # DTOs, Zod schemas, enums, API types
│   ├── ui/                          # Design system (shadcn/ui + custom)
│   ├── ai/                          # LLM adapter layer
│   └── db/                          # Prisma schema, migrations, seed
├── infrastructure/
│   ├── docker/                      # Dockerfiles
│   ├── docker-compose.yml           # Full local stack
│   ├── docker-compose.prod.yml      # Production overrides
│   └── github-actions/              # CI/CD workflow YAMLs
├── docs/
│   ├── superpowers/specs/           # This file
│   ├── api/                         # OpenAPI spec (auto-generated)
│   ├── architecture/                # ADRs, diagrams
│   └── guides/                      # Setup, admin, user, developer
├── scripts/
│   ├── seed.ts                      # Prisma seed (5 demo datasets)
│   └── generate-openapi.ts          # OpenAPI spec generator
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/                         # Playwright
```

---

## 4. Technology Stack

### Frontend (`apps/web`)

| Technology | Version | Role |
|---|---|---|
| Next.js | 14 (App Router) | SSR, routing, React Server Components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest | Accessible Radix-based UI primitives |
| Recharts | 2.x | KPI charts, line charts, bar charts, pie charts |
| ECharts (via echarts-for-react) | 5.x | Heatmaps, advanced visualizations |
| TanStack Query | 5 | Server state, caching, optimistic updates |
| Zustand | 4 | Client UI state (sidebar, chat, notifications) |
| React Hook Form | 7 | Forms |
| Zod | 3 | Form + DTO validation (from packages/shared) |
| Vercel AI SDK (React) | 3 | useChat hook for SSE streaming |
| cmdk | latest | Command palette (⌘K) |
| next-themes | latest | Dark/light mode |

### Backend (`apps/api`)

| Technology | Version | Role |
|---|---|---|
| NestJS | 10 | Framework (DI, modules, guards, interceptors, pipes) |
| TypeScript | 5 | Type safety |
| Prisma | 5 | ORM, migrations |
| PostgreSQL | 15 | Primary database |
| pgvector | 0.7+ | Vector embeddings (1536-dim) |
| Redis | 7 | Cache, session store, rate limiting |
| BullMQ | 4 | Job queues (ingestion, KPI, insights, notifications, audit) |
| node-sql-parser | 4 | SQL AST validation (blocks non-SELECT) |
| xlsx | 0.18 | Excel (.xlsx/.xls) parsing |
| csv-parse | 5 | CSV parsing |
| bcrypt | 5 | Password hashing (cost factor 12) |
| jsonwebtoken | 9 | JWT (RS256) |
| multer | 1.4 | File upload handling |
| @nestjs/throttler | 5 | Rate limiting (Redis-backed) |
| helmet | 7 | HTTP security headers |
| Pino | 8 | Structured JSON logging |
| Sentry | 7 | Error tracking |

### AI Layer (`packages/ai`)

| Technology | Role |
|---|---|
| Vercel AI SDK Core | Unified streaming, tool-calling, structured outputs |
| OpenAI Node SDK | GPT-4o (default provider) |
| Anthropic SDK | Claude 4 Sonnet/Opus (alternate provider) |
| Google Generative AI SDK | Gemini 2.0 Flash/Pro (alternate provider) |

### Shared Packages

| Package | Contents |
|---|---|
| `packages/shared` | Zod schemas, TypeScript types, enums, API response types — consumed by both web and api |
| `packages/ui` | Re-exported + styled shadcn/ui components, chart wrappers, design tokens |
| `packages/db` | Prisma schema, migrations, seed scripts |

### Infrastructure

| Tool | Role |
|---|---|
| Docker + Docker Compose | Local dev stack |
| MinIO | S3-compatible local file storage |
| MailHog | Local SMTP email capture |
| GitHub Actions | CI/CD pipeline |
| AWS S3 / Cloudflare R2 | Production file storage |
| Vercel / Railway / AWS ECS | Production hosting (cloud-agnostic) |

---

## 5. System Architecture

### Component Interaction

```
Browser (Next.js)
  │  REST + SSE
  ▼
NestJS API (apps/api)
  │
  ├── Auth Module ──────────────────── JWT RS256, bcrypt, account lockout
  ├── Admin Module ─────────────────── Users, roles, permissions, settings
  ├── Data Module ──────────────────── Sources, upload, ingestion, datasets
  │   └── BullMQ: ingestion-queue
  ├── KPI Module ───────────────────── Definitions, results, alerts
  │   └── BullMQ: kpi-refresh-queue (cron)
  ├── Dashboard Module ─────────────── Dashboards, widgets
  ├── Chat Module ──────────────────── Sessions, messages, SSE streaming
  │   └── Orchestration Engine
  │       ├── Intent Agent
  │       ├── Governance Agent
  │       ├── Data Analyst Agent ────── Query Engine → PostgreSQL
  │       ├── BI Agent
  │       ├── Insight Agent
  │       ├── Recommendation Agent
  │       └── Workflow Agent
  ├── Insight Module ───────────────── Proactive generation, CRUD
  │   └── BullMQ: insight-queue (cron, 4h)
  ├── Recommendation Module ─────────── CRUD, approve/reject/defer
  ├── Workflow Module ──────────────── Tasks, approvals, runs
  ├── Notification Module ──────────── In-app notifications, event bus
  │   └── BullMQ: notification-queue
  ├── Audit Module ─────────────────── Append-only logs
  │   └── BullMQ: audit-queue (async)
  └── Infrastructure
      ├── PrismaService (PostgreSQL + pgvector)
      ├── RedisService
      ├── StorageService (S3/MinIO)
      └── EmailService (SendGrid/SMTP)
```

### Multi-Tenancy Enforcement

Every Prisma repository extends `OrgScopedRepository<T>`:

```typescript
abstract class OrgScopedRepository<T> {
  protected readonly orgId: string  // injected from JWT claim
  
  async findMany(where?: Partial<T>) {
    return this.prisma[this.model].findMany({
      where: { ...where, org_id: this.orgId, deleted_at: null }
    })
  }
  // findOne, create, update, softDelete follow same pattern
}
```

The `orgId` is extracted from the validated JWT in `JwtAuthGuard` and injected via NestJS request scope. No service or controller can query across org boundaries.

---

## 6. Database Architecture

### Schema Groups

**Group 1: Identity & Access**
- `organizations`, `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `departments`

**Group 2: Data Management**
- `data_sources`, `uploaded_files`, `datasets`, `dataset_columns`, `semantic_mappings`, `ingestion_jobs`, `data_quality_issues`

**Group 3: BI & Analytics**
- `dashboards`, `dashboard_widgets`, `kpis`, `kpi_results`, `saved_queries`, `generated_sql_queries`, `reports`

**Group 4: AI / LLM**
- `chat_sessions`, `chat_messages`, `llm_requests`, `llm_responses`, `tool_calls`, `embeddings`, `prompt_templates`

**Group 5: Decision Intelligence**
- `insights`, `recommendations`, `recommendation_evidence`, `decisions`, `decision_logs`, `risk_scores`, `anomalies`

**Group 6: Workflow**
- `tasks`, `approvals`, `workflow_runs`, `workflow_steps`, `notifications`

**Group 7: Governance**
- `audit_logs`, `access_logs`, `system_settings`

### Key Design Rules

1. Every table has: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `org_id UUID NOT NULL REFERENCES organizations(id)`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`, `deleted_at TIMESTAMPTZ NULL`.
2. `audit_logs` has no `deleted_at` — append-only, no soft deletes.
3. Dynamic dataset tables named `org_{org_id_short}_ds_{dataset_id_short}` — created via Prisma `$executeRaw` during ingestion.
4. `embeddings.embedding` uses `vector(1536)` with `ivfflat` index for cosine similarity.
5. `data_sources.config_encrypted` stores AES-256-GCM ciphertext — decrypted only in `DataSourceService`.
6. Index strategy: `org_id` indexed on every table; `created_at DESC` for time-ordered queries; composite `(org_id, status)` on tasks/recommendations/notifications.

---

## 7. AI Architecture

### LLM Adapter Interface (`packages/ai`)

```typescript
interface LLMProvider {
  id: 'openai' | 'anthropic' | 'gemini'
  chat(params: ChatParams): Promise<ChatResult>
  streamChat(params: ChatParams): AsyncIterable<StreamChunk>
  embed(text: string | string[]): Promise<number[][]>
  structuredOutput<T>(params: StructuredOutputParams<T>): Promise<T>
}
```

Provider is selected via `LLM_PROVIDER` env var. Default: `openai`. Concrete implementations: `OpenAIProvider`, `AnthropicProvider`, `GeminiProvider` — all backed by Vercel AI SDK.

### Orchestration Pipeline (per user request)

1. **Intent Agent** (fast model) — classifies intent into 10 types (kpi_question, trend_analysis, root_cause_analysis, data_query, dashboard_request, workflow_request, recommendation_request, report_generation, anomaly_question, risk_question)
2. **Governance Agent** (fast model) — checks RBAC, determines allowed tables, masks PII fields
3. **Data Analyst Agent** (strong model) — generates SQL, calls Query Engine, analyzes results
4. **BI Agent** (fast model) — builds chart/table spec from results
5. **Insight Agent** (strong model) — detects anomalies, identifies causal factors
6. **Recommendation Agent** (strong model) — generates ranked, evidence-backed recommendations
7. **Workflow Agent** (fast model) — creates tasks/approvals on user confirmation
8. **Decision Log** — entire chain written to `decision_logs` table

### Query Engine Safety

- All SQL generated by LLM is parsed via `node-sql-parser` AST before execution
- Non-SELECT statements (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `CREATE`, `ALTER`) throw `QuerySecurityException` before reaching the database
- Row limit: 10,000 (configurable per role)
- Query timeout: 30 seconds (enforced at DB level via `statement_timeout`)
- All queries logged to `generated_sql_queries` with full SQL, user, session, timing

### Prompt Security

- User input is always wrapped: `<user_input>{input}</user_input>` — never interpolated into system instructions
- Semantic layer injected as structured context, not as raw SQL
- PII fields listed in governance agent output are replaced with `[REDACTED:{field_name}]` in LLM context
- All LLM requests logged with `SHA-256(prompt)` hash for auditability

### Proactive Intelligence (Scheduled)

- **KPI Alerts:** BullMQ cron checks each KPI result against `threshold_warning` and `threshold_critical` after every refresh. Triggers insight creation on breach.
- **Anomaly Detection:** Z-score (> ±2σ) and IQR methods run on KPI time series every 4 hours.
- **Risk Scoring:** Composite score per customer: `engagement_weight * engagement_score + support_weight * support_score + payment_weight * payment_score + renewal_weight * renewal_proximity_score`. Weights default to `[0.25, 0.25, 0.25, 0.25]`, configurable per org.

---

## 8. Frontend Architecture

### Route Structure

```
(auth)/login                          # Email/password login
(auth)/forgot-password                # Request reset email
(auth)/reset-password                 # Set new password via token

(dashboard)/                          # Executive Command Center
(dashboard)/ask                       # Ask AI (LLM chat)
(dashboard)/dashboards                # Dashboard list
(dashboard)/dashboards/[id]           # Individual dashboard
(dashboard)/insights                  # Insight cards
(dashboard)/recommendations           # Recommendation list
(dashboard)/data-sources              # Connector management
(dashboard)/data-sources/upload       # CSV/Excel upload wizard
(dashboard)/kpis                      # KPI configuration
(dashboard)/workflows                 # Tasks + approvals
(dashboard)/admin                     # Admin console (role-gated)
(dashboard)/admin/users
(dashboard)/admin/roles
(dashboard)/admin/audit-logs
(dashboard)/admin/llm-settings
```

### State Management

- **TanStack Query** — all server data: KPIs, dashboards, recommendations, tasks, notifications. Stale-while-revalidate with 30s default `staleTime`.
- **Zustand** — three stores:
  - `useUIStore` — sidebar open/closed, command palette, active modal
  - `useChatStore` — active session, pending message, streaming state
  - `useNotificationStore` — unread count, notification list (polled every 30s)

### Design System

- Primary: `#1B2A4A` (Navy)
- Accent: `#2563EB` (Blue)
- Typography: Inter, scale 12/14/16/18/24/32/48px
- Tailwind config extended with DecisionOS design tokens
- Dark mode: `class`-based via `next-themes`; `dark:` variants on all components
- All interactive elements: visible focus rings, `aria-label` on icon-only buttons, sufficient contrast (≥4.5:1 for normal text)

### Key UI Components

| Component | Description |
|---|---|
| `KPICard` | Metric value, trend arrow, sparkline, threshold badge |
| `ChatMessage` | Text + optional inline chart + optional table + citations |
| `CitationBadge` | Clickable badge showing dataset, table, and SQL used |
| `FollowUpChips` | Suggested follow-up questions as clickable chips |
| `RecommendationCard` | Title, evidence summary, confidence score, Approve/Reject |
| `IngestionWizard` | Multi-step: upload → preview → column mapping → confirm |
| `DataTable` | Virtualized, sortable, filterable table (TanStack Table) |
| `CommandPalette` | ⌘K global command palette (cmdk) |
| `NotificationBell` | Bell icon with unread count badge + dropdown list |
| `ApprovalModal` | Full recommendation context + approve/reject with reason |

---

## 9. Backend Architecture

### Module Structure

Each module follows the pattern: `controller → service → repository → prisma`. All controllers return the response envelope:
```typescript
{ success: boolean, data: T | null, error: string | null, meta: PaginationMeta | null }
```

### Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| Authentication | `JwtAuthGuard` — validates RS256 JWT, attaches user+org to request |
| Authorization | `RolesGuard` + `@Roles(...)` decorator — checks `role_permissions` |
| Org scoping | `OrgScopedRepository` base class — auto-injects `org_id` filter |
| Audit logging | `AuditInterceptor` — async write to `audit-queue` on all mutations |
| Validation | `ZodValidationPipe` — validates DTOs against shared Zod schemas |
| Rate limiting | `@nestjs/throttler` with Redis store — 100 req/min per user |
| Security headers | `helmet()` middleware on all responses |
| Error handling | `GlobalExceptionFilter` — maps errors to standardized HTTP responses |
| Logging | Pino JSON logger — every request logged with trace ID |

### BullMQ Queues

| Queue | Processor | Trigger |
|---|---|---|
| `ingestion-queue` | `IngestionProcessor` | File upload confirmed |
| `kpi-refresh-queue` | `KpiRefreshProcessor` | Cron (per-KPI interval) |
| `insight-generation-queue` | `InsightGenerationProcessor` | Cron (every 4h) |
| `notification-queue` | `NotificationProcessor` | Event emitted by any module |
| `audit-queue` | `AuditProcessor` | `AuditInterceptor` on every mutation |

### API Overview

All endpoints: `POST /api/v1/...`. Authentication: `Authorization: Bearer {access_token}`.

**Auth:** `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/me`

**Users/Roles:** `/users`, `/users/invite`, `/users/:id`, `/roles`, `/roles/:id/permissions`

**Data:** `/data-sources`, `/data-sources/:id/test`, `/data-sources/:id/sync`, `/upload/csv`, `/upload/excel`, `/datasets`, `/datasets/:id/columns`, `/datasets/:id/preview`

**Chat/AI:** `/chat/sessions`, `/chat/sessions/:id/messages` (REST + SSE stream)

**KPIs/Dashboards:** `/kpis`, `/kpis/:id/results`, `/dashboards`, `/dashboards/:id`, `/dashboards/:id/widgets`

**Intelligence:** `/insights`, `/recommendations`, `/recommendations/:id/approve`, `/recommendations/:id/reject`, `/decisions`, `/risk-scores`, `/anomalies`

**Workflows:** `/tasks`, `/approvals`, `/approvals/:id/approve`, `/approvals/:id/reject`, `/notifications`, `/notifications/:id/read`

**Admin:** `/audit-logs`, `/system-settings`, `/llm-settings`

---

## 10. Security Architecture

### Authentication & Session

- Access token: RS256 JWT, 15-minute expiry
- Refresh token: HTTP-only `Secure SameSite=Strict` cookie, 7-day expiry, rotated on every use
- Account lockout: 5 consecutive failures → 15-minute lockout (tracked in Redis)
- Password: bcrypt, cost factor 12 minimum
- All auth events (login, logout, failed attempt, lockout) written to `audit_logs`

### Data Protection

- Data source credentials: AES-256-GCM encrypted at rest in `data_sources.config_encrypted`
- LLM API keys: stored in environment variables / AWS Secrets Manager only
- Uploaded files: MIME type + extension whitelist (`text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `.xlsx`, `.xls`, `.csv`); max 50MB
- All data transmitted over HTTPS/TLS 1.2+

### SQL & Query Security

- LLM-generated SQL parsed by `node-sql-parser` AST before execution
- Non-SELECT statement → `QuerySecurityException` (HTTP 403)
- Row limit: 10,000 enforced server-side
- Statement timeout: 30s via PostgreSQL `SET LOCAL statement_timeout`
- No raw user input in SQL string concatenation — parameterized queries only

### Infrastructure

- Secrets: environment variables only; pre-commit hook blocks `*.env` commits
- CORS: whitelist of known frontend origins
- Rate limiting: 100 req/min per user via Redis-backed throttler
- Headers: Helmet.js (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Tenant isolation: `org_id` row-level on all queries; DB user has no DDL permissions in production

---

## 11. Performance Architecture

- **KPI values pre-computed** by BullMQ cron jobs — dashboard loads never compute on-demand
- **Redis caching:** KPI results (5-min TTL), semantic layer context (1h TTL), user session (24h TTL)
- **Virtualized lists:** TanStack Virtual for recommendation lists, audit logs, task lists
- **Code splitting:** Next.js route-level lazy loading; heavy charting libraries loaded only on dashboard pages
- **Image optimization:** Next.js `Image` component for all user avatars and org logos
- **Database indexes:** `org_id` on every table; composite `(org_id, created_at DESC)` for time-ordered queries; partial indexes on `status != 'deleted'`
- **Pagination:** cursor-based for large collections (audit logs, notifications, chat history); offset for small collections

---

## 12. Development Phases (from PRD §14)

| Phase | Name | Key Deliverables |
|---|---|---|
| 1 | Product Blueprint | This spec, architecture diagrams, DB schema, API spec |
| 2 | Foundation | Auth, DB migrations, NestJS skeleton, Next.js layout, Docker Compose |
| 3 | Data Platform | CSV/Excel upload, ingestion pipeline, schema mapping, semantic layer |
| 4 | BI Layer | KPI engine, dashboards, chart widgets, KPI refresh |
| 5 | LLM Core | Chat interface, orchestration engine, SQL gen, citation, SSE streaming |
| 6 | Decision Intelligence | Anomaly detection, root-cause, recommendation engine, decision log |
| 7 | Workflow | Task creation, approvals, notifications, workflow tracking |
| 8 | Hardening | Security audit, test suite (≥90% business logic coverage), documentation, deployment |

---

## 13. Testing Strategy

| Level | Framework | Coverage Target |
|---|---|---|
| Unit | Jest (api) + Vitest (web) | ≥90% for services, orchestration engine, AI agents |
| Integration | Jest + Prisma test client (test DB) | All API endpoints, auth flows, ingestion pipeline |
| E2E | Playwright | All 5 demo scenarios + auth flows + admin flows |
| AI Evaluation | Custom eval harness | SQL safety, citation presence, structured output validation |
| Load | k6 | 100 concurrent users, P95 < 300ms on key endpoints |
| Security | OWASP ZAP (automated scan) | All OWASP Top 10 categories |

---

## 14. Out of Scope (v1.0, per PRD §16)

- SSO / SAML authentication
- Email notifications (in-app ships; email in v1.1)
- CRM/finance connectors (Salesforce, HubSpot, QuickBooks, Xero)
- REST API connector
- Mobile app
- Dashboard PDF export / public sharing links
- Billing and subscription management
- White-label / custom domain
- Real-time streaming data ingestion (Webhook/Event Stream)
- Slack/Teams webhook notifications
- Advanced ML forecasting models
- Data lineage tracking

---

## 15. Acceptance Criteria

All 20 criteria from PRD §15 must pass. Key verifiable criteria:

1. Email/password login works with JWT tokens
2. Admin can manage users and assign roles
3. CSV and Excel upload, validation, and ingestion work
4. Dashboards display correct KPI values
5. Natural-language questions return data-backed answers
6. LLM generates only SELECT SQL (verified by query log audit)
7. AI responses include chart, table, and text
8. Anomalies and risks are detected automatically
9. Recommendations are ranked with evidence and confidence scores
10. Approve/reject recommendation flow creates tasks
11. All AI responses cite the source dataset and SQL query
12. All mutations are audit logged
13. Org A cannot access Org B data (multi-tenant isolation test)
14. `docker compose up` → full platform accessible at localhost:3000
15. All tests pass in CI pipeline
