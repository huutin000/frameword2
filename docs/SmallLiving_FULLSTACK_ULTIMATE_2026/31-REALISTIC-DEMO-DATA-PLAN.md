# 31 — DEMO DATA: RICH, DETERMINISTIC, LEGAL, NON-DECEPTIVE

## Philosophy

Data must be **fictional in claims/transactions, functional in schema and UI**, not fake hardcoded components disconnected from backend. User isn't buying products/images. Product asset matching must be truthful: generic room lifestyle image may illustrate a room collection, not misrepresent SKU.

## Target seed breadth

- 8–12 top-level categories, 25–40 subcategories/tags across rooms, problems, material, install style.
- Start 50–80 carefully described demo products (or fewer if asset licensing is limiting), with 1–4 variants where meaningful. Do not inflate to 200 products by duplicating the same photo/model under different SKUs.
- At least 12 curated collections, 6 room templates, 6 editorial guides, 8 FAQ, 5 hero/card blocks, 4 meaningful promotions, 2 wishlist sets, 3 saved plans, 5 product Q&A/reviews DEMO in moderation, 20+ orders across statuses, 5 support tickets, 50 stock movements, 10 audit events.
- Synthetic profiles, masked/sealed details, fake residential addresses clearly not real residences; use local sandbox credentials not hardcoded deploy docs.

## Category sample structure

1. `Nhà thuê không khoan`: removable shelves, non-damaging hooks, door organizers (with surface constraints).
2. `Lưu trữ thông minh`: under-bed, vertical, foldable boxes, modular baskets.
3. `Bếp nhỏ`: stackable shelves, dish racks, cabinet organizers, foldable prep pieces.
4. `Phòng ngủ`: bedside compact storage, hangers, bedside organizers.
5. `Nhà tắm`: compact organizers and non-drill alternatives with safety limits.
6. `Góc làm việc`: cable organization, compact accessories, stackable desk storage.
7. `Giặt phơi`: foldable drying accessories, clamps, clothes organizers.
8. `Lối vào`: shoe/umbrella organizers, wall-free accessories.
9. `Ban công`: compact planting and storage, only safe weight claims.
10. `Bộ giải pháp`: preselected curated combos for 12m² room/2.5m² kitchen, etc.

## Product fields must allow functional SpaceFit

- `dimensions_mm {width, depth, height}`, `clearance_mm`, `assembly_required`, `mount_type`, `max_load_kg` only if verified; `folded_dimensions_mm` optional, `room_tags`, `problem_tags`, `renter_safe` with evidence/known limitations, material/color and variant-specific mapping.
- Price DEMO in integer VND, stock DEMO, availability, weight, installation needs, product hero/image gallery, 3D asset mapping where licensed.
- Explicit `unknown/unspecified` instead of inventing dimensions of a real model. For pure synthetic SKU, state synthetic dimensions and do not falsely claim manufacturer specs.

## Asset sourcing

**Free permitted:** Unsplash (lifestyle), Pexels (lifestyle), Poly Haven CC0 (textures/3D/furniture), repository originals with reviewed rights. Additional manufacturer images only if license permits use, not merely publicly viewable.

Manifest required: `local_path`, `source_page`, `direct_url`, `creator`, `license`, `download_date`, `role(hero/lifestyle/product/3d)`, `is_exact_product`, `sku_or_room`, `alt_text`, `file_size`, `hash`, `review_status`.

- Prioritize a small set of **accurate high-resolution images** over many broken/irrelevant URLs. No stolen banners from IKEA, CellphoneS, Amazon or generic Google image results. Don't use photos as logo/trademark.
- If exact product photo unavailable, render neutral labeled illustration/schematic or use honest non-SKU lifestyle visual with a caption `Ảnh minh họa`.
- WebGL furniture models: Poly Haven CC0 if appropriate, convert/compress to optimized GLB for web, record axis/orientation/scale in mm and provenance. Don't claim specific model match if different.
- Don't download huge 4K textures unless needed; responsive image variants and lazy loading.

## Seed reproducibility

- Unique stable IDs, predictable timestamps (unless tests intentionally require current-time cases), seeded random generator; re-running fixture doesn't duplicate records, SKU collisions are detected.
- Fixtures for impossible/invalid conditions: missing image, out-of-stock, invalid variant, 0 promo usage, expired promo, 404 product, unknown dimension, 3D model missing, customer cross-ownership.
- Order history data must be consistent with inventory movement and demo payments; dashboard calculations must match fixture totals.

## Proof and docs

Generate `docs/DEMO-DATA.md` with exact seed command, dataset summary, data-source/asset register, demo disclaimer, handling of accounts/credentials, and SQL/Playwright tests that assertions match seeded numbers.
