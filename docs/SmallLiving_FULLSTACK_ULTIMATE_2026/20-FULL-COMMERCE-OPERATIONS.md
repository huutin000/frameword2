# 20 — COMMERCE ENGINE: COMPLETE TRANSACTIONAL DEMO FLOWS

## Product contract

Không làm shop chỉ với Home / Product / PDP / Cart. Khách hàng phải trải nghiệm một vòng đời mua sắm thực tế trên **đơn hàng DEMO**, còn Admin phải quan sát và xử lý đơn đó đúng quy trình. Tất cả tiền và shipping đều **giả lập nội bộ** và được đánh dấu rõ; data/validation/transactions/permissions là thật trong môi trường demo.

## Catalogue và merchandising

| Đối tượng | Bất biến cần giữ | Tác vụ User | Tác vụ Admin |
|---|---|---|---|
| Category | slug unique, hierarchy không vòng lặp, visibility | browse/cross-links | CRUD, reorder, SEO, publish |
| Product | ID/slug unique, lifecycle draft/published/archived | PDP/gallery/specs | CRUD, preview, publish/schedule |
| Variant/SKU | SKU unique, price, dimension/material/color, inventory policy | chọn variant -> đúng giá/ảnh/kích thước | edit/clone, per-variant stock |
| Collection | bộ sưu tập editorial + rule-based nếu hữu ích | landing pages, navigation | curated list/order, visibility |
| Room bundle | contains valid published SKUs, qty, fit constraints | bundle builder, total, save/cart | author room scene / featured bundles |
| Media asset | source/license/alt, metadata | image gallery | upload/manage/select/replace |

### Search & discovery logic

- URL query state: `q`, `category`, `brand` (nếu có), `room`, `problem`, `min/max price`, dimensions range (mm), material, color, no-drill, stock, sort, page.
- Full-text search language-aware where practical; validate/escape inputs, debounce input, keyboard suggestions and recent queries local, no leaking private items.
- Multi-select within same facet, count/result updates, applied chips, clear all, empty state, stable sorting including tie-break, pagination with URL semantics.
- Compare 2–4 products of same meaningful taxonomy, compare size/material/mount/install needs/price; don't mix incompatible types unless clearly explained.
- Stock status shown as Demo stock, no fake sales figures. Variants grouped under product; no duplicate cards for color variants without reason.

## Customer purchase workflow

1. Browse, filter, compare, choose SKU, inventory available.
2. Cart: add/remove/update qty, persist guest safely (browser storage only), signed-in cart merge with conflict rules, avoid overwriting saved server cart with empty initial state.
3. Price summary: gross items, discount, shipping simulation, totals in VND integer (minor units only if needed); don't trust client subtotal.
4. Promotion: server validates active window, min spend, per-user usage, per-order usage, item/category exclusions, stackability, max discount, max redemptions, cancellation behavior. Explain invalid code.
5. Checkout DEMO: address book demo, shipping method labels/prices from configured rules, order notes, payment method `DEMO_ONLY` and clear disclosure; validate cart/stock/address/price server-side, idempotency key, CSRF/auth/session handling.
6. Create order + snapshots of name/SKU/price/discount/address/ship method at purchase + status event + stock effect in a single authorized transaction, then redirect to order confirmation by owner.
7. Simulated payment state machine: `pending` -> `succeeded` or `failed`; no real payment SDK/callback; user can trigger only approved demo transitions; real payment credential forbidden.
8. Order tracking: created/confirmed/packing/shipped/delivered/cancelled/returned/return-requested; explicit allowed transitions and actor roles, timestamps + audit.
9. User cancellation/refund request within documented DEMO conditions; Admin approves/rejects; refund simulation and stock restoration policy consistent and idempotent.
10. Customer can download/view printable demo receipt with clearly marked fictional amount; no VAT invoice assertions.

## Inventory integrity

- Track stock by variant/SKU, with `on_hand`, optional `reserved`, `available`, ledger events (receive/adjust/reserve/release/fulfill/return), actor/reason/time.
- Checkout transaction must lock/check SKU availability or equivalent atomic decrement; never decrement by trusting client item count.
- Two users buying last item -> at most one succeeds. Duplicate checkout -> at most one order. Cancelling twice -> stock restore once.
- Admin bulk stock updates validate input, keep audit, support dry-run/import preview.
- If reservations with TTL increase complexity beyond scope, choose atomic stock decrement and document decision; never pretend reservations exist if not implemented.

## Pricing semantics

- Demo price is clearly noncommercial; no invented crossed-out MSRP, ratings or historical deal claims. For discounts, create internally seeded promotion campaigns with truthful DEMO badges.
- Define rounding/stacking rules explicitly; use integer VND values, never floating-point for final totals.
- Order line price and discount are immutable snapshots; revising product price doesn't alter previous orders.
- Promotion abuse tests: quantity mismatch, negative qty, altered client price, expired/restricted code, replay submit, user cross-owner.

## Customer journeys beyond cart

- Account: register/login/logout/reset password in sandbox or compatible alternative, session expiration UX, profile, addresses, saved payment method **NOT** implemented (don't store card info).
- Wishlist persist, recently viewed local with optional account sync; room profile and bundle saved under owner; compare shared via safe URL if feasible.
- Reviews/Q&A DEMO: customers submit own, moderation queue, approve/reject, escaped content, no fabricated real reviews; if using seeded data label DEMO.
- Help center: shipping/returns DEMO explanations, contact form persisted to ticket queue in DB or clearly labeled UI-only if nonpriority, support inbox Admin response stored (not actually sent).
- Notifications: in-app order status update read/unread, no SMS/mail or background tasks unless explicitly scoped and enabled.

## Edge-state contract

For every public action provide explicit: loading, disabled, permission denied, invalid input, success, network retry, empty, concurrency conflict, stale price, insufficient stock, session expiration, not-found, unexpected error, no JavaScript fallback if feasible. No blank screens or fake success toast.

## Acceptance examples

- Cart qty 3 -> Admin changes variant demo stock to 2 -> checkout blocks with actionable message and cart fix.
- User submits checkout twice with same idempotency key -> one order, one stock effect.
- Coupon restricted to one category is rejected on other category; discount uses server result.
- Admin edits product after purchase -> old order details unchanged.
- Customer A cannot access B's order or download receipt via guessed URL.
- Approved cancellation -> recorded status + restock exactly once, owner notified in-app.
