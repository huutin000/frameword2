# MIGRATION MAP: SHOP-ECOMMERCE → SMALL LIVING 2026
**Project:** Small Living 2026  
**Document ID:** MAP-001-MIGRATION  
**Date:** 2026-11-01  
**Status:** ACTIVE

---

## 1. Domain & Catalog Transformation

| Legacy Domain (`Shop-Ecommerce`) | New Domain (`Small Living 2026`) | Transformation Strategy |
|---|---|---|
| **Electronics & Hardware:** Smartphones, Laptops, Accessories, Audio | **Small Space Living & Organization:** Modular furniture, compact storage, no-drill organizers, foldable items | Complete replacement of demo catalog with 40–60 curated Small Living items with dimensional specs (H x W x D mm), room tags, and spatial constraints. |
| **Simple Flat Attributes:** Price, RAM, Storage, Color | **Spatial & Material Attributes:** Height/Width/Depth (mm), weight (kg), mounting requirement (No-Drill vs Wall-Mounted), material, max load capacity, 3D GLB model reference, image license | Schema designed specifically for spatial fit rules, room footprint calculations, and interior styling. |
| **Single Product Catalog:** Standard category list | **Multi-dimensional Taxonomy:**<br>1. By Room (`Phòng trọ`, `Phòng ngủ`, `Góc làm việc`, `Nhà bếp`, `Phòng tắm`, `Ban công`)<br>2. By Problem (`Thiếu chỗ chứa`, `Không khoan tường`, `Phòng hẹp`, `Góc chết`, `Dây cáp`)<br>3. By Product Type (`Kệ`, `Hộp lưu trữ`, `Bàn gấp`, `Giá treo`, `Organizers`) | Faceted discovery allowing filtering by both room constraints (e.g. Max Width 800mm, No-Drill) and product types. |

---

## 2. Route & Screen Architecture Mapping

### 2.1. User Storefront Routes

| Legacy Route | New Small Living 2026 Route | Status / Evolution |
|---|---|---|
| `app/(user)/page.js` | `src/app/(storefront)/page.tsx` | Complete redesign: Hero room story, Shop by Room & Problem, SpaceFit teaser, Shop-the-Room lookbook preview, 3D spotlight. |
| `app/(user)/product/page.js` | `src/app/(storefront)/catalog/page.tsx` | Faceted search, dimension sliders (mm), no-drill filter toggle, sorting, grid/list view, SpaceFit indicator chips. |
| `app/(user)/product-detail/[id]/page.js` | `src/app/(storefront)/products/[slug]/page.tsx` | High-res gallery, mm footprint diagram, interactive SpaceFit room checker, variant switcher, 3D model viewer modal. |
| `app/(user)/cart/page.js` | `src/app/(storefront)/cart/page.tsx` | Real-time stock reservation, authoritative server price recalculation, coupon validation, demo disclaimer. |
| `app/(user)/search/page.js` | `src/app/(storefront)/search/page.tsx` | Full-text product search with category facets, auto-suggest, and zero-result recommendations. |
| `app/(user)/login/page.js` | `src/app/(auth)/login/page.tsx` | Supabase Auth email/password, demo customer & admin one-click credentials for evaluator convenience. |
| `app/(user)/register/page.js` | `src/app/(auth)/register/page.tsx` | Supabase Auth user registration with server-validated schema. |
| `app/(user)/info/page.js` | `src/app/(storefront)/account/profile/page.tsx` | Customer profile management with saved addresses. |
| *New* | `src/app/(storefront)/account/orders/page.tsx` | Customer order history, live order timeline, simulated cancellation/return. |
| *New* | `src/app/(storefront)/account/rooms/page.tsx` | Customer saved room profiles with dimensions and no-drill preferences. |
| *New* | `src/app/(storefront)/solutions/page.tsx` | Interactive Solution & Bundle Builder with real-time total and fit validation. |
| *New* | `src/app/(storefront)/shop-the-room/page.tsx` | Editorial lookbook with interactive product hotspots linking directly to catalog SKUs. |
| *New* | `src/app/(storefront)/planner/page.tsx` | Interactive 2D Canvas & 3D WebGL Room Planner with save/load and collision detection. |
| *New* | `src/app/(storefront)/compare/page.tsx` | Product dimension, material, and spatial footprint comparison table. |
| *New* | `src/app/(storefront)/wishlist/page.tsx` | User wishlist with persistent Supabase storage. |

### 2.2. Backoffice Admin Routes

| Legacy Route | New Small Living 2026 Route | Status / Evolution |
|---|---|---|
| `app/admin/page.js` | `src/app/admin/dashboard/page.tsx` | Real-time KPIs derived directly from database orders, low-stock warnings, recent order timeline. |
| `app/admin/product/page.js` | `src/app/admin/catalog/products/page.tsx` | Searchable, filterable product table with multi-variant management, publish toggle, and stock overview. |
| `app/admin/product/add/page.js` | `src/app/admin/catalog/products/new/page.tsx` | Comprehensive product form: title, slug, dimensions (H x W x D mm), no-drill flag, variants, 3D model ref, license metadata. |
| `app/admin/product/update/[id]/page.js` | `src/app/admin/catalog/products/[id]/edit/page.tsx` | Edit product, variants, SKUs, inventory adjustments, and media. |
| `app/admin/category/page.js` | `src/app/admin/catalog/categories/page.tsx` | Room and Problem taxonomy manager with cycle detection. |
| *New* | `src/app/admin/inventory/page.tsx` | Stock ledger with immutable inventory movements (`restock`, `order_placed`, `order_cancelled`). |
| *New* | `src/app/admin/orders/page.tsx` | Order lifecycle manager (`draft`, `placed`, `processing`, `shipped`, `delivered`, `cancelled`). |
| *New* | `src/app/admin/promotions/page.tsx` | Coupon code creator with date windows, min order amount, and max usage limits. |
| *New* | `src/app/admin/cms/page.tsx` | Visual editor for Homepage Hero, Editorial Lookbooks, and Room Hotspots. |
| *New* | `src/app/admin/room-templates/page.tsx` | Curated room layouts published by admin for users to clone into planner. |
| *New* | `src/app/admin/moderation/page.tsx` | Customer review and Q&A approval queue with XSS-sanitized display. |
| *New* | `src/app/admin/audit-logs/page.tsx` | Immutable activity ledger recording admin actions, actors, targets, and timestamps. |

---

## 3. State Management & Data Flow Migration

| Feature | Legacy Approach | 2026 Small Living Approach |
|---|---|---|
| **Cart Storage** | Redux Toolkit slice + raw `localStorage` write on every action | Lightweight React 19 `CartProvider` + validated localStorage sync with SSR hydration guard. |
| **Price Calculation** | Calculated on client side inside Redux reducer | Client computes tentative subtotal; server transaction authoritatively verifies DB prices and promo codes upon checkout. |
| **Authentication** | Direct Supabase browser client + unverified cookies | `@supabase/ssr` with async cookies in Server Components, Middleware protection on `/admin/*` and `/account/*`. |
| **Catalog Fetching** | Client-side `fetch` in `useEffect` or un-cached RSC | Server Components with clean caching, ISR revalidation, and Supabase TypeScript type safety. |
| **Spatial Planner State** | None | Canonical scene data model (`RoomScene`: dimensions, objects with `x_mm`, `z_mm`, `rotation_deg`, `variant_id`) shared seamlessly between 2D Canvas and 3D WebGL. |

