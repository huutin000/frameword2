# 21 — COMPLETE ADMIN BACKOFFICE: NOT A CRUD-ONLY PANEL

## Admin visual system

Use compact professional dashboard visual language (e.g. Shopify-inspired operational density, NOT clone), distinct from lifestyle storefront. Sidebar grouped by functions; global search, breadcrumbs, notification inbox, role-aware commands, responsive table→card, keyboard navigation, skeleton/empty/error states, sticky save bar for dirty forms. The Admin is a real operational tool. Desktop first but tablet/mobile functional.

## Navigation groups and screens

### Overview & workspace

- **Dashboard**: KPI cards derived from demo DB orders/revenue/refunds/low-stock, compare periods with dates, chart trends, top products, recent orders, to-do exceptions, audit recency; loading/error/zero states.
- **Global Admin Search**: products/SKUs, orders, customers, collections, content by ID or name; respects role permissions and limits.
- **Notifications & tasks**: unfulfilled orders, restock alerts, pending reviews, failed imports, content scheduled; read/unread and shortcuts.

### Catalog

- Products list with search, filters, sort, pagination, bulk publish/archive/export, explicit selection count.
- Product create/edit with status, title/slug, SEO, description, gallery, material, weight, depth/width/height(mm), room/problem tags, no-drill constraints, options, variants/SKU, demo prices, inventory policy, previews, undo or cancel, dirty confirmation.
- Category hierarchy tree/reorder/move, slug collision handling, images and metadata; avoid cycles.
- Product attributes and facets definitions, variant options, import CSV preview/validation/duplicates & safe export (P2), per-row errors.
- Collections/featured grids and room bundles with manual order, visibility, schedules; CMS & storefront invalidation.
- Media library with provenance, licensed assets, alt descriptions, dimensions, file type/size limits, replace references and orphan cleanup preview; no unsanctioned web scraping.

### Sales & operations

- Orders: grouped list by status/date/amount/payment simulation, search order ID, detail timeline, line snapshot, shipping method, adjustment notes, authorized status actions, export sanitized; all changes audited.
- Demo Payments: status simulation, failed/pending/retry, refund confirmation guarded, **no real card number or SDK**.
- Returns/Cancellations: request queue, customer reason, eligibility, approve/reject, internal restock, refund-demo status, timeline notes.
- Inventory: SKU stock list, adjustment modal reason, inventory movements, low-stock threshold, restock mock, concurrency warnings, role protection.
- Promotions: code builder for percentage/fixed, validity, usage limits, combinability, product/category eligibility, active/inactive toggle, preview of price calculation.

### Customers & support

- Customer list with minimum necessary demo information, safe search/filter; account profile, orders, room plans, support tickets. No password display, no impersonation by default.
- Support tickets/messages from site: status, assignee, responses stored in DB with visible demo label; no mail sending without permissions.
- Reviews & Q&A moderation: approve/reject, report abuse, display provenance `DEMO REVIEW`, audit and owner rules; escape HTML.

### Content & Small Living

- Homepage builder *constrained block types* (hero, category spotlight, room editorial, product shelf, solution CTA) with validation; publish/preview, schedule if implemented, no general-purpose website builder.
- Navigation manager, landing pages, guides, FAQ, announcements, SEO title/meta/OG, internal links, drafts/published states.
- Room templates: create/edit geometry (dimensions, window/door slots optional), curated product hotspots, approved image and 3D asset mapping, publish to Shop the Room.
- SpaceFit rule sets: dimension tolerance, no-drill, clearance/access paths; editable only when tested and versioned. Do not allow arbitrary SQL/JS injected via admin forms.

### Reports & systems

- Reports: demo revenue/units/orders/status funnel, returned orders, inventory movement, top rooms/products; date ranges and drilldowns; export CSV sanitized.
- Audit log with actor, action, target, diff summary, timestamp; no secrets/PII in logs.
- Settings: business name/logo/theme tokens + DEMO disclosure, shipping simulation rules, currency/language, stock thresholds, roles/permissions view, feature flags with clearly labeled status.
- Sandbox tools: seed status, fixture provenance, reset demo data only in isolated local/test with confirmation, never production remote.

## Role & permission policy

| Area | customer | staff | catalog_editor | admin |
|---|---|---|---|---|
| Product draft/publish | deny | read-only scoped | allow scoped | allow |
| Stock/order changes | deny | allow authorized transition | deny | allow |
| Customers/support | own only | scoped minimum | deny | allow minimum |
| Promotions and CMS | deny | read | allow as assigned | allow |
| Manage staff/roles/settings | deny | deny | deny | allow audited |
| Audit logs | own limited events only | deny | deny | allow |

Enforce on **server and RLS**. Hide UI controls as convenience, never as sole authorization. If roles are simplified to `customer/staff/admin`, document actual policy instead of fake staff privilege granularity.

## UX quality for CRUD and bulk jobs

- List pages have filters + predictable URL state, pagination, saved views if helpful, row actions and accessible dropdowns.
- Forms preserve unsaved edits, focus first error, server errors inline; upload progress; duplicate name and slug feedback.
- Dangerous actions need confirm with object name/impact; reversible archive preferred over delete; relation constraints explained.
- Every table has loading/empty/error/permission/no-results, responsive minimum columns and detail drawer.
- Bulk tasks preview affected rows, progress, per-row results, partial failures and no duplicate submits.
- Charts have textual summary and accessible table fallback; no fabricated data unrelated to DB.

## Mandatory admin E2E

1. Admin create+publish category/product → User finds it via search and category.
2. Staff cannot access admin-role settings; customer cannot call any admin mutation endpoint directly.
3. Admin adjusts stock → storefront available stock updates; checkout rejects unavailable variant.
4. Customer submits order → order queue receives exact item snapshot → staff updates status → User timeline updates.
5. Admin publishes homepage block → User sees; unpublishes → block disappears after revalidation.
6. Moderator approves review → appears on product; rejects → stays hidden.
7. Admin report totals equal independently computed DB fixture expected values.
8. Audit event exists for critical admin action, with safe field set, timestamp and actor.
