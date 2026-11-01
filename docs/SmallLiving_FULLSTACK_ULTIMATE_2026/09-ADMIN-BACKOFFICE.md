# 09 — ADMIN BACKOFFICE: NOT A MOCK DASHBOARD

## Design
Calm data-dense Admin: navigation sidebar, global search/quick create, breadcrumbs, filterable tables, modal/side-panel forms, visible system status, batch actions only when confirmed, permission-based actions, responsive admin navigation. No 3D decoration, meaningless KPI charts, random numbers or unsafe optimistic updates.

## Modules and functional acceptance
**Overview** — order demo value, count/status, low stock, product publishing, top viewed/ordered based on tracked events if implemented; time window and definitions, real DB queries; empty state if no data.

**Products** — list/search/sort/filter/bulk publish; create/edit/archive products; variants (size/material/color SKU); image gallery (legal assets); dimensions/weight/install tags/no-drill metadata; slug/unique key validation; preview user PDP; cache invalidation. Restore archived if appropriate.

**Categories & Collections** — tree and navigation taxonomy, reorder, prevent category cycles, assign products, merchandising blocks and homepage placement, scheduled publish only if implemented accurately.

**Inventory** — per-variant demo stock ledger, adjustment reasons/user/timestamp, out-of-stock and low-stock indicator; stock reservation vs decrement is one documented model, not two conflicting models. Admin adjusts stock -> PDP/cart reflect new stock.

**Orders & Fulfillment (demo)** — admin receives user orders, detail snapshots, paid/unpaid status must clearly be mock, process/complete/cancel with validated transitions, return/demo refund only if covered by tests; audit timeline and stock reversal logic.

**Customers** — scoped profile, order summaries, test account statuses, saved solutions summary if authorized; no display of password hashes, tokens, addresses not necessary to task.

**Promotions** — demo discount code creation/enable/disable, constraints, usage limits, validity, conflict resolution and server-side price computation. No fake success unless actual order total changes correctly.

**Visual CMS** — hero cards, room stories, lookbooks, image hotspots, navigation tiles, guide pages and brand messages with draft/publish, image-license fields and preview. Changes reflected in User frontend; avoid requiring source edit to change banners.

**Solution Studio** — curated room starter bundles and room presets, products/qty/budget constraints, publish/draft, visualize fit rule explanations, attach scene view IDs only when linked to legal assets.

**Analytics/Audit** — simple reliable charts from demo DB events, data dictionary and date ranges, CSV export optional if it truly works, admin changes audit and action logs. Favor accuracy over broad vanity metrics.

**Settings** — only public site name/demo disclaimer/basic configuration actually used in code, and carefully controlled changes to feature flags.

## Role-based security
Use server check + RLS for each protected operation, not only UI guard; `admin` role must not be assignable through public user profile field. Anonymous/customer cannot create a product or change price/stock via direct API/PostgREST/server action. Tests for negative cases required.

## QA sequence
Create product via Admin → visible in Shop. Change price/stock → PDP and cart/checkout recompute. User order → Admin sees it → Admin updates demo status → User order timeline updates. Archive product → public listing no longer serves it, old order snapshot remains stable. Record SQL/RLS tests and browser screenshots.
