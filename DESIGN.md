---
name: Container Store
description: Galería premium colombiana de tecnología — Liquid Glass, producto como protagonista
colors:
  accent: oklch(0.55 0.18 255)
  accent-soft: oklch(0.9 0.04 255)
  ink: oklch(0.13 0.01 260)
  surface: oklch(0.99 0.002 260)
  muted-surface: oklch(0.96 0.004 260)
  muted-ink: oklch(0.56 0.01 260)
  subtle-ink: oklch(0.45 0.01 260)
  boundary: oklch(0.92 0.004 260)
  glass-bg: oklch(1 0 0 / 0.6)
  glass-border: oklch(1 0 0 / 0.8)
  glass-highlight: oklch(1 0 0 / 0.5)
  glass-shadow: oklch(0.13 0.01 260 / 0.06)
typography:
  display:
    fontFamily: var(--font-sans)
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.04em
  heading:
    fontFamily: var(--font-sans)
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.03em
  body:
    fontFamily: var(--font-sans)
    fontSize: 0.875rem
    lineHeight: 1.6
    color: oklch(0.45 0.01 260)
  label:
    fontFamily: var(--font-sans)
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.1em
    textTransform: uppercase
  caption:
    fontFamily: var(--font-sans)
    fontSize: 0.75rem
    color: oklch(0.56 0.01 260)
rounded:
  default: 0.625rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.25rem
corner:
  button: 0.75rem
  card: 1.25rem
  panel: 1.25rem
  input: 0.625rem
  badge: 9999px
glass:
  background: oklch(1 0 0 / 0.6)
  blur: 16px
  border: 1px solid oklch(1 0 0 / 0.8)
  highlight: inset 0 1px 0 oklch(1 0 0 / 0.5)
  shadow: 0 4px 24px oklch(0.13 0.01 260 / 0.06)
  strong-bg: oklch(1 0 0 / 0.75)
  strong-blur: 24px
  strong-shadow: 0 8px 32px oklch(0.13 0.01 260 / 0.08)
animation:
  default-duration: 0.6s
  default-easing: cubic-bezier(0.16, 1, 0.3, 1)
  press-scale: 0.97
nav:
  height: 64px
  bg-blur: 20px
spacing:
  section: 5rem
  section-inner: 1.5rem
---

# Design System: Container — Liquid Glass

## 1. Overview

**Creative North Star: "Vitrina de Cristal"** — cada producto reposa en una vitrina invisible de vidrio líquido. La interfaz es la vitrina: el fondo se desvanece, el producto emerge con claridad absoluta, la luz lo atraviesa.

Container es una galería premium de productos tecnológicos. La venta se concreta por WhatsApp. No hay checkout, no hay carrito, no hay cuentas. El producto es el protagonista absoluto.

La estética Liquid Glass toma principios del diseño industrial de Apple: superficies translúcidas con `backdrop-filter`, bordes con highlight interno que simulan refracción de luz, sombras tintadas al tono del fondo, tipografía bold como único acento gráfico.

**Key Characteristics:**
- Producto como protagonista, no la interfaz
- Liquid Glass: backdrop-blur + bordes translúcidos + highlight interno
- Acero-azul (steel blue) como único acento cromático (oklch 0.55 0.18 255)
- Fondos limpios con micro-tono frío (no beige, no crema)
- Geist como única familia tipográfica
- Espaciado generoso (secciones de 5rem/80px)
- Animaciones entrada con cubic-bezier(0.16, 1, 0.3, 1) — elástico pero contenidas

## 2. Colors

La paleta es acero-azul sobre neutros fríos. Sin beige, sin crema, sin tonos cálidos.

### Accent
- **Acero Azul** (`oklch(0.55 0.18 255)`): Único acento cromático. Botones, links, iconos, acentos activos.
- **Accent Soft** (`oklch(0.9 0.04 255)`): Fondos de hover y estados secundarios del acento.

