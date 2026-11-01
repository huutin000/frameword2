# 08 — STOREFRONT: COMPLETE USER EXPERIENCE & WORKING FLOWS

## Screens and actual behavior
1. **Home `/`**: compact top navigation, prominent search, browse-by-room/problem, editorial hero, selected collections, shoppable room, dynamic category tiles, featured products derived from DB, links to Room Planner/SpaceFit. Do not make homepage an endless pile of repetitive banners.
2. **Browse `/products` + `/categories/[slug]`**: multi-select categories/room tags, width/height/depth/difficulty/no-drill/material/price DEMO filters, sorting, pagination, filter chips and result counts, mobile sheet. URL query reflects filters. Tests prove results actually change.
3. **Search**: debounce + submit, term highlight, recent searches optional and local, typo/empty states. Search DB/query index not just local 4 examples; Admin-created published product discoverable.
4. **PDP `/products/[slug]`**: image gallery/zoom, variant selector, exact item dimensions in mm/cm, constraints, availability DEMO, estimated fit in active Room Profile, 3D preview when legitimate model exists, compare/save/add to cart, relevant collection, guides and caveats. Ensure selected variant drives price/stock and fit results.
5. **Wishlist & Compare**: guest local state/user account persistence where suitable, compare 2–4 products by dimensions/material/installation constraints; don't create meaningless generic spec table.
6. **Cart**: add/remove/quantity, persistent guest state, reconcile on login if chosen; actual per-item and total demo price from canonical data, error if out of stock; no client price authority at order submission.
7. **Demo Checkout**: contact/address fake or test-safe, mock delivery method/fee rule, promo code, confirmation/review, place-order with server checks and idempotency; show unmistakable demo disclaimer. No payment processor, no email/SMS sent without approval.
8. **Orders/Account**: authenticated profile, order list/detail, lifecycle timeline demo, saved rooms, saved bundles, preferences, logout. Proper forbidden/loading/empty states; links from checkout to order detail.
9. **Room discovery**: `/rooms` landing, room scenario templates (12m² rental studio, compact kitchen etc.) with illustrative measurements, curated solutions, hotspot on authorized image or 3D board.
10. **Guides**: choosing no-drill solutions, how to measure a corner, what an uncertain fit means; CMS controlled by Admin, not generic AI-generated marketing gibberish.

## Common states
Every data-heavy page: skeleton matching final layout; delayed/empty/error, retry where feasible, permissions and stale variants. No page-level loading spinner for already-synced content. Mobile 320–430: touch targets, drawer, search overlay, two-column grid only when readable, sticky PDP actions, persistent cart affordance.

## Performance / a11y
Server-render category/content where possible; avoid shipping entire catalog to client; paginate. Use Next image sizes, responsive media with real asset rights; 3D lazy only on product/planner; all interactions keyboard usable, focus states, touch alternative to hover, respect reduced motion.

## Acceptance journeys
- Admin creates/publishes a 750mm width shelf → User search, category filter and PDP all show it with consistent title/image/price demo.
- Search `kệ góc` gives filtered results with URL state and sensible empty state; back/forward navigation preserves filters.
- Guest adds a product to cart, reload persists; logged-in checkout DEMO creates order; order visible in profile and Admin; no money actually paid.
- Product dimensions + user's Room Profile produce reasoned fit/no-fit/unknown outcome and allow navigating to planner/bundle.
