# REPOSITORY FORENSIC AUDIT & SECURITY REPORT
**Project:** Small Living 2026 (Migrating from Shop-Ecommerce)  
**Date:** 2026-11-01  
**Auditor:** Antigravity Architect & Security Specialist  
**Execution Environment:** Windows 11, Node.js v24.22.1, npm 11.19.1, Git Repository at `D:\Project\Shop-Ecommerce`

---

## 1. Executive Summary

A forensic audit of the legacy repository was conducted on 2026-11-01. The repository currently hosts `Shop-Ecommerce` (a student-era electronics shop), recently upgraded in `frontend/` to Next.js 14.2.35 with a modern HTML/CSS storefront makeover. 

However, deep forensic analysis reveals critical security vulnerabilities, structural architectural debt, an unsupported Next.js major version (Next 14.x is Unsupported as of late 2026), unvalidated client-side state assumptions, unauthenticated Admin routes, and the complete absence of committed SQL migrations and database schema constraints.

A clean, parallel rebuild targeting **Next.js 16.4.3 (Active LTS)**, **React 19.3.1**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Supabase PostgreSQL with RLS** is strongly justified and strictly required to fulfill the 155 acceptance criteria of the Small Living 2026 specification.

---

## 2. Environment & Repository Baseline

- **Repository Root:** `D:\Project\Shop-Ecommerce` (confirmed via `git rev-parse --show-toplevel`).
- **Junction Alias:** `D:\Project\frameword2\frontend` is an NTFS junction to `D:\Project\Shop-Ecommerce\frontend`.
- **Git Branch:** `main` (clean tracking to `origin/main`, with uncommitted frontend redesign work from previous session).
- **Node & npm:** Node.js `v24.22.1`, npm `11.19.1`.
- **Active Dependencies:**
  - `next`: `14.2.35` (Active LTS in late 2026 is `16.4.3`)
  - `react` / `react-dom`: `18.3.1` (Current stable is `19.3.1`)
  - `@reduxjs/toolkit`: `2.2.6`
  - `@supabase/ssr`: `0.12.7`
  - `@supabase/supabase-js`: `2.118.0`
  - `vitest`: `5.0.5`
  - `@playwright/test`: `1.64.1`

---

## 3. Dependency Security & Vulnerability Analysis (`npm audit`)

Running `npm audit --omit=dev` identified **4 vulnerabilities (1 critical, 3 high)** in production dependencies:

1. **`next` <= 16.3.0-preview.10 (CRITICAL)**:
   - **GHSA-p293-qw3h-jr36**: Unauthenticated Remote Code Execution on Windows-hosted servers.
   - **GHSA-955p-x3mx-jcvp**: Unauthenticated disclosure of internal Server Function endpoints.
   - **GHSA-m99w-x7hq-7vfj**: Denial of Service in App Router using Server Actions.
   - **GHSA-ffhc-5mcf-pf4q**: XSS in App Router applications using CSP nonces.
   - **GHSA-3g8h-86w9-wvmq**: Middleware / Proxy cache-poisoning redirects.
   - *Fix:* Requires upgrade to `next@16.4.3`.
2. **`postcss` <= 8.5.22 (HIGH)**:
   - **GHSA-6g55-p6wh-862q**: Arbitrary file read & information disclosure via attacker-controlled sourceMappingURL.
   - **GHSA-qx2v-qp2m-jg93**: XSS via unescaped `</style>` in CSS stringify output.
3. **`lodash` / `lodash-es` <= 4.17.23 (HIGH)**:
   - **GHSA-r5fr-rjxr-66jc**: Code injection via `_.template`.
   - **GHSA-f23m-r3pf-42rh**: Prototype pollution via array path bypass.

---

## 4. Architectural & Codebase Vulnerabilities Table

