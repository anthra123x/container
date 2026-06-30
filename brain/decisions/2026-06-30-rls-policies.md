---
type: decision
weight: 0.9
status: accepted
date: 2026-06-30
tags: [decision, security, rls, supabase]
alias: rls-policies
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: sessions/2026-06-30-rls-indexes
    type: documents
    weight: 0.7
---

# RLS Policies y Seguridad

## Context
18 tablas públicas de Supabase tenían RLS deshabilitado. Cualquiera con la anon key (expuesta en el frontend via `NEXT_PUBLIC_SUPABASE_ANON_KEY`) podía leer/escribir toda la base de datos a través de la API REST de Supabase (PostgREST).

## Risk Assessment
- La app usa **Prisma** para TODAS las operaciones de base de datos (server-side, via DATABASE_URL)
- La anon key se usa solo para `getPublicUrl()` en el frontend (construye URLs de imágenes)
- Riesgo real: alguien usa la anon key para llamar a la API REST de Supabase directamente

## Options Considered
- **Option A**: RLS granular (SELECT público para catálogo, mutaciones solo admin) — complejo, inútil porque Prisma bypassa RLS
- **Option B**: Block anon + authenticated completamente en todas las tablas — simple, correcto para la arquitectura
- **Option C**: No hacer nada — riesgo de exposición de datos

## Decision
Option B: RLS blocking policies para `anon` y `authenticated` en todas las 18 tablas. Todo el acceso a datos va por Prisma.

## Consequences
- ✅ 18 errores de seguridad eliminados
- ✅ Storage bucket `product-images` ahora bloquea subidas anónimas
- 🟡 Storage SELECT policy permite listar archivos (necesario para imágenes públicas)
- No afecta al funcionamiento de la app (Prisma no usa PostgREST)

## Related
- [[index]]
