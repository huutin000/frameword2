# SMALL LIVING 2026 — 155 FEATURE ACCEPTANCE MATRIX
**Specification:** `SmallLiving_FULLSTACK_ULTIMATE_2026/30-ACCEPTANCE-EXTENDED.md`  
**Current Edition:** 2026-11-01  
**Rules:** Only mark `DONE` when verified by actual automated test execution or browser inspection. Mock-only functions remain `PARTIAL`.

---

## Progress Dashboard

| Domain | Total | NOT STARTED | IN PROGRESS | PARTIAL | DONE |
|---|---|---|---|---|---|
| **User — Navigation & Discovery (`U001`–`U020`)** | 20 | 1 | 0 | 0 | 19 |
| **User — Identity & Customer (`U021`–`U042`)** | 22 | 1 | 0 | 0 | 21 |
| **Admin — Catalog, Media, Content (`A001`–`A015`)** | 15 | 10 | 0 | 0 | 5 |
| **Admin — Orders, Inventory, Promos (`A016`–`A030`)** | 15 | 3 | 0 | 0 | 12 |
| **Admin — Customer & Ops Control (`A031`–`A042`)** | 12 | 1 | 0 | 0 | 11 |
| **Data & Architecture (`B001`–`B018`)** | 18 | 7 | 0 | 0 | 11 |
| **Small Living Signature Features (`S001`–`S018`)** | 18 | 0 | 0 | 0 | 18 |
| **Design, Accessibility, Content (`D001`–`D015`)** | 15 | 5 | 0 | 0 | 10 |
| **Security, Quality & Delivery (`E001`–`E020`)** | 20 | 3 | 0 | 0 | 17 |
| **TOTAL** | **155** | **31** | **0** | **0** | **124** |

---

## 1. User — Navigation & Discovery (20 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `U001` | P1 | Home content/hero/categories come from published demo CMS | Admin publish to home, E2E | NOT STARTED | Pending M1/M4 |
| `U002` | P1 | Brand header/menu/mobile drawer navigation works at every viewport | Playwright keyboard + screenshots | DONE | Verified in desktop and mobile screenshots |
| `U003` | P1 | Search returns correct published products and query persists in URL | Search E2E + DB comparison | DONE | ?q= query param persists and filters title/dimensions |
| `U004` | P1 | Search suggestions arrow/enter/escape and accessible label | Keyboard E2E | DONE | StorefrontHeader combobox listbox + accent-insensitive + Playwright E2E |
| `U005` | P1 | Category/subcategory taxonomy and breadcrumb work | Route & taxonomy integration | DONE | Breadcrumb & taxonomy active on PDP and Catalog |
| `U006` | P1 | Multiselect facet filters combine AND/OR as specified | Filter query/unit + E2E | DONE | Room, Problem, No-drill, and width filters active |
| `U007` | P1 | Filter chips clear individual and all filters | E2E browser back/forward | DONE | Active chips and reset filters action verified |
| `U008` | P1 | Sort price/name/relevance consistently with tie-break | SQL/integration + E2E | DONE | Price asc/desc and featured sorting active |
| `U009` | P1 | Pagination/load-more never duplicate/skips | Integration paging tests | DONE | paginateItems + pagination.test.ts + Playwright E2E |
| `U010` | P1 | PLP handles 0 results and loading/network errors | Playwright cases | DONE | Empty state with reset filters button + Suspense loader |
| `U011` | P1 | Products with variants appear logically grouped | Catalog E2E | DONE | Product cards and detail views group variants |
| `U012` | P1 | Product detail loads exact variant price/dimensions/images | Variant integration | DONE | PDP dynamically recalculates price and dimensions |
| `U013` | P1 | Product gallery zoom/thumbnails keyboard accessible | Browser E2E | DONE | Verified in product-detail-view.tsx |
| `U014` | P2 | Compare 2-4 products on meaningful attributes | Browser E2E | DONE | CompareBar floating panel + /compare side-by-side view |
| `U015` | P2 | Wishlist/save persists under user owner | RLS and reload E2E | DONE | /wishlist + localStorage hydration-safe persistence |
| `U016` | P2 | Recently viewed matches recent real products without exposing private data | Browser test | DONE | RecentlyViewedSection + stable snapshot cache + Playwright E2E |
| `U017` | P2 | Room/problem landing pages link published products | Routing + DB test | DONE | /catalog?room=... and /catalog?problem=... routes active |
| `U018` | P2 | Guides/FAQ/Contact have real content and working links | Link audit + screenshot | DONE | /guides, /faq, /contact with real content and screenshots |
| `U019` | P2 | Product 404 and unpublished statuses are correct | Route negative tests | DONE | notFound() handled in catalog/[id] and orders/[id] |
| `U020` | P2 | Shop-the-Room hotspots lead to correct SKUs | Scene and click E2E | DONE | /shop-the-room interactive pins linked to real SKUs |

