# 26 — PERFORMANCE, OBSERVABILITY, RESOURCE BUDGET & CI

## Performance targets (measure, don't assume)

- Target **Core Web Vitals Good** at p75 when actual field data exists: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. For portfolio demo with no field data, document reproducible lab proxy and do not claim p75 field PASS.
- Define per-route budgets: Home hero img optimized, search data chunks, PDP gallery lazy, Admin charts/table pagination, 3D separate chunk lazy after explicit user intent; final values from Lighthouse/DevTools not fabricated.
- Bundle analysis baseline before/after: JS shipped to client, heavy UI library duplicates, accidental server-only dependencies included in client.
- Avoid eager WebGL on homepage, external component bundles from multiple animation libraries, overuse of client components, multiple font downloads, full preload all product images.

## Frontend and server optimizations

1. Prefer Server Components for public catalog and Admin server data, interactive islands for menus/cards/forms only; don't lift entire app to `'use client'`.
2. Use optimized images with exact sizes, responsive `sizes`, stable aspect ratio, safe allowed remotePatterns, lazy below fold, priority only LCP image; placeholders no broken images.
3. Scope CSS/Tailwind tokens, reduce unused icon libraries, choose one icon set; code split charts/editor/3D; motion use opacity/transform; skip expensive scroll effects.
4. Correct caching: published product data cache and invalidation on Admin publish/edit; private session/order data dynamic and never cross-user cache; RLS enforced anyway.
5. DB query indexes based on `EXPLAIN` for PLP/admin filters, avoid N+1, paginate and limit; expensive dashboard aggregates derive query vs materialization by measured needs.
6. 3D budget: dynamic Canvas, max draw calls/polycounts reasonable per scene, compressed GLB, model selection with LOD, adaptive DPR, shadows/lighting budget, pause when tab hidden/offscreen, no WebGL fallback.
7. Resource budget Windows 16GB: do not run 3D dev server + full 3-browser Playwright headed + Docker + IDE concurrently unless sufficient; test sequentially/headless and document resource footprint.

## Reliability/observability

- Structured server logs with requestId, safe error code, status and trace context; no secrets, tokens, address/PII; stage-specific verbosity.
- Report friendly error screen and retry. On checkout DB failure, no partial order; on CMS publish failure no half-published content.
- Optional free-tier/error monitoring only if configured and approved, no user analytics trackers by default.
- Report DB query timings in dev or CI, client JS/hydration errors, broken images, blocked network requests; screenshots/trace on E2E failure.
- Health check for app + DB in local development; never expose secrets or internal debug endpoints publicly.

## CI Quality gates

- GitHub Actions or equivalent: clean install from lockfile, typecheck, ESLint, unit, integration with isolated DB, build, Playwright smoke/headless, license/asset manifest validation, dependency vulnerabilities triage, accessibility checks. CI should be reproducible without paid APIs.
- Use test projects/fixtures and environment scoped secrets; never use production Supabase keys in CI.
- Treat `npm audit` findings with triage; not all HIGH advisories are exploitable in this app. Still block known critical exposed paths.
- Preview builds optionally for manual design review; no auto-deploy unless approved.
- Document screenshots/perf comparison per representative page: Home, PLP, PDP, Cart, Checkout, Admin Dashboard, Admin Orders, Room Planner.

## Acceptance

- No serious hydration errors, console errors, failed images, unexpected horizontal overflow, unauthorized data served in cache.
- 3D failure or GPU off -> UI still usable (2D view/measurements/plan save).
- E2E suite runs after clean clone with documented test fixtures; CI report is not green if tests were skipped silently.
- Audit includes baseline and final lab scores, conditions/device/browser, caveats; no claim of production uptime, user conversion or real sales.
