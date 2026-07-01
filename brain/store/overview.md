---
type: project
weight: 0.8
status: active
tags: [store, ecommerce, rutas, ui]
alias: store-overview
connects:
  - target: index
    type: implements
    weight: 0.8
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: implements
    weight: 0.7
---

# Store — Tienda Pública

## Route Map

| Ruta | Componente | Tipo | Descripción |
|------|-----------|------|-------------|
| `/` | `page.tsx` | RSC | Homepage con productos destacados + Hero |
| `/productos` | `page.tsx` | RSC | Catálogo completo con filtro por categoría |
| `/productos/[slug]` | `page.tsx` | RSC | Detalle de producto: imágenes, precio, acciones |
| `/categorias` | `page.tsx` | RSC | Grid de categorías |
| `/buscar` | `page.tsx` | Client | Formulario de búsqueda (redirige a `/productos?q=`) |
| `/carrito` | `page.tsx` | RSC | Carrito de compras con items y totales |
| `/checkout` | `page.tsx` | RSC | Formulario de datos + resumen + crear pedido |
| `/mis-pedidos` | `page.tsx` | RSC | Búsqueda de pedidos por teléfono |
| `/pedido/[id]` | `page.tsx` | RSC | Detalle de pedido + seguimiento |
| `/promociones` | `page.tsx` | RSC | Promociones activas con productos |
| `/contacto` | Page | Static | Información de contacto |
| `/envio` | Page | Static | Política de envíos |
| `/devoluciones` | Page | Static | Política de devoluciones |
| `/terminos` | RSC | Dynamic | Términos y condiciones desde DB |
| `/privacidad` | RSC | Dynamic | Política de privacidad desde DB |

## Key Components

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| `ProductCard` | `components/store/ProductCard.tsx` | Card de producto en grillas |
| `ProductGallery` | `components/store/ProductGallery.tsx` | Galería de imágenes con Embla |
| `ProductActions` | `components/store/ProductActions.tsx` | Botón add-to-cart + cantidad |
| `CartEmptyState` | `components/store/CartEmptyState.tsx` | Estado vacío del carrito |
| `HeroImage` | `components/store/HeroImage.tsx` | Hero de la homepage |
| `PhoneLookup` | `components/store/phone-lookup.tsx` | Búsqueda de pedidos por teléfono |
| `SaveCartPhone` | `components/store/save-cart-phone.tsx` | Guardar carrito con teléfono |

## Shared Classes (globals.css)
- `btn-primary` — Botón principal
- `input-field` — Campos de entrada
- `badge-discount` — Badge de descuento
- `card-base` — Card genérica

## Dynamic Features
- **WhatsApp**: Número y mensaje desde `StoreConfiguration` en DB
- **Metadata**: SEO dinámico (title, description) desde `StoreConfiguration`
- **Términos/Privacidad**: Contenido desde DB con `force-dynamic`

## Related
- [[index]]
- [[admin/overview]]
- [[auth/flow]]
