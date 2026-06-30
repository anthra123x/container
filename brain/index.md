---
type: project
weight: 1.0
status: active
created: 2026-06-29
tags: [project, nextjs, supabase, ecommerce]
alias: container-store
connects:
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: documents
    weight: 0.9
  - target: decisions/2026-06-29-pool-tuning-supabase-free
    type: documents
    weight: 0.9
  - target: sessions/2026-06-29-produccion-sprints
    type: documents
    weight: 0.8
  - target: decisions/2026-06-30-rls-policies
    type: documents
    weight: 0.9
  - target: sessions/2026-06-30-rls-indexes
    type: documents
    weight: 0.8
  - target: facts/supabase-free-tier-pool
    type: relates
    weight: 0.5
---

# Container Store — Project Vault

## Objective
Tienda online de contenedores (plástico, metal, tela) con backend en Supabase, panel admin, autenticación por rol, y listo para producción real.

## Context
Negocio real de venta de contenedores. Clientes rastrean pedidos por teléfono (sin cuenta propia). Admin con roles (SUPER_ADMIN, ADMIN, EDITOR). Backend PostgreSQL via Supabase, ORM Prisma, auth NextAuth v5.

## Tech Stack
- TypeScript, Next.js 16, React 19
- Prisma 7 (ORM), Supabase (DB + Storage)
- NextAuth v5 beta (auth), Sentry (error tracking)
- Vitest (tests), k6 (load tests)
- GitHub Actions (CI/CD)

## Neural Graph

```
                  ┌──────────────┐
                  │  index.md    │  weight: 1.0
                  │  (project)   │
                  └──────┬───────┘
            ┌─────────────┼─────────────┐
            │ 0.9         │ 0.8         │ 0.5
            ▼             ▼             ▼
   ┌────────────────┐ ┌────────┐ ┌──────────────┐
   │ decisions/     │ │sessions│ │ facts/       │
   │ sin-cuentas    │ │producc.│ │supabase-pool │
   │ pool-tuning    │ │        │ │              │
   └────────────────┘ └────────┘ └──────────────┘
```

## Key Decisions
- [[decisions/2026-06-30-rls-policies]] — RLS, storage security, indexes
- [[decisions/2026-06-29-sin-cuentas-clientes]] — clientes sin cuentas, rastreo por teléfono
- [[decisions/2026-06-29-pool-tuning-supabase-free]] — pool PostgreSQL para free tier

## Current State
- **Done:** Sprint 1-6 (producción ready)
- **Done:** UI store + admin, auth con roles, rate limiting
- **Done:** Sentry, Pool tuning, k6 load tests
- **Done:** RLS policies (18 tables), storage bucket policies, missing indexes
- **Blocked:** Secrets faltantes (SUPABASE_SERVICE_ROLE_KEY, SENTRY_DSN) — requiere Dashboard
- **Not Started:** Deploy a producción

## Key Files
- `src/app/(store)/` — rutas públicas (productos, categorías, checkout)
- `src/app/(admin)/` — panel admin con login
- `src/lib/db.ts` — pool PostgreSQL con health check + graceful shutdown
- `src/lib/auth.ts` — NextAuth + rate limiting (5 intentos → 15 min lockout)
- `src/lib/auth-helpers.ts` — `requireAdminRole(minLevel)`
- `next.config.ts` — security headers, Sentry, image remote patterns
- `tests/load/store.js` — k6 load test script

## Related Facts
- [[facts/supabase-free-tier-pool]] — free tier constraints (2 connections)

## Related Sessions
- [[sessions/2026-06-30-rls-indexes]] — RLS + indexes + vault neural restructure
- [[sessions/2026-06-29-produccion-sprints]] — plan de producción, 6 sprints completados
