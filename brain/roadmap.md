---
type: project
weight: 0.9
status: active
tags: [roadmap, planning, sprints]
alias: roadmap
connects:
  - target: index
    type: implements
    weight: 1.0
  - target: changelog
    type: documents
    weight: 0.7
---

# Roadmap — Container Store

## Vision
Plataforma de e-commerce para venta de contenedores (plástico, metal, tela) enfocada en el mercado colombiano. Clientes compran sin cuenta (solo teléfono para tracking). Admin completo con roles para gestión de inventario, pedidos y clientes.

## Milestones

### 🏁 v1.0 — Producción (Actual)
Store pública funcional + Admin completo + Seguridad

### 🎯 v1.1 — Pagos + Datos (Siguiente)
- Integración de pasarela de pagos (EPayco/PayU/placeToPay)
- Seed masivo de productos (50+)
- Notificaciones de estado de pedido vía WhatsApp

### 🎯 v1.2 — UX + Crecimiento
- Búsqueda avanzada con filtros
- Galerías de imágenes por producto
- Variantes (tamaño, color) operativas
- Sugerencias de productos relacionados

### 🎯 v2.0 — Escalabilidad
- Migrar a Supabase Pro (7 conexiones pool)
- CDN para imágenes
- PWA
- Analytics avanzados

## Sprints Completados

| Sprint | Enfoque | Estado |
|--------|---------|--------|
| 1 | WhatsApp dinámico + Error/404/Loading | ✅ |
| 2 | next.config.ts (security headers) + health endpoint | ✅ |
| 3 | Role verification + Rate limit login | ✅ |
| 4 | next/image + generateMetadata | ✅ |
| 5 | Términos/privacidad + RLS storage + CI/CD | ✅ |
| 6 | Sentry + Pool tuning + k6 load tests | ✅ |

## Sprints Pendientes

| Sprint | Enfoque | Prioridad |
|--------|---------|-----------|
| 7 | RLS + Indexes + Vault neural | ✅ Completado |
| 8 | Seeds + Deploy + CI secrets | ✅ Completado |
| 9 | Payment integration | ✅ Completado |
| 10 | Notificaciones WhatsApp | 🟡 Media |
| 11 | Búsqueda + filtros avanzados | 🟡 Media |
| 12 | Galerías + variantes operativas | 🟢 Baja |

## Related
- [[index]]
- [[changelog]]
