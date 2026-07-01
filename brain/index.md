---
type: project
weight: 1.0
status: active
created: 2026-06-29
updated: 2026-06-30
tags: [project, hub, navigation]
alias: container-store
connects:
  - target: roadmap
    type: documents
    weight: 1.0
  - target: architecture
    type: documents
    weight: 0.9
  - target: stack
    type: documents
    weight: 0.8
  - target: changelog
    type: documents
    weight: 0.7
  - target: store/overview
    type: documents
    weight: 0.8
  - target: admin/overview
    type: documents
    weight: 0.8
  - target: database/schema
    type: documents
    weight: 0.8
  - target: api/endpoints
    type: documents
    weight: 0.7
  - target: auth/flow
    type: documents
    weight: 0.8
  - target: deployment/env
    type: documents
    weight: 0.7
  - target: data/products
    type: relates
    weight: 0.5
  - target: tests/strategy
    type: documents
    weight: 0.6
  - target: decisions/2026-06-30-rls-policies
    type: documents
    weight: 0.9
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: documents
    weight: 0.9
  - target: decisions/2026-06-29-pool-tuning-supabase-free
    type: documents
    weight: 0.9
  - target: sessions/2026-06-30-rls-indexes
    type: documents
    weight: 0.8
  - target: sessions/2026-06-29-produccion-sprints
    type: documents
    weight: 0.8
---

# Container Store — Neural Knowledge Network

```
                    ╔═══════════════════════════════════╗
                    ║          index.md (1.0)           ║
                    ║        HUB CENTRAL — BRAIN         ║
                    ╚═════════╤═════════╤═══════════════╝
                              │         │
         ┌────────────────────┼─────────┼──────────────────────┐
         │                    │         │                      │
    roadmap(1.0)       architecture   stack(0.8)         changelog(0.7)
    decisions 0.9       (0.9)                               
         │                    │                               
    ┌────┼────┬────┬────┬────┼────┬────┬────┬────┬────┐      
    │    │    │    │    │    │    │    │    │    │    │      
  store  admin db   api  auth deploy data tests auth/flow
  (0.8) (0.8) (0.8) (0.7) (0.8) (0.7) (0.5) (0.6)  (0.8)
```

## Project DNA

| Attribute | Value |
|-----------|-------|
| **Type** | E-commerce (contenedores de plástico, metal, tela) |
| **Status** | 🟢 Producción (v1.0) |
| **Deploy** | URL no configurada aún |
| **Auth** | Admin con roles / Clientes sin cuenta (teléfono) |
| **DB** | Supabase PostgreSQL + Prisma ORM |
| **Payment** | ❌ No integrado aún |
| **Domain** | Colombia (pesos COP, español) |

## Quick Navigation

| Area | Key File | What You'll Find |
|------|----------|------------------|
| 🧭 [[roadmap]] | Visión, metas, sprints, estado |
| 🏗 [[architecture]] | Arquitectura del sistema, diagramas |
| 📦 [[stack]] | Tech stack completo con versiones |
| 🏪 [[store/overview]] | Tienda pública: rutas, componentes, flujos |
| 🔐 [[admin/overview]] | Panel admin: CRUD, roles, workflows |
| 🗄 [[database/schema]] | Schema, relaciones, índices, migraciones |
| 🌐 [[api/endpoints]] | API routes, server actions, storage |
| 👤 [[auth/flow]] | NextAuth, roles, rate limiting |
| 🚀 [[deployment/env]] | Variables de entorno, CI/CD, monitoreo |
| 📊 [[data/products]] | Catálogo de productos, categorías, marcas |
| 🧪 [[tests/strategy]] | Unit tests, load tests, E2E plans |
| 📋 [[changelog]] | Historial de cambios del proyecto |

## Key Decisions
- [[decisions/2026-06-30-rls-policies]] — RLS, storage security, indexes
- [[decisions/2026-06-29-sin-cuentas-clientes]] — clientes sin cuentas, rastreo por teléfono
- [[decisions/2026-06-29-pool-tuning-supabase-free]] — pool PostgreSQL para free tier

## Current State
- ✅ **Sprint 1**: WhatsApp dinámico + Error/404/Loading pages
- ✅ **Sprint 2**: Security headers + health endpoint
- ✅ **Sprint 3**: Role verification + rate limit login
- ✅ **Sprint 4**: next/image + metadata dinámico
- ✅ **Sprint 5**: Términos/privacidad + RLS + CI/CD
- ✅ **Sprint 6**: Sentry + Pool tuning + k6 load tests
- ✅ **RLS**: 18 tablas aseguradas, storage policies, indexes
- ⬜ **Secrets**: SUPABASE_SERVICE_ROLE_KEY, SENTRY_DSN (Dashboard)
- ⬜ **Seed**: Más productos (solo 2 actualmente)
- ⬜ **Pagos**: Integrar pasarela de pagos
- ⬜ **Deploy**: Desplegar a producción real

## Related
- [[sessions/2026-06-30-rls-indexes]]
- [[sessions/2026-06-29-produccion-sprints]]
