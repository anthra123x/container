---
type: project
weight: 0.8
status: active
tags: [database, schema, prisma, supabase]
alias: database-schema
connects:
  - target: index
    type: implements
    weight: 0.8
  - target: decisions/2026-06-29-pool-tuning-supabase-free
    type: documents
    weight: 0.7
  - target: decisions/2026-06-30-rls-policies
    type: documents
    weight: 0.7
  - target: facts/supabase-free-tier-pool
    type: documents
    weight: 0.6
---

# Database — Schema & Migrations

## Entity Relationship

```
Store (1) ──┬── (N) User
            ├── (N) Product ──┬── (N) ProductImage
            │                 ├── (N) ProductVariant
            │                 ├── (N) Gallery ── (N) GalleryImage
            │                 └── (N) ProductPromotion ── (1) Promotion
            ├── (N) Category (self-referencing parent/children)
            ├── (N) Brand
            ├── (N) Customer ── (N) Order ──┬── (N) OrderItem
            │                               └── (N) OrderStatusHistory
            ├── (N) Cart ── (N) CartItem
            └── (1) StoreConfiguration
```

## Tables (18 total)

| Tabla | Filas | Propósito |
|-------|-------|-----------|
| `Store` | 1 | Tienda (multi-tenant listo) |
| `User` | 1 | Usuarios admin |
| `StoreConfiguration` | 1 | Configuración de tienda (WhatsApp, SEO, términos) |
| `Category` | 5 | Categorías con jerarquía (parentId) |
| `Brand` | 4 | Marcas |
| `Product` | 2 | Productos |
| `ProductImage` | 2 | Imágenes de productos |
| `ProductVariant` | 0 | Variantes (tamaño, color) — sin uso aún |
| `Gallery` | 0 | Galerías de imágenes |
| `GalleryImage` | 0 | Imágenes de galería |
| `Promotion` | 0 | Promociones |
| `ProductPromotion` | 0 | Productos en promoción |
| `Customer` | 2 | Clientes (sin cuenta) |
| `Order` | 2 | Pedidos |
| `OrderItem` | 2 | Items de pedido |
| `OrderStatusHistory` | 4 | Historial de cambios de estado |
| `Cart` | 3 | Carritos de compra (por sessionId) |
| `CartItem` | 1 | Items en carrito |

## Enums
- `UserRole`: SUPER_ADMIN, ADMIN, EDITOR, VIEWER
- `OrderStatus`: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED | CANCELLED | REFUNDED
- `OrderSource`: STORE, WHATSAPP, MANUAL
- `VariantType`: COLOR, STORAGE, SIZE, OTHER
- `PromotionType`: PERCENTAGE, FIXED_AMOUNT

## Index Strategy

| Tabla | Índices | Propósito |
|-------|---------|-----------|
| `Product` | `(storeId, slug)` único, `categoryId`, `brandId`, `(isActive, isFeatured)`, `storeId` | Búsqueda y catálogo |
| `ProductImage` | `productId` | Galería por producto |
| `ProductVariant` | `productId` | Variantes por producto |
| `GalleryImage` | `galleryId` | Imágenes de galería |
| `Order` | `storeId`, `customerId`, `status`, `createdAt` | Listado y filtros |
| `OrderItem` | `orderId` | Items por orden |
| `OrderStatusHistory` | `orderId`, `changedBy` | Historial |
| `Cart` | `sessionId` | Carrito por sesión |
| `CartItem` | `cartId`, `productId`, `variantId` | Items por carrito |

## Migrations

| Migración | Cambio |
|-----------|--------|
| `0001_add_login_attempts` | `loginAttempts`, `lockoutUntil` en User |

## Pool Configuration
- `max: 2` (Supabase free tier limit)
- `idleTimeoutMillis: 10000`
- `allowExitOnIdle: true`
- Graceful shutdown on SIGTERM/SIGINT

## RLS
- 18 tablas con RLS enabled
- Políticas: block all anon + authenticated
- Storage: block anon uploads, allow public SELECT

## Related
- [[index]]
- [[architecture]]
- [[facts/supabase-free-tier-pool]]
