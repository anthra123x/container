---
type: project
weight: 0.6
status: active
tags: [tests, vitest, k6, e2e, quality]
alias: tests-strategy
connects:
  - target: index
    type: implements
    weight: 0.6
  - target: architecture
    type: documents
    weight: 0.5
---

# Tests — Estrategia de Calidad

## Unit Tests (Vitest)

| Archivo | Tests | Descripción |
|---------|-------|-------------|
| `src/__tests__/health.test.ts` | 2 | Infraestructura vitest |
| `src/__tests__/utils/formatters.test.ts` | Formateo de moneda, fechas |
| `src/__tests__/utils/pagination.test.ts` | Lógica de paginación |

Total: 31 tests (3 suites)
```bash
npm test           # vitest run
npm run test:watch # vitest watch
```

## Load Tests (k6)

| Archivo | Escenario |
|---------|-----------|
| `tests/load/store.js` | 3 stages: 10 → 20 → 0 usuarios en 2 min |

### Thresholds
- Homepage (`GET /`): p(95) < 2s
- Products (`GET /productos`): p(95) < 3s
- Health (`GET /api/health`): verifica status "ok"
- Error rate: < 5%

```bash
k6 run tests/load/store.js
```

## Coverage Report
```bash
npx vitest run --coverage
```

## Próximos Pasos
### Integration Tests (pendiente)
- Cart flow: add → update → remove items
- Order flow: checkout → create → status changes
- Auth flow: login → rate limit → lockout
- Admin CRUD: create/edit/delete products, categories, brands

### E2E Tests con Playwright (pendiente)
- Store: navegar productos → agregar carrito → checkout
- Admin: login → CRUD producto → logout
- Phone lookup: buscar pedido por teléfono
- Responsive: mobile store navigation

## Related
- [[index]]
- [[deployment/env]]
