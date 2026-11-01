# 05 — REAL-WORLD VISUAL RESEARCH & NON-TEMPLATED ART DIRECTION

## Mandatory sources (visit before code; report inaccessible sources)
- IKEA `https://www.ikea.com/` — small-space room stories and 'shop the room' discovery, not copy logos or banners.
- MUJI `https://www.muji.com/` — useful home organization, restraint/materials.
- Yamazaki Home `https://theyamazakihome.com/` — organizing by room/function, lifestyle product photos.
- Baymard `https://baymard.com/` — category navigation, product lists, filters, PDP/search UX.
- 21st.dev / shadcn/ui / React Bits / Motion Primitives — source components and real interactive examples.
- Selected real digital interior planners (IKEA Kreativ etc.) for usability patterns; do not clone their visual identity.

Before coding, create `docs/RESEARCH-BOARD.md`: 5+ live references with URL, real screenshot/description, exact useful pattern, issue/limitation, decision adopt/adapt/reject, licensing caveat. External screenshot is reference only; avoid shipping screenshot assets without permission.

## Creative direction constraints
Avoid SaaS/Bento generic template: giant gradient blobs, glowing AI sparks, identical rounded card grid, arbitrary icon soup, every section fade-up, random statistics/testimonials, glass gradients and giant empty hero text. Small Living should feel like **real materials and real spatial problem solving**: interior photography, plan annotations, measured dimensions, room thumbnails, before/after diagrams (not fake photos), editorial spacing, deeply usable filters.

Try three intentionally different quick art directions (not full implementations):
1. Warm contemporary functional retail (wood/textile/neutral).
2. Calm architectural magazine (grid, specimen/material labels).
3. Minimal workshop utility (functional diagrams and measurement UI).
Choose one based on user job and evidence; no automatic cream+terracotta default. Define tokens 4–6 colors with contrast check, type for Vietnamese, line-height, product photo ratio, category layout, visible CTAs and interaction density.

## User priority & layout
Above fold should show meaningful products, categories and practical room problems, not only a full-bleed carousel. Provide browse-by-room, browse-by-problem, filter by constraints, product grid, featured room scenes with real image hotspots, guides and saved solution entry. Mobile doesn't simply shrink desktop: compact search, categories drawer, sticky product action, touch filters and a 2D planner alternative.

## UX checks
- Labels are actionable Vietnamese; no vague 'Khám phá ngay' repeated 20 times.
- Recognizable interactive affordances, keyboard focus, 44px-ish comfortable hit areas, visible statuses, concise error messages.
- No invented shipping guarantees, real sales, reviews, verified products, prices; demo data clearly labeled.
- Iterate on browser screenshots at 375/768/1440 widths; compare against research board patterns before declaring design complete.
