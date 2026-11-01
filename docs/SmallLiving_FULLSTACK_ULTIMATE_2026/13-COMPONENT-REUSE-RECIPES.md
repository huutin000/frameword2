# 13 — COMPONENT DISCOVERY, ADOPTION & ADAPTATION PLAYBOOK

## Rule: every component starts with a research query
Query stack in order: (1) already in repo, (2) shadcn/ui primitive/registry via MCP, (3) 21st.dev search, (4) React Bits/Motion Primitives for movement, (5) custom implementation **only when these don't fit**. Record reasons. Agent should not invent a whole Card/Sheet/Tooltip/Tabs from scratch when robust accessible sources exist.

## Suggested component queries for Small Living
- `responsive ecommerce header with searchable navigation`, `category mega menu`, `editorial product grid`.
- `filter sidebar multi select`, `mobile filter drawer`, `price slider`, `sort dropdown`.
- `product image gallery thumbnail zoom`, `product variant picker`, `quantity selector`, `wishlist action`.
- `shopping cart drawer`, `checkout steps`, `order status timeline`.
- `admin inventory data table`, `product editor form`, `dashboard KPI compact cards`, `rich select`, `date range`.
- `image hotspot overlays`, `before-after compare slider` only when legitimate 2 images exist.
- `camera orbit controls`, `drag object 3d`, `model viewer` via R3F docs/examples rather than decorative 3D card templates.

## Source match matrix
| Needed UI | Prefer | Avoid |
|---|---|---|
| Admin dialogs/sheets/forms | shadcn/ui primitives (a11y) | custom inaccessible dialogs |
| Shop ProductCard/layout | existing reusable component then 21st source with modification | random generic SaaS tiles |
| Gallery/filter/mega menu | 21st or accessible shadcn primitives | unreviewed demo copy-paste |
| Micro-interaction | CSS → Motion → selective React Bits | 3 simultaneous motion engines |
| Room planner | Drei/R3F and canonical scene data | decorative Spline export with no data model |
| Photo/media | licensed real asset | AI imagery, copyrighted retailer banners |

## Intake procedure (mandatory for every copied external component)
1. Inspect official docs and source, credit/license/pricing, open-code provenance.
2. Check peer dependency, React19/Next16 compatibility, RSC SSR/client-only usage, external scripts, network calls, and 3D runtime.
3. Check responsive a11y keyboard, reduced-motion, focus and public fallback.
4. Install **one** component only, test in isolation, adapt visual tokens/materials/photo/spacing/typography; remove unused demo dependencies/animations.
5. Track source under `docs/COMPONENT-SOURCES.md` with URL/date/license/decision/modified file and status. Do not add a dependency that duplicates current primitives for one 20-line effect.
6. `npm run lint`, typecheck, build, Playwright screenshot; if poor result, reject it and try next candidate.

## Avoid paywall/fragile patterns
21st browsing is free but Builder code retrieval/MCP install may require a paid plan; Motion+ premium code is not free; Spline web exports may be watermarked/plan-dependent. Prefer local source from maintained open components; don't infer premium rights from a public preview. Do not run `curl | bash` or arbitrary install scripts without inspection/approval. No API key in `.mcp.json` committed to Git; use agent secret setting/env.
