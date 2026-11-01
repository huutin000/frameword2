# 07 — SMALL LIVING TAXONOMY, DEMO PRODUCT DATA & FREE ASSETS

## Information architecture (domain-specific, not technology shop)
Top-level discoverability groups:
1. Theo phòng: Phòng trọ / Phòng ngủ / Góc làm việc / Nhà bếp / Phòng tắm / Giặt phơi / Ban công.
2. Theo vấn đề: Thiếu chỗ chứa / Không khoan tường / Phòng hẹp / Dễ chuyển nhà / Tận dụng góc chết / Dây cáp & góc làm việc / Gấp gọn.
3. Theo sản phẩm: Kệ, tủ mini, hộp lưu trữ, móc/giá treo, bàn gấp, giá góc, organizers, phụ kiện chống ẩm, dụng cụ giặt phơi.
Avoid claims about safety/load capacity unless verified; especially suction-mounted holders are not suitable for fall-prevention loads.

## Seed quality
Aim 40–60 high-quality demo products across groups; later expand if photos and metadata available. Each: stable ID, slug, localized title, category, use cases, room/problem tags, type/material/color, height/width/depth in mm and measurement confidence, weight when known, attach/no-drill constraint, price DEMO, cost not needed, variants/SKUs, stock DEMO, description/specs, image references & provenance; only mark `published` when complete.

For room tests include examples across fit boundaries: 600mm shelf, 900mm desk, 1200mm shelving, a foldable item with unfolded dimensions, products missing dimensions marked unknown. Some products allow 90-degree rotation, other products constrain orientation. Real-world claims absent -> label illustrative spec rather than representing an actual named manufacturer's model. No made-up star ratings, fake purchasers or reviews.

## Image sourcing rules
- Preferred: existing authorized images, **Unsplash/Pexels** for authentic small-living interiors (lifestyle), manufacturer image only with clear use permission; no unauthorized scraping/hotlinking.
- No AI-generated imagery. Product thumbnails should show the correct type/model; lifestyle scene can be labeled editorial if not exact SKU. Don't imply the pictured photo is the exact mock item if not.
- If no suitable photo, design a neutral honest SVG/product placeholder (not an AI image) with accessible alt; do not produce misleading photoreal fake catalog.
- Keep `assets-manifest.csv` fields `asset_path, source_url, author, license, downloaded_at, purpose, mapped_product_id, photo_type, attribution, notes`.
- Reduce image weight using modern format/responsive `next/image` where legal; no massive hero originals. Use local downloaded files where allowed rather than brittle third-party hotlinks.

## 3D model sourcing
- Primary: **Poly Haven CC0** furniture, room props, textures, HDRI: https://polyhaven.com/license .
- Verify dimensions/scale and orientation; convert to optimized GLB/GLTF if needed, preserve texture-license metadata, keep `model-manifest.csv` with source/model ID/size/units/license/poly-count/LCP impact.
- Sketchfab or other sites only after verifying per-asset license; avoid paid asset, trademarked furniture models, generic 'free download' without rights. For products without an exact model, choose **simple clearly labeled schematic geometry** (not a deceptive exact replica).
- Provide WebGL missing/slow fallback to 2D planner.

## Admin integration
Admin CRUD for products/categories/collections/uploads and room attributes; changes reflected on User; seed data generated through migrations/seed utilities. Avoid duplicate hardcoded catalog in components.