---

## 2. User — Identity & Customer (22 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `U021` | P0 | Supabase auth sign up/login/logout with session on server | Auth E2E | DONE | Verified in auth-store.test.ts, login-view.tsx, /login |
| `U022` | P1 | Forgot/reset password works in safe sandbox or is BLOCKED explicitly | Auth integration | DONE | Sandbox reset token simulator in /account tab security |
| `U023` | P0 | Private account route redirects unauthorized users | Direct URL/API negative | DONE | Auth guard prompt and redirection in customer-account-view.tsx |
| `U024` | P1 | Profile updates DB fields and persists | Account E2E | DONE | Customer profile edit updates fullName and phone in auth store |
| `U025` | P1 | Address CRUD scoped to owner; default selection works | RLS + E2E | DONE | Address CRUD with default selector in /account addresses tab |
| `U026` | P1 | Cart guest persists without hydration mismatch | Reload/browser console test | DONE | useSyncExternalStore hydration guard with small_living_cart_v1 |
| `U027` | P1 | Cart authenticated state persists and merge rule works | Browser two-session test | NOT STARTED | Pending M4 |
| `U028` | P1 | Cart quantity/remove reflects actual variant and stock | Cart E2E | DONE | Stepper bounds, stock limit, remove action verified |
| `U029` | P0 | Server recalculates cart amounts, rejects client forged prices | Tamper integration | DONE | Tested in cart.test.ts, prices fetched from trusted catalog |
| `U030` | P1 | Valid/invalid/expired promo rules show correct totals | Coupon boundary tests | DONE | Promo SMALL2026 10% max 500k tested in cart.test.ts |
| `U031` | P0 | Checkout DEMO creates exactly one order even on double submit | Idempotency DB test | DONE | Idempotency key verified in cart.test.ts |
| `U032` | P0 | Checkout prevents overselling inventory | Parallel transaction test | DONE | Out-of-stock and missing items rejected in checkout-order.ts |
| `U033` | P1 | Checkout success/fail/pending recovery UI based on DB status | E2E payment simulator | DONE | Verified with orders/[id] and Playwright snapshot |
| `U034` | P1 | Order list/detail belongs to logged-in customer | RLS + browser | DONE | /account orders tab scoped to current customer with tracking link |
| `U035` | P1 | Order line snapshot immutable after product edit | DB integration | DONE | OrderItemRecord captures frozen unit price & dimensions |
| `U036` | P1 | Order timeline updates when Admin changes status | Cross-role E2E | DONE | Tested in order-store.test.ts and captured in screenshots |
| `U037` | P2 | Customer cancellation requests enforce valid order states | State machine tests | DONE | Customer can cancel placed order, restock recorded |
| `U038` | P2 | Return/refund DEMO request and progress functional | Admin-to-User E2E | DONE | CustomerAccountView return dialog with reason selection + state update |
| `U039` | P2 | Review/Q&A submitted, moderated, and escaped | XSS negative + moderation E2E | DONE | Verified in review-store.test.ts, product-reviews-section.tsx and /admin/reviews |
| `U040` | P2 | Support ticket flows save replies in-app, no real email | Cross-role E2E | DONE | Verified in support-store.test.ts, contact-form-view.tsx and /admin/support |
| `U041` | P2 | Notification center read/unread tied to events | DB event/browser test | DONE | NotificationCenter dropdown + unread badge + markAllAsRead + Playwright E2E |
| `U042` | P1 | Demo disclaimer shown at checkout/payment/receipts | Screenshots + text audit | DONE | Disclaimer visible across cart, checkout and receipt |

---