| ID | Finding | Location | Status | Severity | Root Cause & Security Impact | Proposed Remediation |
|---|---|---|---|---|---|---|
| **F01** | **Admin routes completely unprotected by Middleware** | `frontend/middleware.js:14` | **CONFIRMED** | **P0 (Critical)** | `middleware.js` matcher only specifies `matcher: "/info"`. Any unauthenticated user or public bot can access `/admin`, `/admin/product`, `/admin/category` directly. | Enforce server-side role verification in Middleware and App Router layout (`/admin/*`) checking user JWT claims & DB role `admin`. |
| **F02** | **Client-side Price Manipulation in Cart & Checkout** | `frontend/app/(user)/cart/page.js`, `frontend/lib/store/cartSlice.js` | **CONFIRMED** | **P0 (Critical)** | Cart prices and order line totals are calculated on the client side without authoritative server-side recalculation or database price validation. | Implement server action/RPC transaction that accepts only `{ variant_id, quantity }`, fetches authoritative unit price from database, applies active promo codes, and calculates totals in integer VND. |
| **F03** | **Next.js 14 End-of-Life & Critical Windows RCE CVE** | `frontend/package.json:18` | **CONFIRMED** | **P0 (Critical)** | Next.js 14.x is unsupported; vulnerable to Windows-hosted unauthenticated RCE (GHSA-p293-qw3h-jr36). | Upgrade framework to Next.js 16.4.3 (Active LTS) with React 19.3.1. |
| **F04** | **No SQL Migrations, RLS Policies, or Schema in Version Control** | Repository root & `frontend/` | **CONFIRMED** | **P0 (Critical)** | Zero `.sql` files or migration scripts exist in the repository. Schema exists only in remote Supabase, creating single-point-of-failure and inability to test locally or verify RLS. | Establish `supabase/migrations/` with reproducible SQL tables, foreign key constraints, indexes, RLS policies, and deterministic seed data. |
| **F05** | **Race Condition & Hydration Vulnerability in Cart State** | `frontend/lib/store/StoreProvider.js` | **CONFIRMED** | **P1 (High)** | LocalStorage reading in client-side Redux can cause hydration mismatches between SSR and client initial render if not guarded by mounted checks. | Implement a streamlined, type-safe Cart context with client-side synchronization and zero hydration mismatches. |
| **F06** | **Synchronous `cookies()` in Next.js Server Client** | `frontend/lib/supabase/server.js:5` | **CONFIRMED** | **P1 (High)** | `const cookieStore = cookies()` is synchronous, which breaks under Next.js 15 & 16 where `cookies()` returns a Promise (`await cookies()`). | Update Supabase SSR helper to `await cookies()` and adhere to Next.js 16 App Router standards. |
| **F07** | **Legacy Electronics Catalog vs Small Living Domain Mismatch** | `frontend/app/(user)/...` | **CONFIRMED** | **P1 (High)** | Current pages and product data are tailored to mobile phones/laptops (NexusTech/CellphoneS legacy), not compact home organization, furniture, or space planning. | Rebuild catalog taxonomy around Small Living: room types, spatial problems, dimensions (mm), no-drill mounting constraints, and modular bundles. |
| **F08** | **Missing Idempotency & Stock Concurrency Safeguards** | Cart & Checkout logic | **CONFIRMED** | **P0 (Critical)** | No idempotency keys or row-locking (`SELECT FOR UPDATE`) on order creation; double submissions could create duplicate orders and oversell inventory. | Implement atomic database transaction with unique idempotency key, inventory reservation, and rollback on error. |
| **F09** | **Absence of 2D/3D Space Planning Engine** | Entire codebase | **CONFIRMED** | **P1 (High)** | No canvas, geometry engine, or WebGL viewer exists for spatial fit calculation or room planning. | Implement deterministic SpaceFit engine (pure TypeScript functions) + 2D Canvas Room Planner + Three.js/Fiber 3D viewer with accessible fallback. |
| **F10** | **Mixed Form Validation Dependencies** | `frontend/package.json:17,21,23` | **CONFIRMED** | **P2 (Medium)** | Codebase has both `formik` + `yup` and `react-hook-form` installed simultaneously, creating bundle bloat and pattern inconsistency. | Standardize strictly on `react-hook-form` + `zod` for all form handling. |

---

## 5. Security & Permission Inventory

- **Public Unauthenticated Endpoints:** `/`, `/product`, `/product-detail/[id]`, `/search`, `/about`, `/contact`, `/login`, `/register`.
- **Protected Customer Routes:** `/cart/checkout`, `/account`, `/account/orders`, `/account/rooms`, `/account/solutions`.
- **Protected Backoffice Admin Routes:** `/admin/*` (Dashboard, Products, Variants, Categories, Inventory, Orders, CMS, Moderation, Audit Logs).
- **Enforcement Strategy:**
  1. Next.js Middleware with JWT validation.
  2. Server Component session verification before render.
  3. Server Actions / API route authorization checks.
  4. Database PostgreSQL Row Level Security (RLS) as defense-in-depth.

