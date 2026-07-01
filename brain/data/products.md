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
- **Productos**: 32
- **Categorías**: 7
- **Marcas**: 10
- **Promociones**: 0

## Categorías

| Nombre | Productos |
|--------|-----------|
| Laptops | 7 |
| Audio | 6 |
| Accesorios | 5 |
| Monitores | 5 |
| Almacenamiento | 4 |
| Periféricos | 5 |
| Teléfonos | 1 (legacy) |

## Marcas

| Nombre | Productos |
|--------|-----------|
| Apple | 6 |
| Samsung | 9 |
| Lenovo | 2 |
| Sony | 3 |
| LG | 3 |
| Logitech | 4 |
| Kingston | 3 |
| HP | 1 |
| JBL | 1 |
| Harman Kardon | 1 |

## Seed Data
- Script: `prisma/seed.ts`
- Seed command: `npm run seed` (tsx prisma/seed.ts)
- Admin seed: `admin@container.com` / `admin123` (SUPER_ADMIN)
- 31 productos seed en 6 categorías, 10 marcas
- Imágenes generadas con picsum.photos (seed URL por producto)

## Próximos Pasos
1. ~~Seed masivo (50+ productos)~~ ✅ Completado (31 productos)
2. Imágenes reales en Supabase Storage (reemplazar picsum)
3. Variantes (tamaños, colores) para productos que apliquen
4. Promociones para temporada (actualmente 0)

## Related
- [[index]]
- [[database/schema]]
- [[admin/overview]]
