---
type: project
weight: 0.5
status: active
tags: [data, products, catalog, seed]
alias: data-products
connects:
  - target: index
    type: relates
    weight: 0.5
  - target: database/schema
    type: documents
    weight: 0.6
---

# Data — Catálogo de Productos

## Estado Actual
- **Productos**: 2
- **Categorías**: 5
- **Marcas**: 4
- **Promociones**: 0

## Categorías

| Nombre | Slug | Productos |
|--------|------|-----------|
| (desde DB) | | |

*Nota: Poblar desde Supabase Dashboard > Table Editor > Category*

## Marcas

| Nombre | Slug | Productos |
|--------|------|-----------|
| (desde DB) | | |

*Nota: Poblar desde Supabase Dashboard > Table Editor > Brand*

## Seed Data
- Archivo: `prisma/seed.ts`
- Admin seed: `admin@container.com` / `admin123` (SUPER_ADMIN)
- Productos seed: 2 productos de ejemplo

## Próximos Pasos
1. Seed masivo (50+ productos) con datos reales del negocio
2. Imágenes reales en Supabase Storage
3. Variantes (tamaños, colores) para productos que apliquen
4. Promociones para temporada

## Related
- [[index]]
- [[database/schema]]
- [[admin/overview]]
