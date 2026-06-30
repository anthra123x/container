---
type: fact
weight: 0.7
status: verified
date: 2026-06-29
tags: [fact, supabase, database, pool]
connects:
  - target: decisions/2026-06-29-pool-tuning-supabase-free
    type: documents
    weight: 0.7
  - target: index
    type: relates
    weight: 0.5
---

# Supabase Free Tier Pool Limit

El pooler de Supabase en plan free limita a **2 conexiones simultáneas**. Configurar Prisma/PostgreSQL pool con `max: 2` para evitar errores `too many connections`.

Connection string de pooler: `postgres://[user]:[pass]@[project-ref].pooler.supabase.com:6543/postgres`

## Verificación
- Configurado en `src/lib/db.ts` con `max: 2`
- k6 load test con 20 usuarios virtuales no excede el límite
- Health endpoint `/api/health` verifica conectividad

## Related
- [[decisions/2026-06-29-pool-tuning-supabase-free]]
