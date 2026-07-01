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

## 2026-07-01 — Sprint 10: WhatsApp Notifications
- ✅ WhatsApp service (`src/lib/whatsapp.ts`): Cloud API + wa.me fallback
- ✅ Auto-notifica al cliente al cambiar estado desde admin ventas
- ✅ Mensajes personalizados por estado: CONFIRMADO, PREPARANDO, EN CAMINO, ENTREGADO, CANCELADO, REEMBOLSO
- ✅ Fallback: si Cloud API no está configurado, genera link wa.me manual
- ✅ `.env.example` con `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`
- ✅ Build 0 errors, Lint 0 errors
- ⬜ Pendiente: configurar WhatsApp Business API en Facebook Developers

## 2026-07-01 — Sprint 9: ePayco Payment Integration
- ✅ ePayco checkout API (`src/lib/epayco.ts`): `createEpaycoCheckout()` + `verifyEpaycoSignature()`
- ✅ Checkout flow redirige a ePayco después de crear la orden
- ✅ Webhook (`/api/epayco/confirm`): recibe confirmación, actualiza estado a CONFIRMED + paidAt + epaycoRef
- ✅ Migración `0002_add_epayco_fields`: columnas `epaycoRef` y `paymentMethod` en Order
- ✅ Order confirmation (`/pedido/[id]`): muestra estado según resultado del pago (success/failed/pending)
- ✅ `.env.example` con `EPAYCO_PUBLIC_KEY`, `EPAYCO_PRIVATE_KEY`, `EPAYCO_CUSTOMER_ID`, `EPAYCO_TEST`
- ✅ Build 0 errors, Tests 31/31, Lint 0 errors
- ⬜ Pendiente: obtener credenciales ePayco y configurar en `.env` y GitHub Secrets

## 2026-07-01 — Sprint 8: Seed Masivo + CI Fix + Secrets
- ✅ Seed expandido: 4 → 31 productos, 4 → 6 categorías, 4 → 10 marcas
- ✅ Nuevas categorías: Almacenamiento, Periféricos
- ✅ Nuevas marcas: LG, Harman Kardon, JBL, Logitech, Kingston, HP
- ✅ Precios realistas en COP con comparePrice para descuentos
- ✅ `npm run seed` en package.json
- ✅ CI/CD: branch `main` → `master` (branch real del repo)
- ✅ `.env` documentado con placeholders para `SUPABASE_SERVICE_ROLE_KEY` y `SENTRY_*`
- ✅ Vault docs actualizados (database/schema.md, data/products.md)
- ✅ Build 0 errors, Tests 31/31, Lint 0 errors

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
