---
type: project
weight: 0.7
status: active
tags: [api, server-actions, endpoints, storage]
alias: api-endpoints
connects:
  - target: index
    type: implements
    weight: 0.7
  - target: database/schema
    type: documents
    weight: 0.6
---

# API — Endpoints & Server Actions

## REST Endpoints

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | All | NextAuth handler (credentials provider) |
| `/api/health` | GET | Health check: DB connectivity + uptime |

### `/api/health` Response
```json
{
  "status": "ok",
  "timestamp": "2026-06-30T00:00:00.000Z",
  "uptime": 12345,
  "database": "connected"
}
```

## Server Actions

| Archivo | Acciones | Propósito |
|---------|----------|-----------|
| `lib/actions/cart.ts` | `addToCart`, `removeFromCart`, `updateCartQuantity` | CRUD carrito (session-based) |
| `lib/actions/order.ts` | `createOrder`, `updateOrderStatus` | Gestión de pedidos |
| `lib/actions/product-images.ts` | `uploadProductImages`, `deleteProductImage`, `setPrimaryImage`, `reorderImages` | Gestión de imágenes (admin) |

### Cart Flow
1. Guest visita store → cookie `cart_session` se crea si no existe
2. `addToCart` → crea/actualiza Cart + CartItem en DB
3. `removeFromCart` / `updateCartQuantity` → modifica items
4. Checkout → `createOrder` → Cart items → OrderItems → Cart limpio

### Order Flow
1. Cliente llena formulario en `/checkout`
2. `createOrder` valida stock, calcula totales, crea Order + OrderItems
3. OrderStatusHistory se crea con status PENDING
4. Admin puede cambiar estado via `updateOrderStatus`

### Image Flow
1. Admin upload → `getSupabaseAdmin().storage.from('product-images').upload()`
2. URL pública generada → guardada en ProductImage
3. Admin puede reordenar, cambiar primary, eliminar
4. Delete → remove de storage + delete de DB

## Supabase Storage

| Operación | Cliente | Auth |
|-----------|---------|------|
| Upload | `getSupabaseAdmin()` | Service role key |
| Remove | `getSupabaseAdmin()` | Service role key |
| getPublicUrl | `supabase` (anon) | None (URL pública) |

Bucket: `product-images`
- SELECT: público (ver imágenes)
- INSERT/UPDATE/DELETE: service role only

## Related
- [[index]]
- [[architecture]]
- [[store/overview]]
- [[admin/overview]]
