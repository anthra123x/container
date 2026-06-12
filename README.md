# Container — Tienda de Tecnología

Plataforma e-commerce para tienda de tecnología con panel de administración, desarrollada con **Next.js 16**, **Tailwind CSS v4**, **Prisma ORM** y **Supabase PostgreSQL**.

---

## Stack

| Capa        | Tecnología                                     |
| ----------- | ---------------------------------------------- |
| Framework   | Next.js 16.2.9 (App Router + Turbopack)        |
| UI          | Tailwind CSS v4 + shadcn/ui (Base UI Nova)     |
| Base de datos | Prisma 7 + Supabase PostgreSQL (PgBouncer)   |
| Autenticación | NextAuth v5 (Credentials + JWT)              |
| Formularios | React Hook Form + Zod                          |
| Estado      | Zustand + TanStack React Query                 |
| Iconos      | Lucide React                                   |
| Fuente      | Geist (Vercel)                                 |

---

## Requisitos

- Node.js 20+
- npm / pnpm / yarn
- Cuenta Supabase (o PostgreSQL)

---

## Instalación

```bash
# 1. Clonar
git clone https://github.com/anthra123x/container.git
cd container

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase y AUTH_SECRET

# 4. Ejecutar migraciones y seed
npx prisma migrate dev
npx tsx prisma/seed.ts

# 5. Iniciar servidor de desarrollo
npm run dev
```

---

## Variables de Entorno

| Variable               | Descripción                                  |
| ---------------------- | -------------------------------------------- |
| `DATABASE_URL`         | Cadena de conexión PostgreSQL (Supabase)     |
| `AUTH_SECRET`          | Secreto para JWT (generar con `openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL`  | URL pública de la aplicación                |

---

## Rutas

### Tienda (público)

| Ruta                  | Descripción                          |
| --------------------- | ------------------------------------ |
| `/`                   | Landing page con hero, categorías, productos destacados |
| `/productos`          | Listado de productos con filtros     |
| `/productos/[slug]`   | Detalle de producto                  |
| `/categorias`         | Explorar por categorías              |
| `/promociones`        | Promociones activas                  |
| `/buscar`             | Buscar productos                     |
| `/carrito`            | Carrito de compras                   |
| `/checkout`           | Finalizar compra                     |
| `/contacto`           | Página de contacto                   |
| `/envio`              | Información de envíos                |
| `/devoluciones`       | Política de devoluciones             |

### Autenticación

| Ruta    | Descripción            |
| ------- | ---------------------- |
| `/login`| Inicio de sesión admin |

### Admin (requiere autenticación)

| Ruta                        | Descripción                     |
| --------------------------- | ------------------------------- |
| `/admin`                    | Dashboard con métricas          |
| `/admin/productos`          | Listado de productos            |
| `/admin/productos/nuevo`    | Crear producto                  |
| `/admin/productos/[id]`     | Editar producto                 |
| `/admin/categorias`         | Listado de categorías           |
| `/admin/marcas`             | Listado de marcas               |
| `/admin/ventas`             | Listado de pedidos              |
| `/admin/ventas/[id]`        | Detalle de pedido               |
| `/admin/clientes`           | Listado de clientes             |
| `/admin/reportes`           | Reportes (en construcción)      |
| `/admin/promociones`        | Promociones activas             |
| `/admin/configuracion`      | Configuración (en construcción) |

---

## Seed Data

El seed (`prisma/seed.ts`) crea:

- **1 tienda:** Container
- **1 admin:** `admin@container.com` / `admin123`
- **4 categorías:** Laptops, Audio, Accesorios, Monitores
- **4 marcas:** Lenovo, Sony, Samsung, Apple
- **4 productos destacados** con imágenes de muestra

Para ejecutar:

```bash
npx tsx prisma/seed.ts
```

---

## Comandos

| Comando                | Descripción                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Servidor de desarrollo          |
| `npm run build`        | Build de producción             |
| `npm start`            | Servidor de producción          |
| `npm run lint`         | Linter ESLint                   |
| `npx prisma migrate dev` | Crear migración             |
| `npx prisma studio`    | Explorar base de datos          |
| `npx tsx prisma/seed.ts` | Poblar datos de prueba        |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/        # Login
│   ├── (store)/       # Páginas públicas de la tienda
│   ├── admin/         # Panel de administración
│   └── api/           # API routes (NextAuth)
├── components/
│   ├── admin/         # Componentes del panel admin
│   ├── store/         # Componentes de la tienda
│   └── ui/            # shadcn/ui componentes base
├── hooks/             # Custom hooks
├── lib/
│   ├── queries/       # Funciones de consulta Prisma
│   ├── utils/         # Utilidades (formatters, etc.)
│   └── validations/   # Schemas Zod
├── providers/         # Providers (sesión, tema, query)
└── types/             # Tipos TypeScript
prisma/
└── schema.prisma      # Modelo de datos (17 modelos)
```

---

## Licencia

MIT
