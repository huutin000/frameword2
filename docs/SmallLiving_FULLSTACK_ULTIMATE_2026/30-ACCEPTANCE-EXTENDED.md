# 30 — EXTENDED ACCEPTANCE MATRIX — FULL SMALL LIVING PLATFORM

> This is a detailed reference for creating `docs/FEATURE-MATRIX.md` in the implementation repository. **All statuses start NOT STARTED**. A screenshot alone never makes a business feature DONE. Test/evidence must be provided per ID.

| Priority | Meaning |
|---|---|
| P0 | Security and commerce data-integrity blocker. Must pass before claiming an end-to-end demo. |
| P1 | Complete core experience across User/Admin; required for full platform sign-off. |
| P2 | Comprehensive extended commerce/Small Living portfolio quality; also required for declared overall COMPLETE. |
| P3 | High-effort 3D planner and optional advanced functionality. Must be implemented if claiming 3D platform is complete. |

## Status schema

`NOT STARTED → IN PROGRESS → DONE`; or `PARTIAL/BLOCKED/NOT RUN`. Record implementation path, exact test command/exit code, evidence and notes. A feature with only front-end component must remain PARTIAL.

## User — navigation & discovery

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `U001` | P1 | Home content/hero/categories come from published demo CMS | Admin publish to home, E2E | NOT STARTED |
| `U002` | P1 | Brand header/menu/mobile drawer navigation works at every viewport | Playwright keyboard + screenshots | NOT STARTED |
| `U003` | P1 | Search returns correct published products and query persists in URL | Search E2E + DB comparison | NOT STARTED |
| `U004` | P1 | Search suggestions arrow/enter/escape and accessible label | Keyboard E2E | NOT STARTED |
| `U005` | P1 | Category/subcategory taxonomy and breadcrumb work | Route & taxonomy integration | NOT STARTED |
| `U006` | P1 | Multiselect facet filters combine AND/OR as specified | Filter query/unit + E2E | NOT STARTED |
| `U007` | P1 | Filter chips clear individual and all filters | E2E browser back/forward | NOT STARTED |
| `U008` | P1 | Sort price/name/relevance consistently with tie-break | SQL/integration + E2E | NOT STARTED |
| `U009` | P1 | Pagination/load-more never duplicate/skips | Integration paging tests | NOT STARTED |
| `U010` | P1 | PLP handles 0 results and loading/network errors | Playwright cases | NOT STARTED |
| `U011` | P1 | Products with variants appear logically grouped | Catalog E2E | NOT STARTED |
| `U012` | P1 | Product detail loads exact variant price/dimensions/images | Variant integration | NOT STARTED |
| `U013` | P1 | Product gallery zoom/thumbnails keyboard accessible | Browser E2E | NOT STARTED |
| `U014` | P2 | Compare 2-4 products on meaningful attributes | Browser E2E | NOT STARTED |
| `U015` | P2 | Wishlist/save persists under user owner | RLS and reload E2E | NOT STARTED |
| `U016` | P2 | Recently viewed matches recent real products without exposing private data | Browser test | NOT STARTED |
| `U017` | P2 | Room/problem landing pages link published products | Routing + DB test | NOT STARTED |
| `U018` | P2 | Guides/FAQ/Contact have real content and working links | Link audit + screenshot | NOT STARTED |
| `U019` | P2 | Product 404 and unpublished statuses are correct | Route negative tests | NOT STARTED |
| `U020` | P2 | Shop-the-Room hotspots lead to correct SKUs | Scene and click E2E | NOT STARTED |

