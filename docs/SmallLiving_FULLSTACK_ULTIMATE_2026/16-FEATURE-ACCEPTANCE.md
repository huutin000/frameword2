# 16 — FEATURE ACCEPTANCE MATRIX TEMPLATE

**Agent: create `docs/FEATURE-MATRIX.md` and populate status + evidence.** All rows begin `NOT STARTED`. Never change to PASS without automated/manual evidence. Add rows for discovered user stories.

| ID | Must work, not just render | P | Test/evidence required |
|---|---|---|---|
| U01 | Home reads curated published content from DB | P1 | Admin publish→User display E2E |
| U02 | Category/search/filter/sort changes products/URL | P1 | PLP E2E + query tests |
| U03 | PDP selects correct variant/price/dimensions | P1 | UI+integration |
| U04 | Cart add/qty/remove, reload persistence | P1 | E2E browser reload |
| U05 | Demo checkout server price/stock validation | P0 | unit/integration + tamper tests |
| U06 | Order created once, owner views it | P0 | transaction/idempotency test |
| U07 | Customer cannot access Admin/other customer data | P0 | RLS + API negative tests |
| U08 | Profile/login/logout and protected pages | P1 | Auth E2E |
| U09 | Wishlist/compare actually persist and change | P2 | browser tests |
| A01 | Admin product/variant/category CRUD | P0 | E2E admin→shop |
| A02 | Admin inventory ledger and low-stock | P1 | DB integration and UI |
| A03 | Admin sees and updates demo order status | P0 | User→Admin→User E2E |
| A04 | Promo code rules affect total server-side | P1 | discount boundary tests |
| A05 | Content/hero/collections published from Admin | P1 | E2E publish→home |
| A06 | Dashboard metrics genuinely query seeded events | P1 | SQL fixture expected values |
| A07 | Image upload obeys storage rules and provenance | P2 | policy negative tests |
| S01 | Room Profile saving and ownership | P1 | login/reload/RLS |
| S02 | SpaceFit fits/no-fit/unknown with explanations | P1 | pure-function boundaries |
| S03 | Bundle builder save/edit/add-to-cart | P1 | E2E + sum tests |
| S04 | Admin room collection template publishes | P2 | admin→user E2E |
| S05 | 2D planner scale, drag/rotate, collision | P2 | unit geometry + browser |
| S06 | 2D scene save/reload retains precision | P2 | DB and browser |
| S07 | 3D planner has orbit/select/place/rotate | P3 | actual WebGL E2E + recording |
| S08 | 3D uses same scene state as 2D, save/reload | P3 | 2D↔3D roundtrip |
| S09 | no WebGL/mobile fallback works | P3 | mocked no-WebGL browser |
| D01 | New brand/favicon/title/OG without old brand | P1 | screenshots, metadata tests |
| D02 | Real licensed images & models with manifest | P1 | audit list and broken link scan |
| D03 | Loading/error/empty states, keyboard and mobile | P1 | a11y test and screenshots |
| D04 | Motion purpose/reduced motion, no perf regression | P2 | browser and perf |
| E01 | Next/React/toolchain stable and compatible | P0 | npm versions/peers, build |
| E02 | `lint`, typecheck, unit/integration/E2E, build | P0 | command log, no hidden FAIL |
| E03 | Repo history, remote DB and secrets protected | P0 | Git changes review and credential scan |

**Priority interpretation:** P0 security/function core must pass before claiming end-to-end commerce. P1 product-quality, P2 expanded, P3 full interactive 3D; final target includes P3, but an earlier milestone may be marked incomplete honestly. A working 3D icon that just rotates a mock shape is NOT enough to pass S07/S08.
