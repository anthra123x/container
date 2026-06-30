---
type: decision
weight: 0.9
status: accepted
date: 2026-06-29
tags: [decision, database, supabase, production]
alias: pool-tuning
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: facts/supabase-free-tier-pool
    type: documents
    weight: 0.8
  - target: sessions/2026-06-29-produccion-sprints
    type: documents
    weight: 0.7
---

# Pool tuning para Supabase Free Tier

## Context
Supabase plan free limita el pooler a 2 conexiones simultáneas. Prisma usaba valores por defecto que causaban timeouts y agotamiento de conexiones.

## Options Considered
- **Option A**: Valores por defecto de Prisma (~10 conexiones) — causa `too many connections` en free tier
- **Option B**: Pool manual con `max: 2`, `idleTimeoutMillis: 10000`, graceful shutdown — respeta el límite y maneja reconexiones
- **Option C**: Usar Supabase direct connection (no pooler) — más conexiones pero menos estables

## Decision
Option B. Pool configurado en `src/lib/db.ts` con:
- `max: 2` (límite free tier)
- `idleTimeoutMillis: 10000` (espera 10s antes de cerrar idle)
- `allowExitOnIdle: true`
- Pool error handler con `console.error`
- `checkDatabaseHealth()` para health endpoint
- `process.on("SIGTERM"/"SIGINT")` para `$disconnect()` graceful

## Consequences
- Build pasa, tests pasan, k6 load tests pasan
- Si hay cuello de botella, migrar a plan Pro (7 conexiones)
- Health endpoint verifica conectividad en `/api/health`

## Related
- [[index]]
- [[facts/supabase-free-tier-pool]]
