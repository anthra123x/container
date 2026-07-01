---
type: project
weight: 0.8
status: active
tags: [admin, panel, crud, roles]
alias: admin-overview
connects:
  - target: index
    type: implements
    weight: 0.8
  - target: auth/flow
    type: depends
    weight: 0.8
  - target: decisions/2026-06-29-sin-cuentas-clientes
    type: implements
    weight: 0.7
---

# Admin — Panel de Administración

## Route Map

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con estadísticas (ventas, pedidos, productos bajos en stock) |
| `/admin/login` | Login con credenciales + rate limiting |
| `/admin/productos` | Lista de productos con búsqueda y paginación |
| `/admin/productos/nuevo` | Crear producto (formulario completo) |
| `/admin/productos/[id]` | Editar producto + imágenes |
| `/admin/categorias` | Lista de categorías |
| `/admin/categorias/nuevo` | Nueva categoría |
| `/admin/categorias/[id]` | Editar categoría |
| `/admin/marcas` | Lista de marcas |
| `/admin/marcas/nuevo` | Nueva marca |
| `/admin/marcas/[id]` | Editar marca |
| `/admin/promociones` | Lista de promociones |
| `/admin/promociones/nuevo` | Nueva promoción |
| `/admin/clientes` | Lista de clientes |
| `/admin/ventas` | Órdenes con filtros y paginación |
| `/admin/ventas/[id]` | Detalle de orden + cambio de estado |
| `/admin/usuarios` | Usuarios del sistema |
| `/admin/usuarios/nuevo` | Crear usuario admin |
| `/admin/usuarios/[id]` | Editar usuario admin |
| `/admin/configuracion` | Configuración de la tienda (StoreConfiguration) |
| `/admin/reportes` | Reportes con gráficos (Recharts) |
| `/admin/marcas` | Lista de marcas |

## Role System

| Rol | Nivel | Permisos |
|-----|-------|----------|
| `SUPER_ADMIN` | 3 | Acceso total |
| `ADMIN` | 2 | CRUD productos, categorías, marcas, órdenes, clientes |
| `EDITOR` | 1 | CRUD productos, categorías, marcas (solo lectura en config) |
| `VIEWER` | 0 | Solo lectura |

Helper: `requireAdminRole(minLevel: number)` en `src/lib/auth-helpers.ts`

## Image Management
- Upload via `getSupabaseAdmin()` (service role key)
- Tipos permitidos: JPEG, PNG, WebP
- Max size: 5MB
- Reorder, set primary, delete operations
- Storage bucket: `product-images`

## Related
- [[index]]
- [[store/overview]]
- [[auth/flow]]