## User — identity & customer

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `U021` | P0 | Supabase auth sign up/login/logout with session on server | Auth E2E | NOT STARTED |
| `U022` | P1 | Forgot/reset password works in safe sandbox or is BLOCKED explicitly | Auth integration | NOT STARTED |
| `U023` | P0 | Private account route redirects unauthorized users | Direct URL/API negative | NOT STARTED |
| `U024` | P1 | Profile updates DB fields and persists | Account E2E | NOT STARTED |
| `U025` | P1 | Address CRUD scoped to owner; default selection works | RLS + E2E | NOT STARTED |
| `U026` | P1 | Cart guest persists without hydration mismatch | Reload/browser console test | NOT STARTED |
| `U027` | P1 | Cart authenticated state persists and merge rule works | Browser two-session test | NOT STARTED |
| `U028` | P1 | Cart quantity/remove reflects actual variant and stock | Cart E2E | NOT STARTED |
| `U029` | P0 | Server recalculates cart amounts, rejects client forged prices | Tamper integration | NOT STARTED |
| `U030` | P1 | Valid/invalid/expired promo rules show correct totals | Coupon boundary tests | NOT STARTED |
| `U031` | P0 | Checkout DEMO creates exactly one order even on double submit | Idempotency DB test | NOT STARTED |
| `U032` | P0 | Checkout prevents overselling inventory | Parallel transaction test | NOT STARTED |
| `U033` | P1 | Checkout success/fail/pending recovery UI based on DB status | E2E payment simulator | NOT STARTED |
| `U034` | P1 | Order list/detail belongs to logged-in customer | RLS + browser | NOT STARTED |
| `U035` | P1 | Order line snapshot immutable after product edit | DB integration | NOT STARTED |
| `U036` | P1 | Order timeline updates when Admin changes status | Cross-role E2E | NOT STARTED |
| `U037` | P2 | Customer cancellation requests enforce valid order states | State machine tests | NOT STARTED |
| `U038` | P2 | Return/refund DEMO request and progress functional | Admin-to-User E2E | NOT STARTED |
| `U039` | P2 | Review/Q&A submitted, moderated, and escaped | XSS negative + moderation E2E | NOT STARTED |
| `U040` | P2 | Support ticket flows save replies in-app, no real email | Cross-role E2E | NOT STARTED |
| `U041` | P2 | Notification center read/unread tied to events | DB event/browser test | NOT STARTED |
| `U042` | P1 | Demo disclaimer shown at checkout/payment/receipts | Screenshots + text audit | NOT STARTED |

## Admin — catalog, media, content

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `A001` | P0 | Admin only accessible to authorized role in server and DB | Direct request negative | NOT STARTED |
| `A002` | P1 | Admin shell/sidebar/breadcrumb/search responsive and keyboard usable | Screenshot + keyboard | NOT STARTED |
| `A003` | P0 | Product create/edit/archive/publish synced to storefront | Admin→DB→User E2E | NOT STARTED |
| `A004` | P0 | Variant SKU/price/dimensions correct per variant | DB constraints + E2E | NOT STARTED |
| `A005` | P1 | Category hierarchy editable without cycles | Constraint/integration test | NOT STARTED |
| `A006` | P1 | Collections curated/reordered/published, frontend updated | Cross-role E2E | NOT STARTED |
| `A007` | P1 | Draft product not visible to public before publishing | RLS/route tests | NOT STARTED |
| `A008` | P1 | Catalog media upload/choose/remove with license metadata | Storage policy + browser | NOT STARTED |
| `A009` | P1 | CMS homepage banner blocks publish/unpublish | Cross-role E2E | NOT STARTED |
| `A010` | P2 | Guide/FAQ/pages editor saves and serves published content | CMS E2E | NOT STARTED |
| `A011` | P2 | Navigation/announcement content editor works | Admin→Home E2E | NOT STARTED |
| `A012` | P2 | Media library filters orphan and usage metadata | DB/report test | NOT STARTED |
| `A013` | P2 | Bulk catalog edit/import has preview and row errors if implemented | CSV fixture tests | NOT STARTED |
| `A014` | P1 | Product form handles duplicates/errors/dirty edits | Form E2E | NOT STARTED |
| `A015` | P1 | Publish cache invalidation prevents stale public content | Browser/regeneration test | NOT STARTED |