### Neutral Frío
- **Surface** (`oklch(0.99 0.002 260)`): Fondo de página. Casi blanco con micro-tono frío.
- **Muted Surface** (`oklch(0.96 0.004 260)`): Secciones alternas, fondos de tarjetas de sumario.
- **Ink** (`oklch(0.13 0.01 260)`): Casi negro. Texto principal, títulos.
- **Muted Ink** (`oklch(0.56 0.01 260)`): Gris frío medio. Texto secundario, metadata.
- **Subtle Ink** (`oklch(0.45 0.01 260)`): Gris frío oscuro. Body text, descripciones.
- **Boundary** (`oklch(0.92 0.004 260)`): Gris frío claro. Bordes, separadores.

### Glass Tokens
- **glass-bg**: `oklch(1 0 0 / 0.6)` — Fondo translúcido para paneles glass
- **glass-border**: `oklch(1 0 0 / 0.8)` — Borde blanco semi-opaco
- **glass-highlight**: `oklch(1 0 0 / 0.5)` — Highlight interno para simular refracción
- **glass-shadow**: `oklch(0.13 0.01 260 / 0.06)` — Sombra tintada al tono del fondo

### Named Rules
**Regla del Acento Único.** Acero-azul es el único color de acento. Nunca combinado con un segundo acento.

**Regla Fría.** Los neutros son fríos (hue ~260). No hay tonos cálidos en la paleta base.

## 3. Typography

**Familia única:** `Geist` (via `next/font/google`) — sans-serif geométrica con calidez minimalista, la misma que usa Vercel. Sin serifa display separada.

**Character:** Precisa, moderna, legible. Geist combina claridad técnica con la calidez justa para no sentirse fría.

### Hierarchy
- **Display** (`font-bold`, `tracking-tight`, `text-4xl` → `text-6xl`, `leading-[1.05]`): Hero y titulares principales. `text-balance`.
- **Heading** (`font-bold`, `tracking-tight`, `text-2xl/3xl`): Encabezados de sección.
- **Title** (`font-semibold`, `text-base`): Nombres de producto, títulos de card.
- **Body** (`text-sm`, `leading-relaxed`, `color: oklch(0.45 0.01 260)`): Descripciones, párrafos. Max 65-75ch.
- **Label** (`text-xs`, `font-semibold`, `uppercase`, `tracking-widest`): Categorías, metadatos, badges.
- **Caption** (`text-xs`, `color: oklch(0.56 0.01 260)`): Fechas, información secundaria.

### Named Rules
**Regla de una Sola Familia.** Geist en todos lados. La variación viene de weight, size, y tracking. Sin fuentes decorativas.

## 4. Liquid Glass System

El sistema reemplaza cards tradicionales (border + bg sólido) por paneles de vidrio. No hay `ring-1` genérico — cada panel usa glass tokens.

### Glass Panel (Default)
```
background: oklch(1 0 0 / 0.6)
backdrop-filter: blur(16px)
border: 1px solid oklch(1 0 0 / 0.8)
box-shadow:
  0 1px 0 oklch(1 0 0 / 0.5)        /* highlight interno */
  0 4px 24px oklch(0.13 0.01 260 / 0.06)  /* sombra tintada */
rounded-2xl (1.25rem)
```

### Glass Panel (Strong)
```
background: oklch(1 0 0 / 0.75)
backdrop-filter: blur(24px)
box-shadow:
  inset 0 1px 0 oklch(1 0 0 / 0.6)
  0 8px 32px oklch(0.13 0.01 260 / 0.08)
rounded-2xl (1.25rem)
```

### Scrollbar
- 6px width, thumb con 15% de acero-azul, hover 30%
- Track transparente

### Selection
- Fondo con 25% de acero-azul

### Named Rules
**Regla del Vidrio.** Toda superficie elevada usa glass tokens. No hay ring-1, no hay box-shadow genérico.
**Regla del Highlight.** Todo panel glass tiene highlight interno superior para simular refracción de luz.

## 5. Components

### GlassPanel
- `as` prop: div (default), section, article, aside
- `variant`: "default" (translúcido) | "strong" (más opaco)
- Props estándar HTML (className, style, etc.) spread automáticamente

