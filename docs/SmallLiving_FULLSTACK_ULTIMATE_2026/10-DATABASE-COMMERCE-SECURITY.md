# 10 — DATABASE, BUSINESS RULES, AUTHORIZATION & DEMO COMMERCE

## Source-of-truth schema (adjust after audit)
- Identity `profiles` with role safely granted; **never** let user freely edit admin role.
- Catalog: `categories`, `collections`, `products`, `product_variants`, `product_media`, `product_room_tags`, optional attribute tables.
- Inventory: `inventory_balances` and `inventory_movements` (or equivalent transactional model), with stock constraints.
- Cart/session: client cart for guests, optional durable `carts/cart_items` for user; define merge behavior explicitly.
- Promotions: `promotion_codes`, `redemptions` with validity and limits.
- Orders: `orders`, `order_items` (immutable price/title/variant snapshot), `order_events`, `order_addresses` with demo-only personal data.
- Small Living: `room_profiles`, `saved_solutions`, `solution_items`, `room_scenes`, `scene_objects` (coords/rotation/scale model refs), `published_room_templates`.
- CMS: `hero_blocks`, `lookbooks` and `hotspots` where needed; `asset_registry` for rights.
- Admin audit: `admin_activity` fields actor/action/entity/time with safe details.

Create only the minimal normalized tables needed for first functional slice; use migrations/seed not hand-click-only Dashboard. Optimize indexes for search, filters, FK, RLS scope; avoid ORM and repository layer redundancy if Supabase query patterns are simpler.

## Core workflow and invariants
- Client sends **IDs, variants, quantities, demo shipping choice, promo**; server reads authoritative prices/stock/promo and computes totals with consistent integer monetary units (VND), not floating-point display as source of truth.
- Use transaction/RPC with locking/constraint for `create_demo_order`, idempotency key for repeat submissions; create order snapshot and stock movement together, rollback on error. Do not mark a payment successful via client state alone.
- Status machine defines allowed transitions `draft→placed→processing→completed` / cancellation paths, demo-paid status separate from completed where needed; cancel restocks once only.
- Change product price later must not mutate historical order snapshots; invalid promo/low stock returns actionable server error.
- Data validation: length bounds, stock >=0, quantity upper bound, role, ownership, SVG/media upload restrictions, file type/size, no arbitrary upload execution.

## Supabase Auth/RLS
- Create separate browser and server Supabase clients with current `@supabase/ssr` cookies patterns; never put service/secret key in `NEXT_PUBLIC_*`.
- RLS enabled for exposed tables; grants and policies per select/insert/update/delete, ownership per user, admin role verified securely by DB/server, public only published records. Audit storage bucket policies (not only database tables).
- Add negative tests in `supabase/tests/`: anonymous/customer/admin matrix for product write, order read, saved room ownership, order transitions. Run `supabase test db` if local stack available.
- RLS is defense in depth; check all Server Actions and route handlers explicitly. No privilege escalation via client input.

## Safe local dev
- Prefer Supabase CLI project local with Docker and migrations/seed. On Windows 16GB RAM, if service memory makes QA unstable, use a **dedicated throwaway hosted Supabase sandbox** with explicit confirmation; never default to production/legacy remote.
- `supabase db reset` destroys the local DB; never run `supabase db reset --linked` or push remote migrations without explicit owner approval.
- Seed can create customer/admin test identities safely via dev scripts or documented manual bootstrap (no hardcoded committed passwords); avoid real email/SMS.

## Verification
Tests must prove concurrent order attempts don't oversell, repeat idempotency key doesn't duplicate, direct unauthorized API denied, user A cannot read B, all generated seeds reproducible, price manipulation rejected, clean rollback and transaction updates Admin/User.