## Admin — orders, inventory, promotions

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `A016` | P0 | Orders list shows true DB orders + filters | DB fixture and E2E | NOT STARTED |
| `A017` | P0 | Order status only valid transitions and actors | State-machine negative | NOT STARTED |
| `A018` | P0 | Order timeline recorded as append-only events | DB integration | NOT STARTED |
| `A019` | P1 | Demo payment failure/pending/success flags consistent | Simulator E2E | NOT STARTED |
| `A020` | P1 | Cancel/refund simulation idempotent and audited | Repeat action tests | NOT STARTED |
| `A021` | P0 | Inventory stock adjustment creates ledger event | DB integration | NOT STARTED |
| `A022` | P0 | Stock concurrency never negative | Parallel DB transaction | NOT STARTED |
| `A023` | P1 | Low stock threshold and dashboard signal accurate | Fixtures + UI | NOT STARTED |
| `A024` | P1 | Restock on approved cancellation follows policy once | Idempotency test | NOT STARTED |
| `A025` | P1 | Promotion rules validated on server and max use | Boundary/abuse tests | NOT STARTED |
| `A026` | P2 | Promotion active windows/categories/exclusions tested | Time travel fixture | NOT STARTED |
| `A027` | P2 | Order CSV export sanitized and permission-scoped | Export security test | NOT STARTED |
| `A028` | P1 | Dashboard KPI equals actual seeded DB order totals | Independent SQL fixture | NOT STARTED |
| `A029` | P2 | Date-range analytics and status charts consistent | SQL + screenshot | NOT STARTED |
| `A030` | P1 | Admin critical mutations write actor audit events | DB integration | NOT STARTED |

## Admin — customer, operational control

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `A031` | P1 | Customer list respects minimum access/role scoping | RLS negative | NOT STARTED |
| `A032` | P2 | Support inbox response stored, customer can see it | Cross-role E2E | NOT STARTED |
| `A033` | P2 | Review moderation approval/rejection affects storefront | Cross-role E2E | NOT STARTED |
| `A034` | P1 | Staff cannot manage roles, secrets or settings | Direct mutation negative | NOT STARTED |
| `A035` | P1 | Content editor cannot change inventory/order | Direct mutation negative | NOT STARTED |
| `A036` | P2 | Global admin search returns only authorized records | Role-search test | NOT STARTED |
| `A037` | P2 | Admin notifications/tasks query actual records | Fixture comparison | NOT STARTED |
| `A038` | P1 | Settings DEMO store change protected and audited | Server/RLS test | NOT STARTED |
| `A039` | P2 | Room templates assets and product links publish correctly | Admin→Room page E2E | NOT STARTED |
| `A040` | P2 | Admin data tables support search/filter/sort/pagination | E2E | NOT STARTED |
| `A041` | P2 | Bulk dangerous actions confirm and report partial failure | UI+mutation test | NOT STARTED |
| `A042` | P2 | Local demo reset not reachable from public/remote | Route negative | NOT STARTED |

## Data & architecture

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `B001` | P0 | Database migrations apply from empty DB reproducibly | Fresh DB test | NOT STARTED |
| `B002` | P0 | Seed script deterministic no duplicated fixtures | Seed twice compare | NOT STARTED |
| `B003` | P0 | RLS on all private tables and Storage policies | RLS policy inventory | NOT STARTED |
| `B004` | P0 | Roles immutable by unprivileged users | Role escalation negative | NOT STARTED |
| `B005` | P0 | Order totals recomputed server-side via trusted SKUs | Tamper test | NOT STARTED |
| `B006` | P0 | Money stored as integers in VND with valid rounding | Unit/DB assertions | NOT STARTED |
| `B007` | P0 | Idempotency key unique prevents duplicate order effects | Parallel integration | NOT STARTED |
| `B008` | P0 | Order and stock transaction roll back together on error | Forced DB failure | NOT STARTED |
| `B009` | P1 | Variant SKU unique and valid relationships | DB constraints | NOT STARTED |
| `B010` | P1 | Public content excludes drafts/private records | Public SQL/RLS negative | NOT STARTED |
| `B011` | P1 | Private RSC caches do not leak between accounts | Two sessions E2E | NOT STARTED |
| `B012` | P1 | Generated TS DB types correspond current schema | Typegen check | NOT STARTED |
| `B013` | P1 | Search filters/query planning indexed appropriately | EXPLAIN/latency report | NOT STARTED |
| `B014` | P1 | Sandbox-only env variables and no service key in client | Secret scan/build grep | NOT STARTED |
| `B015` | P2 | Asset license/provenance stable and queryable | Asset manifest audit | NOT STARTED |
| `B016` | P2 | Inventory ledger movement constraints valid | DB invariant tests | NOT STARTED |
| `B017` | P2 | All important state transitions auditable and time scoped | Audit SQL assertions | NOT STARTED |
| `B018` | P2 | Server action validation covers invalid types/sizes | Fuzz/property tests | NOT STARTED |