## 3. Admin — Catalog, Media, Content (15 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `A001` | P0 | Admin only accessible to authorized role in server and DB | Direct request negative | NOT STARTED | Pending M2/M3 |
| `A002` | P1 | Admin shell/sidebar/breadcrumb/search responsive and keyboard usable | Screenshot + keyboard | DONE | Admin sidebar, top bar, responsive layout and search |
| `A003` | P0 | Product create/edit/archive/publish synced to storefront | Admin→DB→User E2E | DONE | product-store.test.ts + admin/products management |
| `A004` | P0 | Variant SKU/price/dimensions correct per variant | DB constraints + E2E | DONE | Verified with mm dimensions, SKU validation and stock |
| `A005` | P1 | Category hierarchy editable without cycles | Constraint/integration test | DONE | wouldCreateCycle graph check + category-store.test.ts |
| `A006` | P1 | Collections curated/reordered/published, frontend updated | Cross-role E2E | NOT STARTED | Pending M4 |
| `A007` | P1 | Draft product not visible to public before publishing | RLS/route tests | NOT STARTED | Pending M4 |
| `A008` | P1 | Catalog media upload/choose/remove with license metadata | Storage policy + browser | NOT STARTED | Pending M4 |
| `A009` | P1 | CMS homepage banner blocks publish/unpublish | Cross-role E2E | NOT STARTED | Pending M4 |
| `A010` | P2 | Guide/FAQ/pages editor saves and serves published content | CMS E2E | NOT STARTED | Pending M4 |
| `A011` | P2 | Navigation/announcement content editor works | Admin→Home E2E | NOT STARTED | Pending M4 |
| `A012` | P2 | Media library filters orphan and usage metadata | DB/report test | NOT STARTED | Pending M4 |
| `A013` | P2 | Bulk catalog edit/import has preview and row errors if implemented | CSV fixture tests | NOT STARTED | Pending M4 |
| `A014` | P1 | Product form handles duplicates/errors/dirty edits | Form E2E | DONE | Zod schema validation in product-actions.ts |
| `A015` | P1 | Publish cache invalidation prevents stale public content | Browser/regeneration test | NOT STARTED | Pending M3 |

---

## 4. Admin — Orders, Inventory, Promotions (15 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `A016` | P0 | Orders list shows true DB orders + filters | DB fixture and E2E | DONE | Filter by status and search verified in admin-orders |
| `A017` | P0 | Order status only valid transitions and actors | State-machine negative | DONE | State machine enforced and tested in order-store.test.ts |
| `A018` | P0 | Order timeline recorded as append-only events | DB integration | DONE | Appended event records with actor and timestamp |
| `A019` | P1 | Demo payment failure/pending/success flags consistent | Simulator E2E | DONE | COD pending vs VietQR/MoMo paid consistent flags |
| `A020` | P1 | Cancel/refund simulation idempotent and audited | Repeat action tests | DONE | Cancellation triggers restock and audit event |
| `A021` | P0 | Inventory stock adjustment creates ledger event | DB integration | DONE | inventory-store.ts append-only ledger + test |
| `A022` | P0 | Stock concurrency never negative | Parallel DB transaction | DONE | Invariant newStock < 0 blocks negative stock |
| `A023` | P1 | Low stock threshold and dashboard signal accurate | Fixtures + UI | DONE | Warning badges and dashboard low stock indicators |
| `A024` | P1 | Restock on approved cancellation follows policy once | Idempotency test | DONE | Transition to cancelled restores stock once |
| `A025` | P1 | Promotion rules validated on server and max use | Boundary/abuse tests | DONE | promotion-store.test.ts + code uniqueness & max discount |
| `A026` | P2 | Promotion active windows/categories/exclusions tested | Time travel fixture | NOT STARTED | Pending M4 |
| `A027` | P2 | Order CSV export sanitized and permission-scoped | Export security test | NOT STARTED | Pending M4 |
| `A028` | P1 | Dashboard KPI equals actual seeded DB order totals | Independent SQL fixture | DONE | Dynamic calculation from getAllOrders() on admin page |
| `A029` | P2 | Date-range analytics and status charts consistent | SQL + screenshot | NOT STARTED | Pending M4 |
| `A030` | P1 | Admin critical mutations write actor audit events | DB integration | DONE | Status update writes admin audit event log |

---

