# 02 — STACK & DEPENDENCY MODERNIZATION 2026

## Cơ sở hiện tại (phải xác minh bằng repo)
Báo cáo cũ: Next.js 14.2.4, React18, Redux Toolkit2, Supabase JS/SSR các bản từ 2024, Bootstrap5/CSS, Formik+Yup và React Hook Form, Vitest/Playwright từng được bổ sung; Node có thể là 24.x. Không coi đây là phiên bản thật cho đến khi đọc package.json/lockfile và `npm ls`.

## Preferred architecture for a NEW implementation (provisional)
| Layer | First choice | Condition / alternative |
|---|---|---|
| Framework | Next.js 16 stable (not canary), App Router | Verify npm stable/release changelog/security |
| Runtime | Node 22/24 LTS meeting Next requirement >=20.9 | pin `.nvmrc` / engines, honor Windows Git Bash |
| Language | TypeScript strict where practical | staged migration for reusable JS if useful |
| CSS | Tailwind v4 + CSS variables + selective CSS modules | choose after component/library evaluation |
| UI | shadcn/ui + Radix or Base UI primitives | install only needed components; avoid conflicting component kits |
| Icons | lucide-react or a single consistent family | no mixing icon fonts and libraries |
| Forms | react-hook-form + zod/resolvers if beneficial | one form stack, not Formik and RHF together |
| Data | Supabase JS, `@supabase/ssr`, Postgres | correct browser/server split and cookies |
| Validation | Zod or one equivalent solution | authoritative server validation and DB constraints |
| State | Context/local state for local UI; persistence strategy for cart | Redux only if needed, avoid global SSR singleton |
| Motion | `motion` | CSS transitions first for simple interactions |
| 3D | three + @react-three/fiber@9 (React19) + drei | lazy, client-only, opt-in per scene |
| Testing | Vitest + RTL for units; Playwright E2E; pgTAP/RLS tests | test actual production modules |
| Tooling | ESLint CLI (or Biome), TypeScript, prettier if desired | Next16 removed `next lint` |

## Version rules
- **As-of 2026-11-01**: official releases surfaced Next.js stable v16.4.3 on 2026-10-23; React docs latest major 19.3. Agent MUST recheck before install, not hardcode these into dependency constraints blindly.
- Use `npm view <package> version`, `npm view <package> peerDependencies --json`, release/advisory docs, `npm outdated`, npm audit; pin tested versions in lockfile (do not introduce canary/RC by default).
- Upgrade in isolated branch, create compatibility matrix Next↔React↔Tailwind/shadcn↔Supabase↔R3F↔ESLint↔Node. Never blindly run `npm audit fix --force` or overwrite user's dependencies.
- Next 16 breaking: async `cookies()/headers()/params/searchParams`, `middleware`→`proxy` where applicable, Turbopack default, custom webpack issues, `next lint` removed, client/server boundaries and RSC caching changes. Consult `https://nextjs.org/docs/app/guides/upgrading/version-16` and version 15 guide as appropriate.
- Tailwind v4 Next setup from official docs: `tailwindcss`, `@tailwindcss/postcss`, `postcss`; CSS `@import "tailwindcss";`. Do not keep conflicting legacy Bootstrap resets/global scripts once migration verified.
- On a rebuild, prefer clean TS and shadcn primitives; migrate legacy Redux/cart only if tests show it is more cost-effective than replacing. Keep data model semantics and behavior before cutover.

## Definition of Done
`node/npm/lock` coherent, no unresolved peer conflict, no known exploitable relevant advisories ignored, typecheck/lint/build/test/E2E pass, major upgrade impact documented, no secrets in git, no unexpected bundle bloat. Include `TECH-DECISIONS.md` explaining where Tailwind was chosen instead of Bootstrap and what was removed only after parity tests.
