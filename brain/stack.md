---
type: project
weight: 0.7
status: active
tags: [stack, tecnologia, versiones]
alias: stack
connects:
  - target: index
    type: implements
    weight: 0.8
  - target: architecture
    type: documents
    weight: 0.7
---

# Tech Stack

## Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| TypeScript | 5.x | Lenguaje principal |
| Node.js | 24.18.0 | Runtime |
| Next.js | 16.2.9 | Framework fullstack (App Router) |
| React | 19.2.4 | UI |
| Tailwind CSS | 4 | Estilos |
| shadcn/ui | Base UI | Componentes base |

## Backend / DB

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Prisma | 7.8.0 | ORM + Migraciones |
| Supabase PostgreSQL | - | Base de datos |
| Supabase Storage | - | Imágenes de productos |
| pg (node-postgres) | 8.21.0 | Pool de conexiones |
| NextAuth | 5.0.0-beta.31 | Autenticación admin |

## Frontend Libraries

| Librería | Versión | Propósito |
|----------|---------|-----------|
| TanStack Query | 5.101.0 | Data fetching admin |
| Zustand | 5.0.14 | Estado global carrito |
| React Hook Form | 7.78.0 | Formularios admin |
| Zod | 4.4.3 | Validaciones |
| Sonner | 2.0.7 | Notificaciones toast |
| Recharts | 3.8.1 | Gráficos reportes |
| Lucide React | 1.18.0 | Iconos |
| date-fns | 4.4.0 | Fechas |
| Embla Carousel | 8.6.0 | Galería imágenes |
| bcryptjs | 3.0.3 | Hash contraseñas |
| class-variance-authority | 0.7.1 | Variantes de componentes |

## Monitoreo

| Tecnología | Propósito |
|------------|-----------|
| Sentry | Error tracking + performance (solo prod) |
| k6 | Load testing |

## CI/CD

| Tecnología | Propósito |
|------------|-----------|
| GitHub Actions | Lint → Build → Test |
| Vitest | Unit tests |
| Testing Library | Component tests |

## Infrastructure (Supabase)

| Recurso | Detalle |
|---------|---------|
| Proyecto ID | `bhrcgjoxlaczltshijtr` |
| Región | us-west-2 |
| Plan | Free (2 conexiones pool) |
| Storage Bucket | `product-images` (público) |
| DB Host | `db.bhrcgjoxlaczltshijtr.supabase.co` |

## Related
- [[index]]
- [[architecture]]
