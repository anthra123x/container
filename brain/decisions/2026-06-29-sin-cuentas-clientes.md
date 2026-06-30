---
type: decision
weight: 0.9
status: accepted
date: 2026-06-29
tags: [decision, architecture, auth]
alias: clientes-sin-cuentas
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: sessions/2026-06-29-produccion-sprints
    type: documents
    weight: 0.7
---

# Clientes sin cuentas — rastreo por teléfono

## Context
La tienda vende contenedores a clientes que no quieren crear cuentas. Necesitan poder consultar el estado de su pedido sin autenticación.

## Options Considered
- **Option A**: Cuentas obligatorias (NextAuth con credenciales + proveedores OAuth) — fricción alta para el cliente
- **Option B**: Guest checkout + lookup por email — requiere email válido y es impersonable
- **Option C**: Guest checkout + lookup por teléfono — el teléfono ya se recolecta para el envío, natural para el negocio

## Decision
Option C: lookup por teléfono. El cliente ingresa su número en `/mis-pedidos`, recibe un código SMS (simulado por ahora) y ve sus pedidos. Admin con cuentas reales y roles (SUPER_ADMIN, ADMIN, EDITOR).

## Consequences
- Admin usa NextAuth con rate limiting (5 intentos → 15 min lockout)
- `/mis-pedidos` expone data limitada por búsqueda de teléfono
- Se implementó `requireAdminRole(minLevel)` para server actions
- Admin solo accesible por URL directa `/admin/login` (sin link público)

## Related
- [[index]]