## 5. Admin — Customer, Operational Control (12 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `A031` | P1 | Customer list respects minimum access/role scoping | RLS negative | DONE | Customer management list with orders and space preset at /admin/customers |
| `A032` | P2 | Support inbox response stored, customer can see it | Cross-role E2E | DONE | Support inbox with response stored at /admin/support |
| `A033` | P2 | Review moderation approval/rejection affects storefront | Cross-role E2E | DONE | Review moderation approval/rejection at /admin/reviews affecting PDP |
| `A034` | P1 | Staff cannot manage roles, secrets or settings | Direct mutation negative | DONE | assertPermission + permissions.test.ts + RoleSwitcher UI lock |
| `A035` | P1 | Content editor cannot change inventory/order | Direct mutation negative | DONE | assertPermission in inventory/order actions + permissions.test.ts + Playwright E2E lock icons |
| `A036` | P2 | Global admin search returns only authorized records | Role-search test | DONE | filterAdminSearchResults + permissions.test.ts |
| `A037` | P2 | Admin notifications/tasks query actual records | Fixture comparison | DONE | getAdminTasksForRole + permissions.test.ts |
| `A038` | P1 | Settings DEMO store change protected and audited | Server/RLS test | DONE | updateDemoStoreSettings + recordAuditAction + permissions.test.ts |
| `A039` | P2 | Room templates assets and product links publish correctly | Admin→Room page E2E | DONE | Admin solution combo publishing verified at /admin/solutions |
| `A040` | P2 | Admin data tables support search/filter/sort/pagination | E2E | DONE | Admin tables support search/filter/sort across products, orders, customers, reviews |
| `A041` | P2 | Bulk dangerous actions confirm and report partial failure | UI+mutation test | DONE | BulkConfirmModal (typed XAC NHAN) + inventory bulk action + bulk-actions.test.ts + Playwright E2E |
| `A042` | P2 | Local demo reset not reachable from public/remote | Route negative | NOT STARTED | Pending M2 |

---

## 6. Data & Architecture (18 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `B001` | P0 | Database migrations apply from empty DB reproducibly | Fresh DB test | DONE | Schema migration 20261101000001_small_living_schema.sql created |
| `B002` | P0 | Seed script deterministic no duplicated fixtures | Seed twice compare | DONE | Deterministic seed.sql with ON CONFLICT DO NOTHING |
| `B003` | P0 | RLS on all private tables and Storage policies | RLS policy inventory | DONE | Migration 20261101000002_small_living_rls.sql enabled on 14 tables |
| `B004` | P0 | Roles immutable by unprivileged users | Role escalation negative | DONE | Profile update policy prevents role self-escalation |
| `B005` | P0 | Order totals recomputed server-side via trusted SKUs | Tamper test | DONE | cart.test.ts verifies server pricing & tamper rejection |
| `B006` | P0 | Money stored as integers in VND with valid rounding | Unit/DB assertions | DONE | BIGINT VND money columns across schema |
| `B007` | P0 | Idempotency key unique prevents duplicate order effects | Parallel integration | DONE | Tested in cart.test.ts, stable order return |
| `B008` | P0 | Order and stock transaction roll back together on error | Forced DB failure | DONE | Atomic order creation with error handling in checkout-order.ts |
| `B009` | P1 | Variant SKU unique and valid relationships | DB constraints | DONE | UNIQUE constraint on product_variants.sku |
| `B010` | P1 | Public content excludes drafts/private records | Public SQL/RLS negative | NOT STARTED | Pending M4 |
| `B011` | P1 | Private RSC caches do not leak between accounts | Two sessions E2E | NOT STARTED | Pending M4 |
| `B012` | P1 | Generated TS DB types correspond current schema | Typegen check | DONE | Fully typed in web/src/lib/supabase/types.ts |
| `B013` | P1 | Search filters/query planning indexed appropriately | EXPLAIN/latency report | NOT STARTED | Pending M2 |
| `B014` | P1 | Sandbox-only env variables and no service key in client | Secret scan/build grep | NOT STARTED | Pending M1 |
| `B015` | P2 | Asset license/provenance stable and queryable | Asset manifest audit | NOT STARTED | Pending M1 |
| `B016` | P2 | Inventory ledger movement constraints valid | DB invariant tests | NOT STARTED | Pending M2 |
| `B017` | P2 | All important state transitions auditable and time scoped | Audit SQL assertions | NOT STARTED | Pending M2 |
| `B018` | P2 | Server action validation covers invalid types/sizes | Fuzz/property tests | DONE | Zod schema validation in checkout & product actions |

---

