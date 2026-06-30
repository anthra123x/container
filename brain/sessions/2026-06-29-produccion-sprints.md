---
type: session
weight: 0.8
date: 2026-06-29
tags: [session, production, sprints, sentry, k6]
project: container-store
duration: ~4h
connects:
  - target: index
    type: documents
    weight: 0.8
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: documents
    weight: 0.6
  - target: decisions/2026-06-29-pool-tuning-supabase-free
    type: documents
    weight: 0.6
  - target: facts/supabase-free-tier-pool
    type: documents
    weight: 0.7
---

# Session: Plan de Producción — 6 Sprints Completados

## What We Did
- Sprint 1: WhatsApp dinámico desde StoreConfiguration + Error/404/Loading pages
- Sprint 2: `next.config.ts` (security headers, images remote patterns) + `/api/health` endpoint
- Sprint 3: Role verification (`requireAdminRole()`) + Rate limit login (5 intentos → 15 min)
- Sprint 4: `<img>` → `next/image` en 9 archivos + `generateMetadata` dinámico
- Sprint 5: Páginas términos/privacidad desde DB + RLS storage + CI/CD GitHub Actions
- Sprint 6: Sentry (client/server/edge) + Pool tuning (max 2, graceful shutdown) + k6 load tests

## What Worked
- Build, typecheck, lint, tests (31/31) todos verdes
- Sentry config sin errores tras corregir `hideSourceMaps` → `sourcemaps.deleteSourcemapsAfterUpload`
- Pool tuning integrado sin breaking changes
- k6 thresholds (p95 < 2s en homepage, < 3s en productos)

## What Didn't Work
- `hideSourceMaps` no existe en Sentry SDK (usar `sourcemaps.deleteSourcemapsAfterUpload` en su lugar)
- RLS del bucket `product-images` no configurable via SQL (schema owned by supabase_admin) — requiere Supabase Dashboard manual

## Decisions Made
- [[decisions/2026-06-29-sin-cuentas-clientes]] — arquitectura auth del negocio
- [[decisions/2026-06-29-pool-tuning-supabase-free]] — pool PostgreSQL para free tier

## Facts Discovered
- [[facts/supabase-free-tier-pool]] — límite de 2 conexiones en plan free

## Next Steps
1. Agregar `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` a `.env`
2. Configurar RLS del bucket `product-images` desde Supabase Dashboard (manual)
3. Agregar secrets del CI en GitHub
4. Ejecutar `k6 run tests/load/store.js` contra staging/producción
5. Monitorear Sentry post-lanzamiento y ajustar `tracesSampleRate`

## Related
- [[index]]
