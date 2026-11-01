# 24 — COMPLETE SCREEN INVENTORY & UI STATES

**Purpose:** Prevent agent from building only Home + PLP + PDP + Cart. List is a product-architecture checklist, not mandatory exact URL map. Agent selects clean routes based on Next.js conventions, persists important page state in URLs, documents sitemap and tests. Do not generate empty scaffolding pages to claim completeness.

## Storefront — global shell

- Responsive announcement (only verified demo content); brand header, compact sticky behavior, search combobox keyboard, categories mega-menu, mobile drawer, account/actions, cart count.
- Footer with navigation by policy/info/rooms/products, functional links, copyright, brand and disclaimer DEMO; privacy/terms pages adapted to demo context.
- Breadcrumbs, back-to-results, recently viewed, toast/notification patterns, locale/currency, support/help link.

## Public discovery and content pages

| Page/screen | Components and behavior |
|---|---|
| Home `/` | editorial hero, category discovery, room collections, solution by problem, curated product shelves, shop-the-room teasers, useful guide features |
| All categories | category tile index, room/problem grouping, thumbnail and counts from real demo data |
| Category landing | hero/intro optional, subcategories, facet filters, product grid, featured editorial, breadcrumb |
| Search results | query URL, suggestions, tolerant empty search, applied facets, sorting and pagination; no silent fake filter |
| Collection | title/visual, curated products, explanatory story, compare discovery |
| Browse by room | bedroom/kitchen/bathroom/entryway/balcony/studio routes with constraints |
| Browse by problem | no-drill, storage, foldable furniture, small-space laundry, moisture-friendly storage, moving renter |
| Product listing | desktop filter sidebar, mobile bottom sheet, product count, sort, chips, multi-select, pagination, skeleton |
| Product detail | gallery+zoom, options and stock, detailed dimensions in mm/cm, fit hints, installation constraints, variants, Q&A/reviews, related, sample room visuals |
| Product comparison | select 2–4 relevant, comparable dimensions/specs, remove/change columns, mobile scroll with persistent labels |
| Wishlist & saved | auth/guest states, toggles, folders optional, empty state and sorting |
| Shop the Room | room photo/3D overview with licensed hotspots -> product drawers and curated bundle CTA |
| Room inspiration | curated real photographed small-space layouts and budgets DEMO, tags, copy |
| Guides & FAQ | practical how-to content and contextual links; do not claim professional advice or real warranties |
| About / Contact | authentic project statement, no fake address/phone/legal entity; contact ticket demo or clearly labelled alternative |
| Search / filter no-results | reasons, remove filters, related categories, retry on network error |

## Customer and transaction pages

| Page/screen | Components and behavior |
|---|---|
| Sign in / Sign up | validation, password reveal, safe error, verification email flow sandbox or mock if auth stack cannot send |
| Forgot/reset password | actual sandbox implementation or tracked BLOCKED with no deceptive button |
| Account dashboard | profile, saved rooms, recent orders, wishlist, support messages |
| Profile edit | fields from DB, form dirty state, save/error, optional avatar with license/privacy |
| Address book | validated synthetic addresses, choose default, delete confirm, owner RLS |
| Cart | variant image/qty/delete, stock changed notice, coupon code, subtotal, empty state |
| Checkout steps | contact/address/shipping DEMO, review order, promo, payment DEMO disclosure, validation, loading/idempotency |
| Checkout result | success/failure/pending visual, order ID and recovery action |
| Orders list | tabs/status/date range, simple summary, empty state |
| Order detail | immutable line snapshot, timeline, notes, simulated payment/refund, cancel/return action guarded |
| Return request | eligible order lines, reason, explanation and progress timeline DEMO |
| Notifications | read/unread order updates, review status, internal messages |
| Support tickets | create/history/detail; messages stored but no actual email/SMS |

## Small Living interactive pages

- Room Profile wizard: units, width/depth/height, door clearance, rental/no-drill, budget demo, saved scenarios.
- SpaceFit results: fit/no-fit/unknown, reasons, diagram with clearance, data provenance, compare alternatives.
- Bundle Builder: pick items, variants and qty, totals, component compatibility, save plan and cart integration.
- 2D Room Planner: room boundary, drag-select-rotate, snap grid, measured dimensions, overlap warnings, undo/redo, save/load, keyboard alternative.
- 3D Room Planner: lazy loaded WebGL scene same room state, camera controls and object selection, loader/progress, recovery and 2D fallback.
- Saved Plans gallery: edit/duplicate/share via safe public token only if properly scoped; snapshot previews, delete confirm.

## Admin — groups, not one giant page

- Login/permission denied/session expired; Admin dashboard; global search; notifications/to-dos.
- Product list/edit/new/preview; variant editor; category hierarchy; attributes/facets; collection editor; asset library/license audit.
- Inventory SKU table, adjustment form, movement audit, low-stock table.
- Order list/details/status audit; cancellation/return/refund queues; simulated payment state.
- Customer directory/detail/owning-only support queues; review/Q&A moderation.
- Promotions list/editor/redemption report.
- Homepage CMS editor/preview/publish; page editor/guides/FAQ; navigation/announcement editor.
- Room template browser/editor; hotspot mapping; scene asset manager; SpaceFit policy/rule versioning.
- Analytics overview, order/product/stock/return reports, export job status.
- Staff roles/permission table, activity/audit log, app settings, sandbox demo reset (safe/local guarded).

## Page-state inventory (apply per meaningful screen)

Initial, skeleton, loaded, loading-more, no-data, no-match, validation-error, network-error, retry, unauthorized/forbidden, not-found, optimistic-submission, success, stale/midair state, offline/slow connection, compact mobile, keyboard focus, reduced-motion, no-WebGL, image not found, unauthorized hidden content. Don't add every state where impossible; explain exceptions.

## Viewport/screenshot acceptance

320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 px; `prefers-reduced-motion`; 200% zoom; light/dark if supported; one keyboard-only navigation suite; Admin tables on narrow screens; 3D on device-emulated CPU slowdown and fallback; Vietnamese content overflow and VND formatting. Screenshots are proof of render, never a substitute for functional E2E.