## Small Living — unique features

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `S001` | P1 | Room profile saves dimensions units and owner | E2E + RLS | NOT STARTED |
| `S002` | P1 | Room no-drill/budget/constraints persist | DB/browser reload | NOT STARTED |
| `S003` | P1 | SpaceFit fit/no-fit/unknown rules correct at boundaries | Pure function unit tests | NOT STARTED |
| `S004` | P1 | SpaceFit explains clearance/uncertainty with displayed units | Browser E2E | NOT STARTED |
| `S005` | P2 | Room recommendation respects constraints and sorted rationale | Rule tests | NOT STARTED |
| `S006` | P1 | Bundle add/remove/reorder updates server demo totals | Bundle E2E | NOT STARTED |
| `S007` | P1 | Bundle can save/load and add to cart exact SKU | Cross-feature E2E | NOT STARTED |
| `S008` | P2 | Shop-the-room hotspots map to real published catalog | Scene→PDP E2E | NOT STARTED |
| `S009` | P2 | 2D planner scale and units match room dimensions | Geometry/unit tests | NOT STARTED |
| `S010` | P2 | 2D drag/rotate/snap/collision usable | Playwright + geometry | NOT STARTED |
| `S011` | P2 | 2D planner keyboard alternative can move objects | Accessibility E2E | NOT STARTED |
| `S012` | P2 | 2D save/load serialization exact within tolerance | Roundtrip tests | NOT STARTED |
| `S013` | P3 | 3D viewer uses same object scale/position/orientation as 2D | Scene mapping assertion | NOT STARTED |
| `S014` | P3 | 3D orbit/select/place/move/rotate works | WebGL E2E | NOT STARTED |
| `S015` | P3 | 3D room loads licensed GLB assets and handles missing model | Asset + browser test | NOT STARTED |
| `S016` | P3 | WebGL-disabled/low-power shows usable 2D fallback | No-WebGL Playwright | NOT STARTED |
| `S017` | P3 | Scene save/reload preserves 2D↔3D state | Cross-view E2E | NOT STARTED |
| `S018` | P2 | Room templates authored by Admin visible published | Admin→User E2E | NOT STARTED |

