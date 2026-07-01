---
type: project
weight: 0.7
status: active
tags: [changelog, history]
alias: changelog
connects:
  - target: index
    type: documents
    weight: 0.7
  - target: roadmap
    type: documents
    weight: 0.8
---

# Changelog

## 2026-06-30 — RLS + Indexes + Vault Neural
- ✅ RLS en 18 tablas públicas (block anon + authenticated)
- ✅ Storage bucket policies (block anon uploads)
- ✅ 9 foreign key indexes agregados
- ✅ Vault reestructurado como red neuronal completa
- ✅ 11 secciones de documentación agregadas (store, admin, db, api, auth, deploy, data, tests)
- ✅ roadmap.md + changelog.md + architecture.md + stack.md

## 2026-06-29 — Plan de Producción (Sprints 1-6)
- ✅ Sprint 1: WhatsApp dinámico desde StoreConfiguration + Error/404/Loading pages
- ✅ Sprint 2: next.config.ts (security headers, image remote patterns) + /api/health
- ✅ Sprint 3: requireAdminRole() + Rate limit login (5 intentos → 15 min)
- ✅ Sprint 4: `<img>` → `next/image` en 9 archivos + generateMetadata dinámico
- ✅ Sprint 5: Términos/privacidad desde DB + RLS storage + CI/CD GitHub Actions
- ✅ Sprint 6: Sentry (client/server/edge) + Pool tuning (max 2, graceful shutdown) + k6 load tests
- ✅ Pool tuning: max 2, idleTimeoutMillis 10000, allowExitOnIdle, graceful shutdown
- ✅ Sentry: 3 configs (client, server, edge) + captureException en error.tsx
- ✅ k6: tests/load/store.js (homepage, products, health endpoints)

## Related
- [[index]]
- [[roadmap]]
