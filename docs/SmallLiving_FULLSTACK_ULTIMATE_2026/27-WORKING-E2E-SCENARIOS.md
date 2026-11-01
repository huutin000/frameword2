# 27 — USER → DATABASE → ADMIN → USER: MANDATORY E2E SCENARIOS

This file is deliberately scenario-oriented. Create Playwright tests, DB integration assertions and security negatives. Use sandbox/local accounts, never external credit card, real emails or real shipping.

## Journey A: publish product with real data

**Given** Admin signed in and seeded category exists. **When** Admin creates product with valid title, slug, 2 SKU variants, dimensions, image provenance and status `draft`, **then** it is invisible to Visitor. **When** Admin publishes, **then** browse/search/PDP and collection reflect it after cache invalidation; `unpublish` removes public listing but order line history still available to owner.

## Journey B: search and facet navigation

**Given** 60 demo products with tags/dimensions. **When** Visitor selects `Phòng tắm`, `không khoan`, max width 40cm, price 200–500k, and sorts ascending, **then** URL encodes filters, grid obeys all constraints, clear chip removes only one, browser back restores state, result count accurate, desktop and mobile views match. Empty result offers recoverable action. Keyboard can use filters.

## Journey C: cart, promotion, checkout and admin state

**Given** User A has 2 products with stock. **When** A chooses quantity, adds coupon, reloads, chooses demo shipping and submits twice, **then** one order appears with authoritative price and line snapshot, coupon redemption once and stock adjustment once. **When** Admin sets `confirmed` then `packing`, **then** User A order timeline updates; User B cannot see it. **When** Admin updates product price, existing order total remains unchanged.

## Journey D: stock/concurrency

**Given** only 1 SKU available. **When** A and B submit order concurrently, **then** only 1 succeeds, stock never negative; losing user sees actionable out-of-stock notice. **When** order cancellation requires restock, repeated cancel/refund attempts do not apply twice. This must be tested at DB/integration level, not only mocked browser.

## Journey E: CMS/editorial

**When** Content editor adds homepage room story with licensed photo and products, previews draft, publishes, **then** User sees block & working product links. **When** editor unpublishes, block disappears; unpublished URL isn't indexed. Unauthorized user cannot write CMS.

## Journey F: reviews/help/customer

Customer submits Q&A/review DEMO; item initially pending; moderator approves/rejects; public PDP shows only approved; customer cannot edit others' reviews; XSS payload rendered harmless. Customer creates ticket, staff changes status and writes reply stored in account; no real email generated.

## Journey G: Room Profile → SpaceFit → Bundle

Create Room Profile 2400×3200 mm, renter no-drill true, budget demo. Product width/depth fits with required clearance -> `fit` with reasoning, oversized -> `no fit`, missing dimension -> `unknown` and explanation. Save bundle with variants, check price sum, add to cart; User B cannot access saved plan.

## Journey H: Planner 2D/3D

Given actual room geometry and 3 demo GLB furniture assets: add 2 items on 2D plane, use snap, rotate, detect overlap, undo, save. Switch 3D, same objects/personal dimensions and units, camera orbit/select/reposition. Reload saved scene, compare serialized state. Disable WebGL/browser support, 2D fallback remains able to edit and save; keyboard-only use alternative controls for moving objects.

## Journey I: admin permissions, settings and audit

Login as customer/staff/editor/admin; test direct URL and server mutation per role. Admin modifies promo/stock/order, each writes actor-specific audit event. Viewer cannot see private details; role escalation blocked by RLS. Export contains only allowed fields and neutralizes CSV formula cells.

## Journey J: accessibility/responsive/network

Test 320/375/390/768/1024/1440, 200% zoom, tab order, focus trap/release on drawer, escape to close, reduced motion, hover-only pitfalls, image missing, slow 3G and interrupted request, empty and unexpected errors. No horizontal overflow; visual regression on key screens; performance 3D lazy load.

## Required test artifacts

- E2E `.spec.ts` suites use stable `data-testid` only when semantic selectors insufficient.
- Isolated database seed and admin/customer fixtures, screenshots, HTML report, Playwright trace on fail, command+exit code.
- SQL/integration proofs for owner isolation, transactions/idempotency and stock races.
- Every failing journey creates issue + fix + rerun; no `test.skip` used to claim DONE.