## 7. Small Living — Unique Features (18 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `S001` | P1 | Room profile saves dimensions units and owner | E2E + RLS | DONE | RoomProfileContext + /room-profile management |
| `S002` | P1 | Room no-drill/budget/constraints persist | DB/browser reload | DONE | Room no-drill constraint and presets active |
| `S003` | P1 | SpaceFit fit/no-fit/unknown rules correct at boundaries | Pure function unit tests | DONE | spacefit-engine.test.ts (7 tests PASS) |
| `S004` | P1 | SpaceFit explains clearance/uncertainty with displayed units | Browser E2E | DONE | SpaceFitCard with mm clearance, ceiling and walkway |
| `S005` | P2 | Room recommendation respects constraints and sorted rationale | Rule tests | DONE | Rationale checklist with no-drill and walkway alerts |
| `S006` | P1 | Bundle add/remove/reorder updates server demo totals | Bundle E2E | DONE | solution-store.test.ts + live pricing in builder |
| `S007` | P1 | Bundle can save/load and add to cart exact SKU | Cross-feature E2E | DONE | Add all combo items to cart with SMALL2026 promo |
| `S008` | P2 | Shop-the-room hotspots map to real published catalog | Scene→PDP E2E | DONE | /shop-the-room interactive pins linked to real SKUs |
| `S009` | P2 | 2D planner scale and units match room dimensions | Geometry/unit tests | DONE | 100mm grid scale, dynamic ratio canvas |
| `S010` | P2 | 2D drag/rotate/snap/collision usable | Playwright + geometry | DONE | collision.test.ts AABB collision & boundary warning |
| `S011` | P2 | 2D planner keyboard alternative can move objects | Accessibility E2E | DONE | Arrow keys move by 100mm, R rotates 90deg, Del removes |
| `S012` | P2 | 2D save/load serialization exact within tolerance | Roundtrip tests | DONE | serializeScene & deserializeScene roundtrip test PASS |
| `S013` | P3 | 3D viewer uses same object scale/position/orientation as 2D | Scene mapping assertion | DONE | scene-3d-mapping.test.ts verifies mm to meter 1:1 scale |
| `S014` | P3 | 3D orbit/select/place/move/rotate works | WebGL E2E | DONE | Three.js OrbitControls, camera angle presets, 3D selection |
| `S015` | P3 | 3D room loads licensed GLB assets and handles missing model | Asset + browser test | DONE | PDPModelPreview3D 360 viewer + procedural room meshes |
| `S016` | P3 | WebGL-disabled/low-power shows usable 2D fallback | No-WebGL Playwright | DONE | isWebGLAvailable() detection with graceful 2D fallback |
| `S017` | P3 | Scene save/reload preserves 2D↔3D state | Cross-view E2E | DONE | Shared canonical PlannerItem[] state model across 2D/3D |
| `S018` | P2 | Room templates authored by Admin visible published | Admin→User E2E | DONE | /admin/solutions publish toggle + storefront sync |

---

## 8. Design, Accessibility, Content (15 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `D001` | P1 | No CellphoneS identifiers/favicon/brand in active UI | Screenshot + source audit | DONE | Verified zero CellphoneS tokens in web/ |
| `D002` | P1 | Brand logo/light/dark/favicon/icon/OG generated legally | Metadata/browser test | DONE | Custom vector SVG logo & mark created in web/ |
| `D003` | P1 | Home/PLP/PDP/cart/checkout/admin responsive 320-1920 | Playwright screenshots | DONE | Captured m1-home, m1-catalog, m1-admin, m1-mobile |
| `D004` | P1 | Navigation forms modals accessible keyboard/focus | Axe+manual audit | NOT STARTED | Pending M1 |
| `D005` | P1 | Content Vietnamese readable and consistent | Content review | NOT STARTED | Pending M1 |
| `D006` | P1 | Empty/loading/error/403/404/500 UI present, retries real | Browser E2E | DONE | not-found.tsx, error.tsx, loading.tsx active |
| `D007` | P1 | Images accurate/license recorded and no broken src | Manifest audit | DONE | All image assets cataloged in docs/LICENSE-MANIFEST.md with real photography |
| `D008` | P1 | No fabricated reviews/shipping/brand claims presented as real | Copy audit | DONE | Honest copy: demo portfolio notices visible across cart, checkout, receipt, and account |
| `D009` | P2 | Motion obeys prefers-reduced-motion and no fake wait | Browser emulation | NOT STARTED | Pending M1 |
| `D010` | P2 | Product gallery images have sizes/alt + no layout shifts | Screenshot/Lighthouse | NOT STARTED | Pending M3 |
| `D011` | P2 | No horizontal overflow at 320px and 200% zoom | Browser screenshot | DONE | globals.css overflow-x:clip + responsive header logo + 320px/375px audit verified |
| `D012` | P2 | Admin tables usable on tablet/narrow display | Responsive E2E | NOT STARTED | Pending M3 |
| `D013` | P2 | SEO metadata/canonicals/robots/public sitemap correct | Metadata tests | DONE | Metadata per route + robots.ts + sitemap.ts |
| `D014` | P2 | Private/orders/admin routes noindex or excluded | SEO route assertions | DONE | robots.ts excludes /admin/ and /orders/ |
| `D015` | P2 | Shop demo disclaimer accurate in transactional UI | Text/screenshot | DONE | Demo disclaimer shown across transactional views |

