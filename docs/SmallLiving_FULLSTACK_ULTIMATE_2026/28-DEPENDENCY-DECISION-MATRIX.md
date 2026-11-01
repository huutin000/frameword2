# 28 — STACK, DEPENDENCY & REBUILD DECISION MATRIX — AS OF 01 NOV 2026

## Ground rules

Before every dependency install: inspect `package.json`, lockfile, `npm ls`, `npm outdated`, `npm audit`, OS/Node, peer deps and framework docs. Prefer patch/minor latest stable **when compatible**. Do not pin exact patch in a prompt intended to run later; record chosen exact version+source/date in `docs/DEPENDENCY-DECISIONS.md`. Do not install all suggested packages; mark ACCEPT / REJECT / DEFER with rationale and byte/runtime cost.

| Concern | Preferred candidate | Decision criterion | Avoid |
|---|---|---|---|
| App framework | Next.js 16.x stable Active LTS | support, Node/runtime, async APIs, route/proxy updates | unsupported Next14, canary by default |
| UI core | React 19 stable | fits Next + shadcn/R3F peer deps | mixed React majors |
| Language | TypeScript strict | clean rebuild reduces runtime errors | `any` everywhere |
| Styling | Tailwind v4 + CSS variables | new build compatible with shadcn and branded design | Bootstrap+Tailwind mixed globally |
| UI primitives | shadcn/ui + Radix, one icon library | accessible/composable source | heavy overlapping kits |
| UX/motion | Motion + CSS transitions; curated React Bits FREE | purposeful movement, reduced motion, perf | 4 animation frameworks/paid pro templates |
| 3D | Three.js + R3F 9 + Drei (React19) | usable planner with correct geometry | WebGL on every page; R3F alpha v10 |
| Forms | React Hook Form + Zod only if beneficial | consistent form+server validation | Formik+RHF+Yup+Zod together |
| Auth/data | Supabase Auth/SSR/PostgreSQL/Storage/RLS | one DB source of truth | bypass RLS, browser service role |
| State | React/URL/server first; optional light store | complexity assessed per feature | global Redux just for simple cart |
| Search | PostgreSQL full-text & indexed filters | catalog scale moderate, no paid search needed | Elasticsearch/external SaaS premature |
| Tables | shadcn + TanStack Table if complex | Admin bulk/filter/pagination needs | handmade table abstractions everywhere |
| Charts | Recharts or other small proven lib | accessible meaningful Admin analytics | charts with hardcoded values |
| Tests | Vitest + Playwright | cross-platform, free, code coverage | 3 duplicate E2E runners |
| Lint | ESLint CLI + TS checks | Next16 no `next lint` | running removed command |
| API | Next actions/route handlers, DB RPC for transactions | colocated modular monolith | unneeded microservices |
| Asset | next/image, Poly Haven GLB, licensed photos | provenance+performance | hotlink or copy arbitrary e-shop images |

## Upgrade-versus-rebuild

**Rebuild recommended** if excessive god files, obsolete Next14, Bootstrap conflict, auth/RLS issues, tiny test coverage, cleanup cost exceeds reimplementation and new data model Small Living radically different. **Incremental refactor recommended** if core auth, data model, functions already sound and regressions risk high. Evidence required: file dependency graph, route/functional inventory, tests, risks, milestones, rollback.

## Version-specific technical checks

- Next16: Node >=20.9, async request APIs, `proxy` migration instead of middleware where relevant, caching semantics, Turbopack choices, ESLint CLI.
- Tailwind v4: `tailwindcss @tailwindcss/postcss postcss` and `@import 'tailwindcss'`; use official shadcn current install for App Router, CSS variables and `components.json`.
- @supabase/ssr: check evolving beta API cookie handling, no manual localStorage auth token in server.
- R3F major pairs with React major; import Canvas only client and only on relevant route; Drei versions compatible.
- React Bits FREE vs Pro license, Motion AI Kit free vs Motion+ paid, 21st marketplace browsing free vs paid Builder component retrieval and paid AI generation; no hidden subscriptions or account actions without approval.

## Docs of record

https://nextjs.org/support-policy
https://nextjs.org/docs/app/guides/upgrading/version-16
https://ui.shadcn.com/docs/installation/next
https://tailwindcss.com/docs/installation/framework-guides/nextjs
https://supabase.com/docs/guides/auth/server-side
https://r3f.docs.pmnd.rs/getting-started/introduction
https://playwright.dev/docs/intro
