# 06 — COMPLETE BRAND, FAVICON, TOKENS & COMPONENT LANGUAGE

## Brand
Fully remove **CellphoneS** from storefront visual/metadata/alt/banner/footer/logo where it is old branding. Inventory references before replace; do not alter DB identifiers/auth secrets blindly. Propose 3 short brand names suitable for compact-living retail; check potential online/trademark collisions preliminarily, mark commercial clearance unverified; choose working brand after design analysis. Do not adopt unverified existing brand trademark. For demo, add tasteful "Dự án mô phỏng / Demo" indicator near checkout.

## Logo, icons, metadata
Produce custom SVG wordmark, icon-only mark and light/dark variants; design for 16px legibility and app icon. Make `favicon.ico`, `app/icon.svg` or PNG, `apple-icon`, app manifest only if actually needed; OpenGraph 1200x630 preview, titles, descriptions, product category metadata, stable non-invented canonical. No other retailer's logo. Avoid premium logos/fonts without proper licensing.

## Design system
- CSS design tokens for colors (bg/surface/text/brand/accent/success/warning/error), responsive gutters, grids, radii, shadows, focus outline, surface levels and motion duration.
- Choose typeface supporting Vietnamese marks (locally licensed or `next/font`); two families at most; limit font weights; avoid decorative headings that crowd categories.
- Create primitive vocabulary Buttons, Inputs, Sheet, Dialog, Tabs, Select, FilterChip, Skeleton, Toast, ProductBadge, ProductCard, QuantityStepper, EmptyState, Chart styles. Prefer shadcn primitives, 21st source and select React Bits, then adapt into brand theme.
- Admin shares brand tokens/icons but has denser layout, fixed sidebar and business forms; storefront atmospheric and product-led. Avoid two unrelated design systems.

## Interaction/accessibility
Color contrast, visible focus, reduced-motion, keyboard support, ESC closes overlays, consistent form feedback, skeleton approximates final layout, no layout shift, no uncontrolled auto-play. Ensure product variants/gallery filter states are understood without color alone.

## Deliverables
`docs/BRAND-GUIDE.md`; favicon assets and OG image; design tokens; `docs/COMPONENT-INVENTORY.md`; screenshots light/dark if supported; no fake claims. At least 3 key screens visually reviewed before expanding UI to all routes.
