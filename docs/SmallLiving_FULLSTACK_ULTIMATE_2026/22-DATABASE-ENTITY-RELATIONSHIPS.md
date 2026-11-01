# 22 — DATABASE MODEL, RLS, MIGRATIONS & BUSINESS INVARIANTS

## Principles

Supabase PostgreSQL as primary source of truth. Use Supabase Auth IDs, `@supabase/ssr` where appropriate; client cannot set privileged fields. **Prefer SQL migrations + generated TypeScript types** over two competing ORMs. Multi-tenant marketplace is OUT OF SCOPE. Schema below is conceptual; Agent must compare with legacy DB and produce real migrations/test fixtures, not blindly copy table names.

## Proposed entities (consolidate where appropriate)

| Domain | Entities | Critical fields / invariants |
|---|---|---|
| Auth & permissions | `profiles`, `roles`, `user_roles` or secure single role | profiles.id=auth user, privileges immutable by customer |
| Catalog | `categories`, `products`, `product_variants`, `product_attributes`, `variant_attributes`, `product_media` | unique slugs/SKUs, fk indexes, status draft/published/archived |
| Merchandising | `collections`, `collection_products`, `homepage_blocks`, `navigation_items`, `guides`, `faq_entries` | display order, publish status/schedules; no preview leakage |
| Media & license | `assets`, `asset_uses` | source_url, author, license, alt, hash, dimensions, stored path |
| Commerce | `carts`, `cart_items`, `orders`, `order_lines`, `order_events` | user ownership, order_line snapshot, server-only totals |
| Inventory | `stock_levels`, `stock_movements`, optionally `reservations` | available>=0 where applicable; movements uniquely associated to events |
| Payments demo | `demo_payments`, `demo_refunds` | amount and order matches; simulated only, idempotency |
| Promotion | `promotions`, `coupon_codes`, `coupon_redemptions` | validity, eligibility, usage max; atomic redeem once |
| Customer | `addresses`, `wishlists`, `wishlist_items`, `reviews`, `questions`, `notifications`, `support_tickets` | owner IDs, escaped user-generated content, role moderation |
| Space planning | `room_profiles`, `saved_solutions`, `solution_items`, `room_scenes`, `scene_objects`, `room_templates` | dimensions mm, ordered positions/rotation, owner, product/variant references |
| Admin operations | `audit_logs`, `settings`, `feature_flags` | server-only writes, actor, target, event, safe metadata |

## Database constraints & data types

- IDs are UUID or other robust IDs; timestamps with timezone; `created_at`, `updated_at`, `deleted_at/archived_at` only where needed.
- Money in integer VND, never float; count integer, positive item quantity; dimensions mm and rotations degrees/radians consistently documented. Limits sensible (e.g. room dimension >0, not astronomical).
- Unique SKU, promotion code normalized, slug per scope, idempotency key scoped to user/action with TTL or reliable unique constraint; no duplicate stock movement for one order event.
- Referential constraints with deliberate ON DELETE actions; archive historical product instead of cascading delete order snapshots.
- Index owner_id, slug, order status/time, publish state, category join, SKU, full-text fields as demonstrated by query plans; don't add indexes blindly.
- For auth and critical mutations, prefer functions/transactions with limited privileges; audit SECURITY DEFINER use with fixed `search_path` and careful grants.

## RLS policy matrix (minimum)

- Public visitors: SELECT on `published` products/categories/collections/guides and safe public asset metadata only.
- Customers: own `profile/addresses/cart/orders/wishlist/reviews/rooms/solutions/notifications`; no access other owners. Order creation via authorized server transaction, not raw client INSERT controlling totals.
- Staff: limited order and inventory operations only via server API/RPC with role verification.
- Catalog editor: edit scoped catalog and CMS; cannot read private customer addresses.
- Admin: authorized writes server-side, not based on untrusted UI state or client-provided role.
- All tables storing private or security-sensitive data require RLS or strict server-only access; document any public tables intentionally open.
- Storage: public catalog media signed/license checked; private exports/receipts stored in private bucket and authorized signed access.

## Migration safety and repeatability

- Introduce forward-only reviewed migrations to isolated local DB first, choose down/rollback strategy for destructive schema changes.
- Seed deterministic fixture IDs or stable upserts, never mix seed with production customer records; assign clear `is_demo` flags when meaningful.
- Separate SQL migrations, seeds, auth fixture setup, storage fixtures; validate order of operations and type generation.
- `npx supabase db reset` only for LOCAL DB with verified context, never `--linked` or remote project; log endpoint before reset. Migrations against sandbox remote still require explicit approval when destructive.
- Test schema using fresh DB: apply migrations→seed→run RLS/order/stock integration→reset local→apply again to verify idempotency.
- Backups: before legacy migration/export, secure local copy, checksum, restoration test; don't check secrets into git.

## Bounded commerce transactions

- **Create order**: verify auth, parse inputs, reselect published variants, validate stock/pricing/promo/address, calculate totals, atomic insert order+lines+events+stock effects+coupon redemption, persist result by idempotency key; rollback all if any failure.
- **Update status**: allowed transition for actor, optimistic concurrency/version or row locking; event log, stock side-effect once.
- **Cancel/return/refund demo**: reversible state transition with refund record, stock restore policy exactly once.
- **Publish product**: ensure valid variant, media provenance, categories; mark public visibility and invalidate appropriate cache.
- **Save room scene**: validate ownership, dimensions, max objects, coordinates bounds (or explicit overhang handling), asset IDs, versioning/conflict state; roundtrip 2D/3D.

## Local fixtures

At least: 1 admin, 1 staff, 2 customers, 2 disabled/suspended accounts for negatives; 8 categories, 3–5 subcategories where meaningful, ~50–80 well-described products when assets available, variants, promos (valid/expired/restricted), inventory normal/low/zero, 20+ orders with mixed statuses, several room plans, bundles, CMS blocks, moderation queue, audit events. Seed only demo personas and synthetic PII; no real addresses.

## SQL evidence

Agent produces tables/entity diagram, migration diff, RLS inventory table, permission negative tests, query plans where optimized, DB transaction assertions and schema type generation logs. Do not call schema "done" from the existence of `.sql` files alone.
