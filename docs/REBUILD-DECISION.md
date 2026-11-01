# ARCHITECTURAL DECISION RECORD: REBUILD VS REFACTOR
**Project:** Small Living 2026  
**Document ID:** ADR-001-REBUILD-DECISION  
**Date:** 2026-11-01  
**Status:** APPROVED (Proceeding with Parallel Clean Rebuild)

---

## 1. Context & Problem Statement

The goal is to transform `Shop-Ecommerce` (a student e-commerce project originally built for mobile phones and laptops in 2024) into **Small Living 2026** — a full-stack, enterprise-grade e-commerce and interactive space planning platform.

The target system must satisfy **155 discrete acceptance criteria** (across User Storefront, Backoffice Admin, Supabase RLS Database, SpaceFit rules engine, 2D Canvas Planner, and 3D WebGL Room Planner).

The current legacy codebase in `frontend/` exhibits:
1. **Unsupported Next.js 14.2.35** with critical CVEs (including Windows-hosted unauthenticated RCE GHSA-p293-qw3h-jr36).
2. **React 18** which conflicts with modern Three.js / React Three Fiber v9 (requires React 19).
3. **Legacy Redux Toolkit + localStorage hydration patterns** with client-side price computation.
4. **No committed database migrations or schema files** in the repository.
5. **Electronics product domain** rather than compact-living, home organization, and space planning.

---

## 2. Options Evaluation & Decision Matrix

| Evaluation Criteria (Weight 1-5) | Option 1: Incremental In-Place Refactor | Option 2: Hybrid Migration | Option 3: Parallel Clean Rebuild (CHOSEN) |
|---|---|---|---|
| **Security & Vulnerability Remediation (5)** | 2/5 (High risk of breaking legacy during in-place Next 16 upgrade) | 3/5 (Solves frontend, leaves database vulnerabilities) | **5/5 (Clean Next 16 LTS + strict CSP + audited deps)** |
| **Preservation of Existing Work / Rollback (5)** | 2/5 (Directly modifies user files; difficult rollback) | 3/5 (Partially preserves backend, risky frontend diffs) | **5/5 (Legacy `frontend/` remains 100% untouched; instant rollback)** |
| **Domain Transformation (Electronics → Small Living) (4)** | 2/5 (Overwriting product routes and Redux slices creates legacy debt) | 3/5 (Adapting old schemas to dimensioned furniture is awkward) | **5/5 (Built-for-purpose models: mm dimensions, room profiles, SpaceFit)** |
| **Type Safety & Maintainability (4)** | 2/5 (Mixed JavaScript, Yup + Formik + RHF) | 3/5 (Partial TypeScript conversion) | **5/5 (Full TypeScript strict, Zod validation, generated Supabase types)** |
| **3D & Interactive Space Planning Readiness (4)** | 2/5 (React 18 peer dependency conflicts with R3F v9) | 3/5 (Complex dynamic imports over legacy CSS) | **5/5 (Native React 19 + Three.js + R3F v9 with client-only boundaries)** |
| **Developer Velocity & Clean Tooling (3)** | 2/5 (Turbopack conflicts with legacy configs) | 3/5 (Lingering Bootstrap and CSS variables) | **5/5 (Tailwind CSS v4 + shadcn/ui + Vitest + Playwright)** |
| **Weighted Total Score (Out of 125)** | **53 / 125** | **74 / 125** | **122 / 125 (WINNER)** |

---

## 3. Selected Strategy: Parallel Clean Rebuild (`web/`)

We choose **Option 3: Parallel Clean Rebuild**:
1. **Zero Destructive Actions:** The existing `frontend/` directory is completely preserved. All prior work, test configurations, and assets remain intact as an immediate fallback and rollback target.
2. **Dedicated Modern Directory:** The new platform is constructed in `web/` with modern defaults (following the standard modern monorepo layout: `web/`, `docs/`, `supabase/`).
3. **Clean Next 16 LTS + React 19:** Built directly on Next.js 16.4.3 (Active LTS) and React 19.3.1, eliminating all GHSA advisories and unlocking React Three Fiber v9.
4. **Tailwind CSS v4 + shadcn/ui:** Clean, semantic styling designed specifically for the Japandi / Warm Minimalist Small Living aesthetic (Warm Stone, Oat, Muted Sage, Walnut, Deep Charcoal).
5. **Database-as-Code:** Full SQL migrations in `supabase/migrations/` including RLS policies, PostgreSQL constraints, and deterministic demo seed fixtures.

---

## 4. Target Technology Stack (2026 Modernization)

| Layer | Selected Technology | Version / Specification | Rationale |
|---|---|---|---|
| **Framework** | Next.js App Router | `16.4.3` (Active LTS) | Resolves all Next 14/15 CVEs, native async headers/cookies, Turbopack default |
| **Runtime & Language** | Node.js + TypeScript | Node `v24.22.1`, TS `5.7+` strict | Full end-to-end type safety, catches bugs at compile time |
| **Styling & Design System** | Tailwind CSS v4 + shadcn/ui | `@tailwindcss/postcss` v4 + Lucide icons | Zero CSS bloat, clean design tokens, accessible Radix primitives |
| **State Management** | React Context + URL State | Native React 19 + Nuqs / URL search params | URL-driven filters/search, lightweight cart context without SSR hydration mismatch |
| **Forms & Validation** | React Hook Form + Zod | `react-hook-form` v7.91 + `zod` v3.24 | Single standard form stack, isomorphic client/server schema validation |
| **Backend & Database** | Supabase Postgres + Auth + RLS | `@supabase/ssr` v0.12+ (Async cookies) | Reliable Postgres source of truth, row-level security, immutable order events |
| **Spatial Engine (2D/3D)** | HTML5 Canvas + Three.js + R3F v9 | `three` + `@react-three/fiber@9` + `@react-three/drei` | Scaled 2D planner with collision + lazy-loaded 3D WebGL viewer with 2D fallback |
| **Testing & QA** | Vitest + Playwright E2E | `vitest` v5 + `@playwright/test` v1.64 | Targeted unit tests for SpaceFit + end-to-end browser user/admin flows |

---

## 5. Rollback & Safety Protocol

1. **Safety Guarantee:** No files in `frontend/` will be deleted, renamed, or overridden.
2. **Git Hygiene:** No `git clean -fd`, no `git reset --hard`, and no unconfirmed `git commit` or `git push`.
3. **Database Isolation:** All new migrations are written as standalone SQL files and tested against local/isolated Supabase; remote production tables will never be altered without explicit instruction.
4. **Emergency Rollback:** If any issue arises, switching back to legacy frontend is as simple as running commands in `frontend/`.

