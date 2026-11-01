# 25 — VIETNAMESE CONTENT, SEO, BRAND & EDITORIAL COMMERCE

## Brand identity (do not reuse CellphoneS)

- Audit trademark conflict via web search before choosing a project name; select 2–3 shortlist candidates, no claim of legal clearance.
- Design own logo mark + wordmark; consistent favicon.ico, icon SVG, apple-touch-icon, PWA icon only if legitimate manifest, OG image; vector originals rather than stock photos in logo.
- Brand tokens: color, typography with Vietnamese glyph coverage, accessible contrast, spacing, motion, imagery, container rhythm, data density for Admin.
- Remove old branding throughout UI/footer/metadata/images/alt/URLs and stale asset references, without blind replace in DB schema, commits or secrets.

## Vietnamese content rules

- Natural Vietnamese copy (dấu đầy đủ), no pseudo-English tags e.g. `Best Living Product!` repeated everywhere; English only for technical product names or brand if chosen.
- Price format `vi-VN`, `VND`, thousands separators; measurements consistently mm/cm/m, convert using exact rules, labels avoid uncertainty.
- Create 8–12 clear room-based/problem-based categories; sample names: `Bếp nhỏ`, `Phòng ngủ`, `Nhà tắm`, `Góc làm việc`, `Lối vào`, `Nhà thuê không khoan`, `Giặt phơi`, `Lưu trữ thông minh`, `Đồ gấp gọn`, `Bộ giải pháp phòng nhỏ`.
- Avoid claims of official warranty, nationwide shipping, live promotions, official brands, validated product materials without evidence. All fake prices and campaigns are marked `Dữ liệu minh họa` where it matters.
- Distinguish demo editorial photo from exact product-photo; don't imply unrelated image is actual product SKU.

## SEO architecture

- Server-render published category/product/collection content where appropriate; metadata title/description/canonical/H1 unique; sitemap only public published routes, private/account/admin/checkout routes `noindex`/exclude.
- Social metadata Open Graph and X Card (1200x630 visual where appropriate), `vi_VN`, theme color and image alt.
- Product structured data only with truthfully available DEMO fields; if mock prices could mislead real shoppers/search engines, omit price Offer schema or clearly indicate demo and avoid search indexing deployment unless desired.
- Breadcrumb structured data on meaningful public pages, no fabricated AggregateRating/Review schema.
- Search/filter routes: deliberate canonical/noindex strategy for faceted URLs to avoid infinite duplicates; server sorting/paging stable.
- Correct 404/410 for unpublished product and moved URLs; redirects only for deliberate route migrations.
- Avoid browser-only JS for core discoverability; SSR/SSG/ISR caching with safe invalidation and private data isolation.

## Content strategy

- Featured problems: `Gọn đồ mà không cần khoan`, `Mở rộng chỗ chứa trong 3m²`, `Một góc bếp dễ dùng hơn`, `Phòng thuê chuyển đi không để lại dấu`.
- Provide room setup guides, dimensions measurement guide, tips for renters, compare materials; all advice is general, not certified or legal claims.
- Admin content authoring includes draft/published, SEO fields, preview routes, related products, image provenance, accessible blocks.
- Customer policies (shipping/returns/demo payment) need clear badge `Website mô phỏng, không bán hàng hoặc thu tiền` in purchase context and contact/about; do not put unsupported real business contact details.

## Website QA

- `lang="vi"`, locale formatting tests, title uniqueness, no broken internal links, valid robots/sitemap behavior, SEO audit, metadata snapshots, favicon real browsers.
- Social/OG file legal sources, license reference; no third-party brand logos copied as main identity.
