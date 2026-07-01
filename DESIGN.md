---
name: Container Store
description: Tienda colombiana de tecnología — premium, limpia, segura
colors:
  primary: oklch(0.546 0.245 262.881)
  primary-hover: oklch(0.6 0.22 262.881)
  primary-foreground: oklch(0.985 0 0)
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  muted: oklch(0.97 0 0)
  muted-foreground: oklch(0.556 0 0)
  border: oklch(0.922 0 0)
  card: oklch(1 0 0)
  card-foreground: oklch(0.145 0 0)
  destructive: oklch(0.577 0.245 27.325)
  sidebar: oklch(0.985 0 0)
  sidebar-foreground: oklch(0.145 0 0)
  sidebar-primary: oklch(0.546 0.245 262.881)
  chart-1: oklch(0.87 0 0)
typography:
  display:
    fontFamily: var(--font-sans)
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: var(--font-sans)
    fontSize: 0.875rem
    lineHeight: 1.5
  label:
    fontFamily: var(--font-sans)
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.05em
rounded:
  sm: 4.8px
  md: 6.4px
  lg: 8px
  xl: 11.2px
  2xl: 14.4px
  3xl: 17.6px
  4xl: 20.8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: 12px 24px
    typography: "{typography.label}"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 8px 20px
  card-default:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    typography: "{typography.body}"
  input-default:
    backgroundColor: transparent
    rounded: "{rounded.lg}"
    padding: 10px 16px
    typography: "{typography.body}"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.4xl}"
    padding: 2px 10px
    typography: "{typography.label}"
---

# Design System: Container Store

## 1. Overview

**Creative North Star: "El Estante Abierto"** — una tienda donde cada producto descansa en su propio espacio, visible, ordenado, sin ruido. La interfaz es el estante: fondo limpio, producto protagonista, todo al alcance.

Container Store es tecnología con confianza colombiana. La UI comunica seguridad y orden sin ser fría. Cada página respira — el whitespace no es vacío, es el marco que permite que el producto hable. Los azules serenos (herencia directa del océano y el cielo de la costa Caribe) combinados con blanco nítido y grises suaves crean una atmósfera profesional pero cercana.

Este sistema rechaza explícitamente lo genérico y lo sobrecargado. Sin sombras excesivas, sin gradientes agresivos, sin cards apilados sin jerarquía. La elevación se resuelve con anillos (`ring-1`) en vez de sombras.

**Key Characteristics:**
- Plano por defecto, anillos para definir superficies
- Azul como único acento cromático (≤15% de la pantalla)
- Whitespace generoso como elemento de diseño
- Motion sutil (3-4/10), solo para explicar cambios de estado
- Consistencia radical en radios, espaciados y tipografía

## 2. Colors

La paleta es monocromática azul + neutrales. El azul es el único acento. Su presencia medida es lo que le da potencia.

### Primary
- **Azul Container** (`oklch(0.546 0.245 262.881)` / `oklch(0.6 0.22 262.881)` hover): El azul de marca. Usado en botones primarios, links, acentos activos, y el header hero. Nunca en fondos grandes (máximo 15% de la pantalla).
- **Primary Foreground** (`oklch(0.985 0 0)`): Blanco puro. Texto sobre primary.

### Neutral
- **Background** (`oklch(1 0 0)`): Blanco total. Fondo de página principal.
- **Foreground** (`oklch(0.145 0 0)`): Casi negro. Texto principal.
- **Muted** (`oklch(0.97 0 0)`): Gris apenas perceptible. Hover states, fondos de sección alternos (ej: "Productos Destacados").
- **Muted Foreground** (`oklch(0.556 0 0)`): Gris medio. Texto secundario, descripciones, metadata.
- **Border** (`oklch(0.922 0 0)`): Gris muy claro. Bordes de inputs, separadores, ring de cards.
- **Card** (`oklch(1 0 0)`): Blanco. Fondo de cards.

### Semantic
- **Destructive** (`oklch(0.577 0.245 27.325)`): Rojo. Acciones destructivas, descuentos, errores, stock agotado.

### Named Rules
**La Regla del Acento Único.** El azul primario es el único color de acento. Nunca se combina con un segundo acento. Si necesitas llamar la atención, usa el azul más saturado o más claro, no un color diferente.

**La Regla del 15%.** El azul primario no ocupa más del 15% del área de cualquier pantalla. Su rareza es lo que le da potencia.

## 3. Typography

**Display & Body Font:** `Inter` (via `var(--font-sans)`) — sans-serif humanista, legible, profesional. Sin serifa display separada; el sistema usa una sola familia para máxima consistencia.

**Character:** Neutra, funcional, moderna. Inter combina claridad técnica (buena para precios, especificaciones) con calidez humanista (buena para copy de confianza).

### Hierarchy
- **Display** (`font-bold`, `leading-tight`, `text-3xl` → `text-5xl/6xl`): Títulos de landing y hero. Solo en páginas de aterrizaje.
- **Headline** (`font-bold`, `text-2xl/3xl`): Títulos de sección ("Categorías", "Productos Destacados").
- **Title** (`font-semibold`, `text-base`): Títulos de cards, nombres de producto, encabezados de página.
- **Body** (`font-normal`, `text-sm`): Texto general, descripciones, párrafos. Máximo 65-75 caracteres por línea.
- **Label** (`font-medium`, `text-xs`, `tracking-wide`): Botones, badges, etiquetas de formulario, metadatos.

