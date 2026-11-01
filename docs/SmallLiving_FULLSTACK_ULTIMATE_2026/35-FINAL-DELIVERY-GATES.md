# 35 — FINAL RELEASE GATES & WHAT "COMPLETE" MEANS

## Gate 0 — Project safety and self-contained setup

- [ ] Legacy source, Git history, uncommitted work and remote data intact; branch/v2 plan and rollback documented.
- [ ] Fresh clone with documented Node/package manager can install dependencies; `.env.example` accurate; no secrets committed.
- [ ] New environment uses isolated demo database and deterministic migrations/seed, fixture accounts not leaking security credentials.
- [ ] Responsive free/legal assets manifest and demo content visible; all licenses and external sources recorded.

## Gate 1 — Functional cross-system flows

- [ ] Admin product/category/SKU publish → public User browse/search/PDP works.
- [ ] User cart persist, coupon and checkout demo price check → database order; stock consistency and idempotency test PASS.
- [ ] Admin order transitions/refund/cancel demo → User status and notification update; old line snapshot immutable.
- [ ] User profile/addresses/reviews/wishlist/compare/help/saved rooms work according to scope; permission isolation enforced.
- [ ] Admin CMS/collections/room templates, inventory, promotions, customers/role permissions, moderation, reports/audit and settings DEMO work.
- [ ] Small Living Room Profile + SpaceFit + bundle + 2D planner save/load; 3D sync and non-WebGL fallback tested.

## Gate 2 — Screens and UX completeness

- [ ] All relevant page/screen inventory rows in `24-UX-SCREEN-INVENTORY.md` implemented or marked PARTIAL/BLOCKED with reason.
- [ ] Brand, logo, favicon, OG metadata, header/footer, loading/error/empty, form feedback and responsive no horizontal overflow.
- [ ] No dead links/fictional navigation, buttons do something real or explicitly disabled with honest explanation.
- [ ] Desktop/mobile Admin information hierarchy practical; product discovery and filter UX verified against references.
- [ ] Screenshots from REAL running application at mobile/tablet/desktop, 2D & 3D scene, Admin and User flows.

## Gate 3 — Engineering and security

- [ ] Next/React + all packages stable compatible, no known actively exploited security issue left untriaged.
- [ ] Lint, strict TS, unit, DB integration, E2E, build pass. Security negative tests reject cross-role/IDOR/price tamper/replay.
- [ ] Supabase RLS and storage policies tested against customer/staff/admin; orders/stock/promos atomic and idempotent.
- [ ] User state/private info not leaked via Server Component caching; no credentials in browser bundle.
- [ ] WCAG 2.2 AA applicable criteria, keyboard interactions, focus, reduced-motion, non-drag alternative, room planner accessible fallback.
- [ ] Lighthouse/CWV lab evidence and 3D perf budget tracked, image broken links zero (or documented exceptions fixed).
- [ ] CI on clean checkout reproducible, data reset local only, no real payment/shipping/email integration.

## Gate 4 — Handover

- [ ] README setup, local DB/seed instructions, demo workflows, role matrix, architecture diagram, code ownership boundaries.
- [ ] Feature matrix with **ID, Status, file path, test, exit-code, screenshot/trace**; no unjustified DONE.
- [ ] Changelog, dependency decisions, licenses manifest, security report, performance baseline/final, known limitations and future tasks.
- [ ] Detailed reproducible demo walkthrough: Admin creates SKU → User orders → Admin processes → User tracks; plus Room Fit → Bundle → Planner 2D → 3D.
- [ ] Final report distinguishes `DONE`, `PARTIAL`, `BLOCKED`, `NOT RUN`; says exactly what is and isn't completed.

**Important:** A polished UI does not imply commerce or Admin is complete. An Admin CRUD screenshot without working DB permissions doesn't pass. A rotating 3D model doesn't count as Room Planner. The user's goal is a complete functioning portfolio, so all of the above must pass before claiming COMPLETE.
