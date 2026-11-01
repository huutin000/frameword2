# 04 — PROPOSED PRAGMATIC MODULAR ARCHITECTURE & MIGRATION

## Sample tree (adapt after audit; don't blindly create empty folders)
```text
small-living/
├── src/
│   ├── app/
│   │   ├── (shop)/          # home, products, categories, rooms, solutions, cart, checkout
│   │   ├── (account)/       # sign-in, profile, saved rooms, orders
│   │   ├── admin/           # protected admin dashboard and domains
│   │   ├── api/             # route handlers only where needed
│   │   ├── layout.tsx
│   │   ├── global-error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/              # installed shadcn primitives, controlled source
│   │   ├── shared/          # truly shared components
│   │   └── 3d/              # viewer and planner primitives
│   ├── features/
│   │   ├── catalog/         # product cards, filters, actions, queries, tests
│   │   ├── cart/            # cart calculation and persistence
│   │   ├── checkout/        # demo checkout service and UI
│   │   ├── orders/          # server actions, state transitions
│   │   ├── room-planner/    # 2d/3d adapters, shared scene state, fit engine
│   │   └── admin/           # domain admin features, data tables, forms
│   ├── lib/
│   │   ├── supabase/        # server/client, no server secrets in client
│   │   ├── auth/            # access guards, roles
│   │   ├── validation/      # reusable schemas only
│   │   └── utils.ts
│   ├── config/              # site brand, navigation, tokens
│   └── styles/              # minimal globals/tokens
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── tests/
├── tests/                   # unit, integration, e2e, accessibility
├── public/                  # locally authorized assets, logos, .glb
├── docs/                    # ADRs, asset-source manifest, QA reports
└── package.json
```
**No forced folder for every file**. Colocate feature-specific elements. Don't create barrel exports that cause circular imports. Keep page files thin when meaningful, not artificially empty. Next route groups don't affect URL; avoid collisions and duplicate `<html>/<body>`.

## Data/backend boundaries
- `app` route entry -> feature service/server action -> DB; business calculations ideally pure functions for testability.
- Browser Supabase client separately from server SSR client; service secrets only on server; never use client-provided price/role/stock as authority.
- Admin permissions at server boundary AND RLS; don't assume hiding buttons is security.
- DB transactions stored as SQL functions/RPC where atomicity is required and safely scoped; document DB privileges, constraints, idempotency, inventory locks.
- No microservices, unnecessary message queues, repository-classes on every table, or custom state framework.

## Migration lanes
**New UI:** build in parallel, track each route component's parity; old CSS removed only after screenshots and QA. **Data:** migrations reproducible against isolated local/sandbox DB, separate backups and seed. **Commerce:** user/admin vertical slice first; adapt cart -> order; no real payment. **Planner:** scene state logic isolated so 2D and 3D share identical units and placement state. **Cutover:** verify routes/redirects, functionality, tests, assets, accessibility, SEO, docs before replacing prior frontend.

## Documentation
Generate `docs/ARCHITECTURE.md`, ADRs for new stack/Tailwind/state management/3D strategy, `MIGRATION-MAP.md` and `ROUTE-MAP.md`. Maintain `docs/REBUILD-DECISION.md` and rollback plan. Do not delete original project until owner explicitly requests it.