### Named Rules
**La Regla de una Sola Familia.** Todo el sistema usa Inter. Sin fuentes display decorativas, sin mono para código. La variación viene de weight y size, no de cambios de familia.

## 4. Elevation

Sistema plano con anillos. No se usan sombras `box-shadow`. La profundidad se comunica mediante bordes sutiles (`ring-1 ring-foreground/10`) que separan superficies sin crear sombras falsas. Los hover states usan cambios de color de fondo, no elevación.

Cards, modales, dropdowns y sidebars usan el mismo principio: borde de 1px (ring) para definir el límite, fondo blanco para destacar contra el fondo de página.

### Shadow Vocabulary
- **Card / Surface** (`ring-1 ring-foreground/10`): Toda superficie elevada. Cards, sidebars, modales.
- **Hover state**: Se intensifica el color de fondo o borde, no se añade sombra. Ej: `hover:border-blue-100 hover:shadow-lg` en cards de landing (excepción controlada para la página principal).

### Named Rules
**La Regla del Anillo.** Toda superficie usa `ring-1` para definirse. No hay `box-shadow` en el sistema base. Excepciones solo en landing page para efecto visual.

## 5. Components

### Buttons
- **Shape:** `rounded-xl` (11.2px radius). Bordes suaves pero no pill-shaped.
- **Primary:** Fondo azul Container, texto blanco, padding 12px 24px. `hover:brightness-110`, `active:scale-[0.98]`.
- **Outline:** Borde gris, texto foreground, fondo transparente. `hover:bg-muted`.
- **Ghost:** Sin borde, `hover:bg-muted`.
- **Destructive:** Fondo rojo 10%, texto rojo. `hover:bg-destructive/20`.
- **Size default:** 32px height. Variantes xs (24px), sm (28px), lg (36px).

### Cards
- **Corner Style:** `rounded-xl` (11.2px radius) con `ring-1 ring-foreground/10`.
- **Background:** Card white (`oklch(1 0 0)`).
- **Shadow:** Usa ring, no box-shadow (ver Elevación). Excepción: landing page cards usan `shadow-sm` + `hover:shadow-lg`.
- **Internal Padding:** `--card-spacing` = 16px (spacing-md). Variante `sm` = 12px.
- **Structure:** Header (title + description + action), Content, Footer.

### Inputs / Fields
- **Style:** Borde `ring-1` color border, fondo transparente, `rounded-lg` (6.4px).
- **Focus:** Borde cambia a ring primary + `ring-3 ring-ring/50`.
- **Error:** Borde destructive + `ring-3 ring-destructive/20`.
- **Disabled:** 50% opacidad, fondo muted.

### Chips / Category Pills
- **Style:** `rounded-full` (pill), border gris, padding 4px 16px, texto xs font-medium.
- **Selected:** Fondo azul Container + texto blanco. Sin borde.
- **Unselected:** Borde gris, texto gris, `hover:border-blue-300 hover:text-blue-600`.

### Navigation (Storefront)
- **Desktop:** Links en texto foreground. Hover → azul. Active → azul + underline animado (`.nav-link-active`).
- **Mobile:** Drawer full-height con links en columna. Fondo blanco.

### Badges
- **Style:** `rounded-4xl` (pill shape), `h-5`, padding 2px 10px, `text-xs font-medium`.
- **Default:** Fondo primary, texto blanco.
- **Secondary:** Fondo secondary, texto secondary-foreground.
- **Destructive:** Fondo rojo 10%, texto rojo.
- **Outline:** Borde gris, texto foreground.
- **Discount badge:** Fondo rojo 500, texto blanco bold, `rounded-full`, `shadow-lg`.

### Tooltips
- Fondo foreground, texto background, `rounded-md`, padding 4px 8px, `text-xs`.

## 6. Do's and Don'ts

### Do:
- **Do** usar azul Container como único acento cromático.
- **Do** mantener whitespace generoso entre elementos — si dudas si sobra espacio, déjalo.
- **Do** usar `rounded-xl` (11.2px) como radio default para superficies.
- **Do** usar `ring-1 ring-foreground/10` para definir cards y superficies.
- **Do** mantener botones primarios con padding 12px 24px y `rounded-xl`.
- **Do** usar motion sutil (3-4/10): transiciones de 150-200ms, ease-out para entradas.
- **Do** usar active `scale-[0.98]` en botones para feedback táctil.
- **Do** mantener consistencia radical — si un patrón existe en un lugar, existe en todos.

### Don't:
- **Don't** usar sombras `box-shadow` en el sistema base. Usa rings.
- **Don't** mezclar colores de acento. Azul es el único.
- **Don't** crear diseños genéricos o template-like — cada página debe sentirse intencional.
- **Don't** sobrecargar la UI con banners, múltiples CTAs, o elementos compitiendo.
- **Don't** usar `transition: all` — sé explícito con las propiedades a transicionar.
- **Don't** usar `ease-in` en UI — retrasa la respuesta que el usuario más observa.
- **Don't** usar animaciones >300ms en elementos UI sin justificación explícita.
- **Don't** usar gradientes excesivos — el gradiente hero es la única excepción controlada.
- **Don't** apilar información sin jerarquía visual clara.
