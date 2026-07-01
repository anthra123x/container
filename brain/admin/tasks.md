---
type: project
weight: 0.9
status: active
tags: [tasks, pending, manual, config]
alias: pending-tasks
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: deployment/env
    type: documents
    weight: 0.8
---

# Tareas Pendientes — Configuración Manual

## 🔴 Alta Prioridad (requerido para producción)

### 1. Dominio personalizado (cuando lo compres)
- Comprar dominio en cualquier proveedor (Namecheap, GoDaddy, .com.co, etc.)
- Agregarlo a Vercel:
  ```bash
  vercel domain add tudominio.com
  ```
- Configurar DNS: `A tudominio.com → 76.76.21.21`
- Luego actualizar `NEXT_PUBLIC_APP_URL` en Vercel:
  ```bash
  vercel env rm NEXT_PUBLIC_APP_URL production
  echo "https://tudominio.com" | vercel env add NEXT_PUBLIC_APP_URL production
  ```
- El deploy se realiasola solo.

### 2. SUPABASE_SERVICE_ROLE_KEY
- Ir a [Supabase Dashboard](https://supabase.com) > Project > Settings > API
- Copiar `service_role` key (⚠️ NUNCA exponer en frontend)
- Agregar a:
  - `.env` local: `SUPABASE_SERVICE_ROLE_KEY="tu_key_aqui"`
  - Vercel: `vercel env add SUPABASE_SERVICE_ROLE_KEY production`
  - GitHub Secrets: `gh secret set SUPABASE_SERVICE_ROLE_KEY --repo anthra123x/container --body "tu_key_aqui"`

### 3. ePayco — Credenciales de pago
- Registrarse en [ePayco](https://epayco.co) (si no tienes cuenta)
- Ir a Módulo Administrativo > Integraciones
- Copiar `P_CUST_ID_CLIENTE`, `PUBLIC_KEY`, `PRIVATE_KEY`
- Agregar a `.env` local y Vercel:
  ```bash
  vercel env add EPAYCO_PUBLIC_KEY production
  vercel env add EPAYCO_PRIVATE_KEY production
  ```
- En pruebas: dejar `EPAYCO_TEST="true"`. Cambiar a `"false"` en producción.

## 🟡 Media Prioridad

### 4. WhatsApp Cloud API
- Ir a [Facebook Developers](https://developers.facebook.com)
- Crear app > WhatsApp > Get Started
- Configurar Webhook y generar token permanente
- Agregar a `.env` y Vercel:
  ```bash
  vercel env add WHATSAPP_PHONE_NUMBER_ID production
  vercel env add WHATSAPP_ACCESS_TOKEN production
  ```

### 5. Sentry — Monitoreo de errores
- Crear proyecto en [Sentry](https://sentry.io)
- Copiar DSN, org slug, project slug
- Agregar a `.env` y Vercel:
  ```bash
  vercel env add SENTRY_DSN production
  vercel env add SENTRY_ORG production
  vercel env add SENTRY_PROJECT production
  ```

## 🟢 Baja Prioridad

### 6. Productos — Imágenes reales
- Reemplazar URLs de `picsum.photos` en Supabase Storage
- Subir imágenes reales al bucket `product-images`
- Actualizar `ProductImage.url` en la DB

## Lo que ya está configurado (no necesitas hacer nada) ✅

| Variable | Dónde está configurada |
|----------|----------------------|
| `DATABASE_URL` | .env ✅ · Vercel ✅ · GitHub Secrets ✅ |
| `AUTH_SECRET` | .env ✅ · Vercel ✅ · GitHub Secrets ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | .env ✅ · Vercel ✅ · GitHub Secrets ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env ✅ · Vercel ✅ · GitHub Secrets ✅ |
| `NEXT_PUBLIC_APP_URL` | .env ✅ · Vercel ✅ (`https://container-store-seven.vercel.app`) |
| CI/CD branch | `master` ✅ (lint → build → test) |
| Migration `0002_add_epayco_fields` | Supabase DB ✅ |
| Seed 31 productos | DB ✅ |
| ePayco webhook endpoint | `/api/epayco/confirm` ✅ |
| WhatsApp service + fallback | `src/lib/whatsapp.ts` ✅ |

## Related
- [[index]]
- [[deployment/env]]
- [[changelog]]
