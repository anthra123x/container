---
type: project
weight: 0.8
status: active
tags: [auth, nextauth, roles, rate-limiting]
alias: auth-flow
connects:
  - target: index
    type: implements
    weight: 0.8
  - target: admin/overview
    type: depends
    weight: 0.8
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: documents
    weight: 0.8
---

# Auth — Autenticación y Roles

## Arquitectura

```
Login (/admin/login)
    │
    ▼
NextAuth v5 (credentials provider)
    │
    ├── authorize() → verifica email + password
    │   └── checkLoginAttempts() → rate limiting
    │
    ▼
JWT Session → middleware protege /admin/*
    │
    ▼
Server Actions → requireAdminRole(minLevel)
```

## Providers
- **Credentials**: email + password (único proveedor)
- No hay OAuth, no hay magic links, no hay registro público

## Rate Limiting

| Parámetro | Valor |
|-----------|-------|
| Max attempts | 5 |
| Lockout duration | 15 minutos |
| Campo en User | `loginAttempts` (int), `lockoutUntil` (timestamp) |

Comportamiento:
1. Login fallido → `loginAttempts++`
2. `loginAttempts >= 5` → `lockoutUntil = now + 15 min`
3. Durante lockout → error "Cuenta bloqueada temporalmente"
4. Login exitoso → reset `loginAttempts = 0`, `lockoutUntil = null`
5. Lockout expirado → reset automático (siguiente intento)

## Role Hierarchy

```
SUPER_ADMIN (3) ─── Acceso total
    │
ADMIN (2) ───────── CRUD productos, órdenes, clientes, config
    │
EDITOR (1) ──────── CRUD productos, categorías, marcas (sin config)
    │
VIEWER (0) ──────── Solo lectura
```

Helper `requireAdminRole(minLevel)`:
- Obtiene session via `auth()`
- Verifica `session.user.role` contra enum
- Si no cumple → lanza `LockoutError` (error específico para UI)
- Breadcrumbs: `src/lib/auth-helpers.ts`

## Seed
- Admin por defecto: `admin@container.com` / `admin123` (SUPER_ADMIN)
- Seed en `prisma/seed.ts`

## Related
- [[index]]
- [[admin/overview]]
- [[decisions/2026-06-29-sin-cuentas-clientes]]
