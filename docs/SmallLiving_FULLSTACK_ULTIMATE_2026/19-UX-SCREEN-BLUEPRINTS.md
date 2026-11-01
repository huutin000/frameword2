# 19 — EXPERIENCE BLUEPRINTS: SHOP + ADMIN + 3D

These are functional wireframes; Agent must adapt visually based on genuine references. Not a mandatory card layout. No decorative 'A/B/C' labels in real UI.

## Storefront desktop 1440+
```text
[Logo] [Danh mục v] [Search for problem/product........................] [Account] [Saved] [Cart]
[By Room] [By Problem] [No-drill] [Compact workspace] [Guides] [Room Planner]
+------------------------- editorial interior hero ------------------------------+
| Life-sized space photo | shoppable spots on exact matched scene / CTA to Room |
+------------------------+----------------------+-------------------------------+
| Browse by Room         | Browse by Problem    | quick measurement tools       |
| room cards             | need-state chips     | room footprint/constraints    |
+------------------------+----------------------+-------------------------------+
| Curated solutions and product grid (authentic photography, realistic density)  |
| Helpful guidance / measurements / why-fit visuals (not fake testimonials)      |
| Real footer                                                                       |
```

## Product listing
```text
[Breadcrumb] [Category title] [result count]                         [Sort]
[Filters sidebar] | Product grid 3–4 columns; SKU images; price demo; sizes, fit state
                  | active chips / pagination / no-results / loading skeleton
```
Mobile: compact header, search overlay, horizontal room category navigation, 2-column product card when readable, Filter sheet with chips and Reset/Apply; no horizontal scroll.

## PDP
```text
[Breadcrumb]
[Gallery with thumbnails / optional 3D viewer] | title / demo price / variant / mm dims
                                            | compatibility / fit reasons / no-drill
                                            | Add cart + save + compare / shop the room
[Specifications] [Measurements and installation notes] [Related real catalog items]
```
Mobile: stacked gallery, sticky CTA only when useful, collapsible spec and optional 3D loading.

## Admin desktop
```text
[Sidebar: Overview / Catalog / Inventory / Orders / Content / Planner / Analytics]
[Top: Search / Quick action / Account]
[Breadcrumb + page title] [New/Create]
[compact KPI / filters / period selectors]
[searchable sortable data table + bulk actions when safe]
[detail drawer or editor, field validation, dirty-state and confirmation]
```
Mobile Admin: responsive narrow nav and focused tables/cards, no unreadable squeezed columns.

## Planner desktop
```text
[Room & preset selector] [Room dimensions] [No drill] [Budget DEMO]
[Product catalog by fitting constraints] | [2D / 3D switch, scene view] | [Inspector]
[Filter / thumbnails / selected variants] | [grid, walls, drag/rotate]  | [mm/rotation/fit warnings]
[Save] [Undo] [Reset view] [Add bundle to cart] [2D fallback]
```
Room Planner interactions: add object -> select -> move/rotate -> warning on collision/out-of-bounds -> save -> reload -> switch 2D/3D and preserve transform; orbit controls and keyboard numeric positioning. Mobile: tabs between scene/library/inspector with full-featured 2D alternative. No giant fullscreen loading overlay or fake 3D screenshot.

## Visual acceptance questions
Is catalog discoverable before scroll? Does a photo correspond to product type? Are categories about room problems, not generic gadgets? Can shoppers read measurements immediately? Does loading preserve layout? Is Admin faster to operate than a decorative dashboard? Can a keyboard user use planner alternatives? Does browser prove each CTA changes real demo state?