### WhatsApp Floating Button
- Position: fixed bottom-6 right-6 (desktop: bottom-8 right-8)
- Tamaño: 56px, rounded-full
- Gradiente verde: #25D366 → #128C7E
- Hover: escala 1.08, sombra intensificada
- Variant: "floating" (fixed) | "inline" (flow)

### Buttons
- **Primary:** Fondo acero-azul + box-shadow con tinted accent shadow. Hover: más oscuro. Active: scale(0.97).
- **Ghost:** Sin fondo. Hover: 8% acero-azul. Active: scale(0.97).
- **WhatsApp:** Gradiente verde linear(135deg). Hover: más oscuro + shadow intensificado.

### Navigation
- **Desktop:** Fixed top-0. Glass bg con scrolled detection. Links con hover/active acero-azul. Underline animado en active.
- **Mobile:** Drawer glass desde derecha. Links con highlight acero-azul 8% en active.

### ProductCard
- **Corner:** rounded-2xl
- **Container:** glass panel default
- **Image:** Aspect ratio 1:1, object-cover, hover scale(1.1) con 500ms ease-out
- **Info:** Categoría como label uppercase, nombre ink, precio acero-azul bold
- Stock indicators: amber (bajo stock, 5 o menos), green (en stock)

### Inputs
- Borde boundary, fondo glass (60% opaco)
- Focus: borde acero-azul 50% + box-shadow 3px con 12% acero-azul

### Forms (ReviewForm)
- Glass panel strong container
- Inputs con glass styling
- WhatsApp CTA inline

## 6. Animation

### Easing Global
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

### Durationes
| Elemento | Duración |
|----------|----------|
| fade-in, slide-up | 0.6s |
| scale-in | 0.5s |
| Hover en card | 500ms |
| Hover en botón | 200ms |
| Press feedback | 160ms |

### Animaciones Definidas
- `animate-fade-in`: `opacity: 0 → 1`
- `animate-slide-up`: `opacity: 0 + translateY(12px) → 1 + 0`
- `animate-scale-in`: `opacity: 0 + scale(0.95) → 1 + scale(1)`
- `animate-float`: `translateY(0) → (-8px) → 0` ciclo 6s

### Reduced Motion
Todas las animaciones colapsan a `animation: none` bajo `prefers-reduced-motion: reduce`.

## 7. Layout

- **Page max-width:** 1280px (max-w-7xl)
- **Section spacing:** 5rem (80px) vertical
- **Padding default:** 1rem (16px) en mobile, 2rem (32px) en desktop
- **Grid default:** `gap-6` (24px)
- **Responsive:** Mobile-first. sm 640, md 768, lg 1024, xl 1280

### Fixed Header Compensation
El nav es `fixed top-0` con glass effect. Todo contenido de página necesita `pt-24` (96px) o `pt-16` (64px para páginas sin hero) para compensar.

## 8. Do's and Don'ts

### Do:
- **Do** usar glass tokens en toda superficie elevada
- **Do** mantener acero-azul como único acento
- **Do** whitespace generoso (secciones de 5rem)
- **Do** usar `text-balance` en headings
- **Do** animaciones de entrada con cubic-bezier(0.16, 1, 0.3, 1)
- **Do** active scale(0.97) en todo elemento presionable
- **Do** producto como protagonista — la UI se desvanece

### Don't:
- **Don't** usar beige/crema/cálidos en fondos — la paleta es fría
- **Don't** usar ring-1 genérico — usa glass tokens
- **Don't** usar box-shadow genérico — sombras tintadas al tono
- **Don't** usar gradient en botones que no sean WhatsApp
- **Don't** mezclar acentos cromáticos
- **Don't** usar backgrounds sólidos blancos en paneles — usa glass translúcido
- **Don't** animar con duraciones >300ms en elementos UI recurrentes

## 9. Admin Panel

El admin mantiene su propio estilo utilitario (no glass). Tablas, formularios, y layouts funcionales. No sigue la estética Liquid Glass del storefront. Usa shadcn/ui como base.
