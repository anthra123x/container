<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-vault -->
# Project Vault (`brain/`) — Neural Knowledge Network

Este proyecto tiene su propio vault Obsidian en `./brain/` que funciona como una **red neuronal**: las notas son neuronas, los `connects[]` son sinapsis tipadas con peso. La propagación de contexto ocurre multi-hop en las fronteras de sesión.

## Estructura

```
brain/
├── index.md              ← hub principal (weight: 1.0)
├── roadmap.md            ← visión, metas, sprints
├── architecture.md       ← arquitectura del sistema
├── stack.md              ← tech stack completo
├── changelog.md          ← historial de cambios
├── decisions/            ← ADRs con connects[] + weight
├── sessions/             ← logs de sesión con connects[]
├── facts/                ← descubrimientos técnicos
├── store/                ← documentación de la tienda pública
│   └── overview.md
├── admin/                ← documentación del panel admin
│   └── overview.md
├── database/             ← schema, índices, migraciones
│   └── schema.md
├── api/                  ← endpoints, server actions, storage
│   └── endpoints.md
├── auth/                 ← autenticación, roles, rate limiting
│   └── flow.md
├── deployment/           ← env, CI/CD, monitoreo
│   └── env.md
├── data/                 ← catálogo de productos, seed
│   └── products.md
├── tests/                ← estrategia de calidad
│   └── strategy.md
└── templates/            ← plantillas con frontmatter neural
```

## Connection Taxonomy

Cada nota tiene frontmatter con conexiones tipadas:

```yaml
type: decision
weight: 0.9
connects:
  - target: index
    type: implements
    weight: 0.9
  - target: facts/supabase-pool
    type: documents
    weight: 0.8
```

| Tipo | Significado | Default Weight | Propaga |
|------|-------------|----------------|---------|
| `implements` | Implementa/cambia algo | 0.8-1.0 | Sí |
| `documents` | Documenta algo | 0.6-0.8 | Sí |
| `depends` | Depende de algo | 0.8-1.0 | Sí |
| `evolves` | Evoluciona/supersede | 0.7-0.9 | Sí |
| `relates` | Relación temática | 0.3-0.6 | No |
| `contradicts` | Contradice alternativa | 0.4-0.7 | No |

## Context Propagation

Al iniciar sesión, lectura multi-hop:

```
hop 0: index.md (siempre)
  └── hop 1: connects[] con weight ≥ 0.7
      └── hop 2: si hop-1 tiene weight ≥ 0.8, leer sus connects
```

Máximo 7 notas, briefing de ~20 líneas. Ver `obsidian-brain/SKILL.md` para el modelo completo.

## Workflow

| Momento | Acción |
|---------|--------|
| Inicio de sesión | Leer `brain/index.md` + propagación multi-hop |
| Decisión no-trivial | Crear `brain/decisions/YYYY-MM-DD-titulo.md` con connects[] |
| Descubrimiento técnico | Crear `brain/facts/titulo.md` con connects[] |
| Cambio de feature | Actualizar sección correspondiente (`store/`, `admin/`, `database/`, etc.) |
| Fin de sesión | Crear `brain/sessions/YYYY-MM-DD-tema.md` + actualizar `brain/index.md` y `brain/changelog.md` |

Los wikilinks usan rutas relativas al vault: `[[decisions/titulo]]`, `[[sessions/titulo]]`, `[[facts/titulo]]`, `[[store/overview]]`, `[[admin/overview]]`, etc.

Abrir: `flatpak run md.obsidian.Obsidian` → "Open folder as vault" → `brain/`
<!-- END:project-vault -->
