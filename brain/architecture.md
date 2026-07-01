---
type: project
weight: 0.8
status: active
tags: [architecture, system-design]
alias: architecture
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: stack
    type: documents
    weight: 0.7
  - target: database/schema
    type: documents
    weight: 0.8
  - target: auth/flow
    type: documents
    weight: 0.7
  - target: deployment/env
    type: documents
    weight: 0.6
---

# System Architecture

## Layer Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                    │
│  Next.js 16 SSR / React 19                           │
│  TanStack Query / Zustand / Sonner                   │
└──────────┬──────────────┬────────────────┬───────────┘
           │ HTTP         │ Server Actions  │ Supabase
           │ (RSC)        │ (FormData)      │ Storage
           ▼              ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                Next.js 16 Server                      │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ App Router  │  │Server Actions│  │ Middleware   │  │
│  │ RSC/P Pages │  │ (cart, order,│  │ (auth check) │  │
│  │             │  │  products)   │  │             │  │
│  └──────┬──────┘  └──────┬───────┘  └─────────────┘  │
│         │                │                            │
│         ▼                ▼                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │              Prisma ORM (v7)                     │  │
│  │         pg adapter + library engine              │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         │                              │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │     Supabase Pooler (max 2 connections)          │  │
│  │     PostgreSQL (free tier)                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Supabase Admin       │  │ Sentry (error track) │  │
│  │ (service role, lazy) │  │ (prod only)          │  │
│  └──────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Store (Público)
```
User → Server Component (RSC) → Prisma → DB
User → Server Action (cart) → Prisma → DB → revalidatePath
User → Supabase Client → getPublicUrl (storage)
```

### Admin (Autenticado)
```
Admin → NextAuth (credentials) → JWT → session
Admin → Server Action → requireAdminRole() → Prisma → DB
Admin → Server Action → getSupabaseAdmin() → Storage upload/remove
```

## Key Architectural Decisions
- **No PostgREST**: Todo el acceso a DB va por Prisma (server-side). RLS es defense-in-depth.
- **Server Actions con FormData**: Sin API REST expuesta para mutaciones.
- **No client accounts**: Los clientes no se registran. Rastrean pedidos por teléfono.
- **Admin por URL directa**: `/admin/login` sin link público desde la store.
- **Pool max 2**: Limitado por free tier de Supabase. Graceful shutdown configurado.

## Related
- [[index]]
- [[stack]]
- [[database/schema]]
- [[api/endpoints]]
