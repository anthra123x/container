---
type: project
weight: 0.7
status: active
tags: [deployment, env, ci-cd, sentry, monitoring]
alias: deployment-env
connects:
  - target: index
    type: implements
    weight: 0.7
  - target: architecture
    type: documents
    weight: 0.6
---

# Deployment — Entorno y CI/CD

## Environment Variables

| Variable | Dónde obtener | Requerida |
|----------|--------------|-----------|
| `DATABASE_URL` | Supabase > Project Settings > Database > Connection string (Pooler) | ✅ Sí |
| `AUTH_SECRET` | `openssl rand -base64 32` | ✅ Sí |
| `NEXT_PUBLIC_APP_URL` | URL del deploy | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API > Project URL | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API > Anon key | ✅ Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role key | ✅ Sí |
| `SENTRY_DSN` | Sentry > Project > DSN | ⬜ No (Sentry opcional) |
| `SENTRY_ORG` | Sentry > Organization slug | ⬜ No |
| `SENTRY_PROJECT` | Sentry > Project slug | ⬜ No |

## CI/CD Pipeline (GitHub Actions)

```
.github/workflows/ci.yml

Trigger: push a master + PRs a master
Jobs:
  1. lint → ESLint
  2. build → prisma generate + next build
  3. test → vitest run
```

### Secrets requeridos en GitHub
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_DSN` (opcional)
- `SENTRY_ORG` (opcional)
- `SENTRY_PROJECT` (opcional)

## Sentry Configuration

| Archivo | Runtime | tracesSampleRate |
|---------|---------|-----------------|
| `sentry.client.config.ts` | Client | 0.1 (session replay: 10%) |
| `sentry.server.config.ts` | Server (Node) | 0.2 |
| `sentry.edge.config.ts` | Edge (Middleware) | 0.2 |

- Solo activo en producción (`enabled: process.env.NODE_ENV === "production"`)
- Error boundary en `src/app/error.tsx` con `Sentry.captureException()`
- Source maps: `deleteSourcemapsAfterUpload: true`

## Health Monitoring
- Endpoint: `GET /api/health`
- Response: `{ status, timestamp, uptime, database }`
- Pool: `checkDatabaseHealth()` verifica conectividad DB
- Graceful shutdown en SIGTERM/SIGINT

## Build Output
```bash
npm run build   # prisma generate + next build → output: standalone
npm start       # next start
```

## Related
- [[index]]
- [[changelog]]
- [[stack]]
