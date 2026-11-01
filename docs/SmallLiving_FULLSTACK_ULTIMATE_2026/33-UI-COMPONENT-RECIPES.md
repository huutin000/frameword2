# 33 — COMPONENT-FIRST RECIPES: AVOID AI GENERIC DESIGN

## Design process per component

1. Find a **real production pattern** from IKEA, MUJI, Yamazaki Home, accessible commerce research/Baymard, not from AI landing-page generator screenshots alone.
2. Search code in shadcn registry, 21st marketplace, curated React Bits free or Motion Primitives; capture URL and component ID, license and required dependencies.
3. Check source readability, React19/Next16/SSR, Tailwind compatibility, mobile breakpoint, focus/keyboard semantics, reduced motion, JS bytes. If not fit, choose a simpler primitive or implement small custom component with justification.
4. Apply our brand tokens/spacing/Typography/hero photography and content hierarchy, **not** drop in unmodified demo styling.
5. Real API/state integration, not placeholder onClick. Visual QA with screenshot before/after, E2E, a11y and performance.

## Recommended recipes

| Interface | Implementation direction | Meaningful movement | Verify |
|---|---|---|---|
| Header & search | compact sticky, category mega menu, combobox keyboard, mobile drawer | menu fade/slide <200ms | tab order, focus trap, screenreader, all links |
| Homepage hero | licensed interior photo, editorial typography, shop hotspot CTA | mild image reveal on load, no scroll-jack | LCP, crop mobile, alt |
| Room inspiration mosaic | product-aware scene cards with room tags | hover reveal hotspots, focus equivalent | all linked products published |
| Category grid | standardized image ratios, genuine category taxonomy | subtle card transform/opacity | correct route and items count |
| PLP/Filters | shadcn Sheet/Checkbox/Select and URL-driven facets | filter drawer open/close, layout change | multi-select and back URL |
| Product card | stable image ratio, SKU options, price DEMO, saved toggle | image swap on hover/focus, button feedback | no fake badges/reviews |
| PDP gallery | thumbnails, zoom/lightbox, dimensions overlay, option selection | crossfade slides and image zoom | keyboard escape, image match |
| Cart mini drawer | accessible sheet with persisted count/items | cart item inserted/removal animation | stale price/stock handling |
| Checkout | step indicators, field groups, inline validation, review summary | progress transitions only | idempotent submit and errors |
| Account | dashboards, order timeline, saved rooms | subtle accordion/tabs | RLS owner data |
| Admin table | shadcn+TanStack (if complex), sortable/filterable columns, row actions | avoid unnecessary motion | list state, permission, bulk |
| Admin edit | tabs, dirty-save bar, media selector, form schema | toast/saved confirmation | DB mutation, page invalidation |
| SpaceFit | diagram with exact dimensions, decisions, uncertainty | measurement reveal, compare | unit tests boundary conditions |
| Bundle Builder | draggable/reorder only if helpful, totals sticky | `layout` shared transitions | sum matches server |
| Room Planner | 2D canvas/SVG based on real coordinate system; R3F client module | smooth orbit/move, snapping, selected outline | scene roundtrip, 2D fallback |
| Loading | component-shaped skeleton, honest network pending | shimmer subdued and reduced-motion | no false delay or CLS |
| Errors/empty | problem-specific illustration/vector and actionable reset | none or gentle reveal | retry works |

## Design anti-patterns

- Remove AI clichés: ambient floating blur orbs, teal-to-purple gradients, generic SaaS hero, 3D sphere unrelated to living space, meaningless 60fps canvas on every route, dancing buttons, autoplay video that hides products.
- Avoid 12 different card variants; 1–2 intentional variants tied to business needs.
- Avoid large thin-body text, weak contrast, hidden filters, huge hero pushing products below fold, horizontal overflow.
- Avoid `AnimatePresence` everywhere; use CSS-only when possible. Reserve GPU/WebGL for planner/Product 3D where useful.
- No fake reviews/social proof; no default logo from CellphoneS or retailer-borrowed banners. Third-party image must have proof of license and display context.

## Design-system acceptance

- Brand palette and typography chosen from at least 3 genuinely reviewed references; document why.
- Typography supports Vietnamese, focus indicators visible, hover/focus/pressed/disabled/errors/loading all styled.
- Screen inventory complete, with purposeful whitespace and appropriate Admin information density.
- UX review compares rendered screenshots against references and actual content, not CSS code alone.