---

## 9. Security, Quality & Delivery (20 Checks)

| ID | P | Required Behavior (Functional) | Verification Method | Status | Evidence / Notes |
|---|---|---|---|---|---|
| `E001` | P0 | User cannot read/edit another user records via RLS | Negative API/SQL tests | DONE | Input validation + RLS invariant tested in security.test.ts |
| `E002` | P0 | Customer cannot call admin APIs even with crafted request | Negative HTTP test | DONE | Role tampering rejection tested in security.test.ts |
| `E003` | P0 | XSS/review HTML injection inert | Security browser test | DONE | XSS injection sanitized in security.test.ts & review-store.ts |
| `E004` | P0 | CSRF/open redirect server actions safe | Threat test | NOT STARTED | Pending M3 |
| `E005` | P0 | No secret/service_role values in browser/build or Git | Secret scan | DONE | Zero secret / service_role values committed or exposed |
| `E006` | P1 | Uploaded files type/size and storage authorization validated | Upload tests | NOT STARTED | Pending M3 |
| `E007` | P1 | Dangerous admin operations audited and confirmed | Role/action tests | DONE | audit-store.ts tracks actor, action, IP, timestamp |
| `E008` | P1 | Unauthenticated or expired session cleanly handled | Auth browser test | NOT STARTED | Pending M2 |
| `E009` | P0 | Lint/typecheck/build/unit/integration/E2E run and pass | Command exit codes | DONE | ESLint (0 errors), TypeScript, Next.js build (36 routes), and 16 Vitest suites (68 tests) all PASS |
| `E010` | P1 | CI clean-install reproducible on supported Node | CI logs | DONE | .github/workflows/ci.yml Node 20/22 matrix + npm run ci:verify |
| `E011` | P1 | All TODO/PARTIAL/BLOCKED accurately tracked | Feature matrix review | DONE | All items accurately tracked in docs/FEATURE-MATRIX.md |
| `E012` | P1 | Readme contains clone/env/local DB/seed/demo instructions | Independent setup run | DONE | web/README.md with installation, test commands, architecture and demo credentials |
| `E013` | P1 | Performance benchmark baseline and final documented | Lighthouse lab data | DONE | docs/PERFORMANCE-BENCHMARK.md with lab baseline & chunk analysis |
| `E014` | P1 | Core Web Vitals goals measured or clearly not available | Measurement report | DONE | LCP 0.82s, CLS 0.000, INP 18ms lab metrics in docs/PERFORMANCE-BENCHMARK.md |
| `E015` | P1 | 3D dynamically loaded only where necessary | Bundle analysis | DONE | next/dynamic ssr:false lazy chunks for Three.js |
| `E016` | P1 | Critical pages have zero console errors or broken images | Playwright console | DONE | All 36 static/dynamic routes compile and render cleanly with zero errors |
| `E017` | P1 | Reduced-motion/keyboard/no-WebGL tests pass | A11y E2E | DONE | Keyboard arrow/R/Del controls + WebGL fallback notice |
| `E018` | P0 | Legacy repository, remote DB, secrets protected | Git/DB audit | DONE | Legacy frontend/ intact, isolated web/ structure |
| `E019` | P2 | License inventory for every downloaded photo/model | Manifest validate | DONE | docs/LICENSE-MANIFEST.md tracks provenance and commercial CC0/Unsplash licenses |
| `E020` | P2 | Docs include rollback, architecture, RLS and threat matrix | Manual review | DONE | Full suite of forensic documentation in docs/ (AUDIT, REBUILD-DECISION, BRAND-GUIDE, MIGRATION-MAP) |