## Design, accessibility, content

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `D001` | P1 | No CellphoneS identifiers/favicon/brand in active UI | Screenshot + source audit | NOT STARTED |
| `D002` | P1 | Brand logo/light/dark/favicon/icon/OG generated legally | Metadata/browser test | NOT STARTED |
| `D003` | P1 | Home/PLP/PDP/cart/checkout/admin responsive 320-1920 | Playwright screenshots | NOT STARTED |
| `D004` | P1 | Navigation forms modals accessible keyboard/focus | Axe+manual audit | NOT STARTED |
| `D005` | P1 | Content Vietnamese readable and consistent | Content review | NOT STARTED |
| `D006` | P1 | Empty/loading/error/403/404/500 UI present, retries real | Browser E2E | NOT STARTED |
| `D007` | P1 | Images accurate/license recorded and no broken src | Manifest audit | NOT STARTED |
| `D008` | P1 | No fabricated reviews/shipping/brand claims presented as real | Copy audit | NOT STARTED |
| `D009` | P2 | Motion obeys prefers-reduced-motion and no fake wait | Browser emulation | NOT STARTED |
| `D010` | P2 | Product gallery images have sizes/alt + no layout shifts | Screenshot/Lighthouse | NOT STARTED |
| `D011` | P2 | No horizontal overflow at 320px and 200% zoom | Browser screenshot | NOT STARTED |
| `D012` | P2 | Admin tables usable on tablet/narrow display | Responsive E2E | NOT STARTED |
| `D013` | P2 | SEO metadata/canonicals/robots/public sitemap correct | Metadata tests | NOT STARTED |
| `D014` | P2 | Private/orders/admin routes noindex or excluded | SEO route assertions | NOT STARTED |
| `D015` | P2 | Shop demo disclaimer accurate in transactional UI | Text/screenshot | NOT STARTED |

## Security, quality & delivery

| ID | P | Required behavior — functional | Test/evidence | Default status |
|---|---|---|---|---|
| `E001` | P0 | User cannot read/edit another user records via RLS | Negative API/SQL tests | NOT STARTED |
| `E002` | P0 | Customer cannot call admin APIs even with crafted request | Negative HTTP test | NOT STARTED |
| `E003` | P0 | XSS/review HTML injection inert | Security browser test | NOT STARTED |
| `E004` | P0 | CSRF/open redirect server actions safe | Threat test | NOT STARTED |
| `E005` | P0 | No secret/service_role values in browser/build or Git | Secret scan | NOT STARTED |
| `E006` | P1 | Uploaded files type/size and storage authorization validated | Upload tests | NOT STARTED |
| `E007` | P1 | Dangerous admin operations audited and confirmed | Role/action tests | NOT STARTED |
| `E008` | P1 | Unauthenticated or expired session cleanly handled | Auth browser test | NOT STARTED |
| `E009` | P0 | Lint/typecheck/build/unit/integration/E2E run and pass | Command exit codes | NOT STARTED |
| `E010` | P1 | CI clean-install reproducible on supported Node | CI logs | NOT STARTED |
| `E011` | P1 | All TODO/PARTIAL/BLOCKED accurately tracked | Feature matrix review | NOT STARTED |
| `E012` | P1 | Readme contains clone/env/local DB/seed/demo instructions | Independent setup run | NOT STARTED |
| `E013` | P1 | Performance benchmark baseline and final documented | Lighthouse lab data | NOT STARTED |
| `E014` | P1 | Core Web Vitals goals measured or clearly not available | Measurement report | NOT STARTED |
| `E015` | P1 | 3D dynamically loaded only where necessary | Bundle analysis | NOT STARTED |
| `E016` | P1 | Critical pages have zero console errors or broken images | Playwright console | NOT STARTED |
| `E017` | P1 | Reduced-motion/keyboard/no-WebGL tests pass | A11y E2E | NOT STARTED |
| `E018` | P0 | Legacy repository, remote DB, secrets protected | Git/DB audit | NOT STARTED |
| `E019` | P2 | License inventory for every downloaded photo/model | Manifest validate | NOT STARTED |
| `E020` | P2 | Docs include rollback, architecture, RLS and threat matrix | Manual review | NOT STARTED |

## Minimum quality gates

- Functional: path is reachable, UI works, server validates, data persists and authorized user sees correct result.
- Negative: unauthorized attempts, bad inputs, duplicate/midair requests and error/retry behave correctly.
- Visual: relevant desktop/mobile screenshot, keyboard support, no error console or broken images.
- Evidence: explicit log/test result, not simulated success or "should work".

**Total required checks: 155**. This is not a mandate to build 100 separate components; several checks share a single domain module or E2E journey. Prioritize by dependencies, never inflate feature count through useless abstraction.
