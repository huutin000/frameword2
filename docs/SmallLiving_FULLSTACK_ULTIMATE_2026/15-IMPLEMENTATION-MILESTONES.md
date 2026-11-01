# 15 — DELIVERY PLAN, PROGRESS GATES & ROLLBACK

## M0 — Ground truth and safety
Audit repo/Git/dependencies/DB/data. Capture baseline, product architecture/route/data/asset inventory. Make `REBUILD-DECISION.md`, safety branch/backups, permission map, target stack matrix. **Exit:** clear migration route and no unprotected destructive action.

## M1 — Project foundation & design
Create clean Next16/TS/Tailwind/shadcn if justified (parallel folder), configure toolchain, selected skills/MCP, design system/brand/logo/favicons/SEO; first 3 screen prototypes, image/media registry, responsive. **Exit:** starts/builds; browser can see coherent Home/PLP/Admin shell; old project intact.

## M2 — Database/Auth/seed
Local/sandbox Supabase migrations, RLS/grants, safe Auth/admin bootstrap, 40–60 demo product candidates with real licensed image/provenance, role tests. **Exit:** migrations+seed reproducible, user/admin authorization matrix PASS, data stable across reload.

## M3 — Core commerce full vertical slice (HIGHEST PRIORITY)
Product Admin CRUD → storefront product listing/filter/PDP → guest/cart → demo checkout/order transaction → Admin order/status → user order timeline. Prevent client price/stock trust, double submits, cross-role access. **Exit:** Playwright user/admin/database E2E PASS; no mock dashboards.

## M4 — Full storefront/admin
Wishlist/compare, promotions, categories/collections, media asset manager, solution CMS, analytics from DB demo, profile/orders; SEO/loading/error/empty/search/facets. **Exit:** broad feature matrix tested, cross-device screenshots, no dead buttons.

## M5 — Small Living signature P1
Room Profile, explainable SpaceFit, Solution/Bundle Builder, saved projects, Admin template publishing. **Exit:** user save/reload, fit changes when room/variant changes, Admin curated bundle visible to public, auth restrictions PASS.

## M6 — 2D Planner (foundation)
Scaled room plan, dimensioned object placement, rotate, collision, bounds, save/load; test shared scene model. **Exit:** deterministic unit/integration + E2E PASS including keyboard alternative.

## M7 — 3D planner & selected interactive motion
Three/R3F/Drei scene, models free/legal, room dimensions, camera interaction, edit positions, 2D↔3D persistence, adaptive mobile fallback; purposeful animation across storefront. **Exit:** functional browser demo, no leaks/error, fallback PASS, screenshots and performance measured.

## M8 — Polishing, QA, delivery
A11y/security/access role tests, review version advisories, performance optimization, browser visual diff, clean dead code after parity, README, seed and demo accounts, asset/component provenance, user/admin tour. **Exit:** feature acceptance matrix truly supported; FINAL REPORT with honest partial list.

## Autonomous workflow
Within allowed repo/isolated database, Agent may auto-execute reversible low-risk changes and continue milestones after gates pass. Must seek approval for destructive DB changes, reset --linked, deleting old project, rewrite of current uncommitted files, global dev environment side effects, public deployment/push, real external services, unforeseen breaking auth/route contracts. If an external skill/MCP/paywall needs login/payment, pause that integration only and choose a free alternative.

## Every milestone report
`objective / files changed / examples from actual UI / tests commands + exit codes / browser screenshots / DB impact / risks / next steps`. A milestone cannot be PASS while a material test fails; mark blocked explicitly and address rather than leapfrogging. Avoid endlessly requesting permission for routine safe edits.

## Final deliverables checklist
- Working User and protected Admin linked by demo DB.
- README setup commands and test-account bootstrap (no committed passwords).
- SQL migrations/seed, RLS tests, CI basics, reference docs and license manifest.
- Brand package favicon/OG/logo, image/model provenance, responsive screenshots.
- 2D + 3D planner functioning and fallback.
- No ghost buttons or invented shipping/purchase claims.
