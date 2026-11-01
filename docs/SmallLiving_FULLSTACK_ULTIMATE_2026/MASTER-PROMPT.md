# MASTER PROMPT — SMALL LIVING 2026 | COMPLETE PRODUCT REBUILD

> **Đây là hợp đồng triển khai sản phẩm, không phải chỉ một prompt tạo giao diện.** Đọc `README-START-HERE.md`, file này, `RUN-THIS-PROMPT.md`, toàn bộ chương 01–35 và checklist nghiệm thu. Nếu chi tiết xung đột, ưu tiên: (1) an toàn và không mất dữ liệu; (2) tính đúng đắn bảo mật/nghiệp vụ; (3) acceptance matrix có kiểm thử; (4) hướng dẫn phiên bản mới đã được xác minh; (5) UX/thiết kế; sau cùng mới tối ưu code.

## A. Bối cảnh chính xác

- Dự án hiện tại `Shop-Ecommerce` là code trường học từ 2024, Next.js 14/React 18, Bootstrap/CSS, Redux và Supabase (cần audit lại tại runtime; không giả định các phiên bản vẫn như cũ).
- Đây là **dự án portfolio cá nhân**, tuyệt đối không kinh doanh thật: không mua hàng, không mua ảnh, không mua model, không nhận tiền, không gửi hàng, không gửi email/SMS thật, không có khách hàng thật.
- Muốn tạo **website thương mại điện tử Small Living hoàn chỉnh cả User + Admin + Backend + các trải nghiệm tương tác Small Living độc đáo**, có giao diện đủ chiều sâu, đầy đủ trạng thái, dữ liệu demo nhưng chức năng vận hành thực sự.
- Không dùng ảnh AI-generated. Ưu tiên ảnh chụp thật miễn phí có giấy phép phù hợp; model 3D có nguồn và license rõ. Không sao chép CellphoneS/các thương hiệu khác.
- Môi trường mục tiêu: Windows 11, Git Bash, RAM 16GB; ưu tiên không làm máy nặng. Có thể dùng Antigravity và Claude Code/claude-kit/reuse-first đã có, không tạo agent hoặc skill trùng lặp.

## B. Vai trò và điều kiện triển khai

Bạn đóng vai **Principal Product Architect, Full-stack Engineer, Commerce Domain Engineer, UX Director, Motion/3D Engineer, Security Engineer, QA Lead, Performance Engineer**. Hãy phân chia công việc qua subagent sẵn có khi hữu ích, nhưng một người điều phối chịu trách nhiệm tính nhất quán, bảo toàn dữ liệu và chất lượng nghiệm thu.

**Được phép xây lại toàn bộ source/frontend/backend UI nếu hợp lý.** Không buộc giữ route nội bộ, cấu trúc cũ, bootstrap, JavaScript, Redux hay thiết kế cũ. Tuy nhiên, phải audit, giữ giá trị tái sử dụng và làm một bản triển khai **song song an toàn** hoặc branch có rollback; cấm tự ý xóa source gốc, reset Git, xóa remote DB, overwrite thay đổi chưa commit, push/deploy, tạo chi phí thật hoặc chỉnh chính sách tài khoản thực khi chưa được duyệt.

**Triết lý thực thi:** Research real interfaces → Find reusable components → Evaluate licensing/compatibility → Integrate → Customize tokens/content → Functional tests → Browser screenshots → Improve. Tránh AI-slop, overengineering và các button demo giả báo thành công.

## C. Định nghĩa COMPLETE không thể thỏa hiệp

1. **User storefront đầy đủ**: Home theo không gian/vấn đề; mega menu; tất cả danh mục, subcategories, collections; search (autocomplete và no-results), kết quả có query URL; filters đa thuộc tính, sorting, paging, chips; product variants, ảnh, gallery, dimensions, stock demo, specs, comparisons; wishlist; recently viewed; product Q&A/reviews demo có moderation; saved rooms/bundles; account; addresses; cart persist; coupon rules; demo checkout; order history, tracking, cancellations/returns trong phạm vi demo; FAQ, policies, guides, contact/help, error/empty/loading states.
2. **Admin backoffice đủ nghiệp vụ**: Auth + RBAC; dashboard tính từ DB; catalog CRUD có biến thể/SKU/attributes/categories/tags/collections/asset provenance; publish/unpublish/scheduling; demo stock movement/adjust/reserve/release & low-stock; order queue, detail, status transitions, cancellation/return/refund simulation; customers theo quyền tối thiểu; promotions & coupon constraints; CMS banners/landing/guides/FAQ/navigation; media library; review/question moderation; SpaceFit rules, room templates & scene assets; analytics reports, filters/date/export sanitized, activity audit, settings/feature flags/demo reset guarded; skeleton, bulk actions confirm, validation/feedback.
3. **Backend/database**: Supabase PostgreSQL/Auth/Storage, RLS trên mọi bảng private, trusted server validation, server ownership/role checks, migrations reversible when feasible, idempotent deterministic seed, storage policies, DB constraints, indexes, uniqueness, transaction atomicity, order snapshots, server recalculation of totals, quantity/stock checks, idempotency key to avoid double checkout. User/Admin/saved plans share the same demo DB.
4. **Signature Small Living thật**: Room Profile (dimensions mm, constraints, no-drill, budget); SpaceFit explanation + fit/no-fit/unknown; compatibility scoring with explicit rules; bundles by space/problem; Shop-the-Room hotspots with verified images; 2D room planner with scale, drag/select/rotate/snap/collision, save/load; 3D planner with true camera/orbit, transform/place furniture linked to saved 2D scene, 3D models correctly scaled and licensed, accessible 2D fallback. Prefer 2D correct first before 3D polish.
5. **Design**: New neutral brand not CellphoneS; logo/wordmark/favicon/icon/apple-icon/OG; contemporary editorial/Japandi small living from research; design tokens and component states; responsive 320–1920; content Vietnamese natural; story-led merchandising; purposeful micro-interactions and selective high-quality motion; no purple gradients/glow/meaningless parallax; no AI-generated imagery.
6. **Engineering**: Strict TypeScript where rebuilt, lint + typecheck + tests, error boundaries, route loading, accessibility WCAG 2.2 AA target, keyboard/reduced-motion, cache strategy and invalidation, SEO/indexation, observability, privacy-safe analytics (demo), performance budgets, reproducible CI and documentation, dependency/SBOM & licenses, backup/rollback.

**Demo = tiền/sản phẩm/đơn/sự kiện giả nhưng business logic thật.** Không integrate live payment/shipping/email. "Thanh toán demo" phải xử lý trạng thái simulated paid/failed/refunded đúng; thông báo rõ không thực hiện giao dịch.

## D. Đích công nghệ khuyến nghị (không lock cứng patch)

- Kiểm tra tại thời điểm chạy `node --version`, package manager lock, `npm view` hoặc docs chính thức, `npm outdated`, `npm audit`, peer dependencies; chọn **stable** còn hỗ trợ, KHÔNG canary/alpha/RC mặc định.
- Rebuild ưu tiên **Next.js 16 Active LTS, React 19, TypeScript, Tailwind CSS v4, shadcn/ui/Radix, Motion**, Supabase SSR/Postgres, `zod` và forms (chỉ một form approach chính). `next lint` không còn ở Next 16: dùng ESLint CLI. Không bê cả Bootstrap/Formik/Redux cũ nếu không cần, nhưng không phá flow cũ trước khi hoàn thành luồng mới.
- State: Server Components và URL searchParams cho data server, local React state cho UI ephemeral, một state library nhỏ chỉ khi cần; không cài Redux+Zustand+TanStack Query trùng lặp. Supabase RLS là tuyến phòng thủ, KHÔNG thay cho server authorization.
- 3D: Three.js + React Three Fiber v9 (React 19) + Drei khi phù hợp, lazy load/client-only & shared 2D/3D scene data; giảm pixel ratio và shadows, pause offscreen, 2D accessible fallback. Không phụ thuộc công cụ trả phí/Spline watermark.
- Core component: shadcn registry + 21st.dev source review; animation: Motion, React Bits FREE components có license phù hợp. Dùng `frontend-design`, `web-design-guidelines` và MCP có lợi trong project scope; không cài nhiều tool trùng. Đọc `03-` và `29-`.
- Local: dùng Supabase CLI + Docker Desktop khi đủ tài nguyên hoặc Supabase sandbox project **mới hoàn toàn**; không chạy `db reset --linked` trên remote. Không cần multi-repo, microservices, Kubernetes, event bus hay payment gateway thật.

## E. Các persona và quyền

- **Visitor**: xem/browse/search/filter, xem hướng dẫn/room collections, cart local guest nếu khả thi, không thấy dữ liệu private.
- **Customer**: đăng ký/đăng nhập, wishlist/compare, room plans, address, demo orders/returns/reviews của chính họ.
- **Staff**: đọc và cập nhật một số order/stock/content theo policy rõ; không chỉnh admin users/roles.
- **Catalog Manager / Content Editor**: chỉ thao tác miền được phân quyền; tùy chọn nếu repo/mục tiêu cho phép triển khai sạch.
- **Admin**: full authorized Backoffice demo; role thay đổi có audit; không truy cập secrets server từ UI.
- **Forbidden paths**: `customer` gọi mutation admin, truy cập order người khác, thay giá/trạng thái từ client, gán role qua form, xem analytics private hoặc tải file private đều bị từ chối tại server + database.

## F. Nghiệp vụ phải chứng minh End-to-End

1. Admin seed / tạo category → tạo product+variant+dimensions+assets → publish → homepage/PLP/PDP hiển thị đúng, cache invalidation đúng.
2. User đăng nhập → lọc theo chiều rộng/tình trạng không khoan → xem PDP → chọn variant → thêm vào cart → reload không mất → áp mã promo DEMO hợp lệ → checkout DEMO → DB lưu chính xác line snapshot và total tính ở server.
3. Admin thấy order → xử lý trạng thái bằng transition hợp lệ → User thấy timeline; trừ/hoàn tồn kho qua transaction đúng; bấm checkout hai lần vẫn chỉ một order; đổi giá sản phẩm không làm thay đổi total của order cũ.
4. User lưu room profile → SpaceFit giải thích fit/no fit/unknown → tạo bundle → add bundle vào cart; planner 2D di chuyển đồ theo cm/mm, lưu DB → xem scene trong 3D (nếu WebGL) → load lại vẫn cùng vị trí; fallback 2D hoạt động khi 3D lỗi.
5. Admin tạo CMS page/hero/guide/room bundle → publish → User thấy; unpublish → User không thấy, đảm bảo SEO/caching phù hợp.
6. Các negative flows: API/RLS chặn người dùng trái quyền; seed không có PII thật; ảnh hoặc model không license không được dùng; không có ảnh lỗi; responsive/keyboard các màn hình chính hoạt động.

## G. Thiết kế chi tiết được định nghĩa ở đâu

- `08-STOREFRONT-UX-FUNCTIONS.md`, `20-FULL-COMMERCE-OPERATIONS.md`, `24-UX-SCREEN-INVENTORY.md`: User flows, toàn bộ page/empty/loading/errors.
- `09-ADMIN-BACKOFFICE.md`, `21-ADMIN-ENTERPRISE-BACKOFFICE.md`: Backoffice modules, role, bảng, workflows, CMS, reports.
- `10-DATABASE-COMMERCE-SECURITY.md`, `22-DATABASE-ENTITY-RELATIONSHIPS.md`, `23-SECURITY-ABUSE-NEGATIVE-TESTS.md`: schema, transactions, RLS, threat model.
- `11-SMALL-LIVING-SIGNATURE.md`, `12-3D-MOTION-EXPERIENCE.md`, `33-UI-COMPONENT-RECIPES.md`: Product differentiators, room planner, reusable design/animation.
- `28-DEPENDENCY-DECISION-MATRIX.md`, `29-SKILLS-MCP-INSTALL-CHECKLIST.md`: verified stack/tool choices and actual install procedures.
- `25-LOCALIZATION-CONTENT-SEO.md`, `26-PERFORMANCE-OBSERVABILITY-CI.md`: Vietnamese content, sitemap/metadata/SEO, budgets, CI/ops.
- `27-WORKING-E2E-SCENARIOS.md`, `30-ACCEPTANCE-EXTENDED.md`: Must-pass flows, status/evidence gates.
- `31-REALISTIC-DEMO-DATA-PLAN.md`, `32-ROLLBACK-REBUILD-MIGRATION.md`, `34-CHANGE-GOVERNANCE-SCOPE.md`: data seed/asset license, safe rebuild, delivery governance.

## H. Cách thực hiện bắt buộc

1. **AUDIT** toàn repository, routes, dependencies, Supabase auth/DB/migrations, source images; lập baseline Git, security, tests, console và các hành vi cần giữ; đánh giá refactor/rebuild và chọn phương án có bằng chứng. Thao tác chưa được cấp phép thì chỉ ghi đề xuất.
2. **SPEC & IA** lập site map User + Admin, entity/permissions, role matrix, status machine, edge cases, demo data model, visual research, interaction/3D prototypes. Có screenshot thiết kế thực tế, không chỉ mô tả.
3. **STACK & TOOLS** kiểm tra docs và peer deps; chọn libs tối thiểu; cài skills/MCP trong scope hợp lệ và chỉ sau khi xác minh chúng chưa có; xác nhận MCP thực sự kết nối trước khi dựa vào nó. Không tự sửa cấu hình global claude-kit/Antigravity.
4. **IMPLEMENT** dựng song song an toàn nếu cần, triển khai milestones theo `15-IMPLEMENTATION-MILESTONES.md` và `35-FINAL-DELIVERY-GATES.md`, không dừng ở mockup. Theo vertical slices: catalog admin→user, cart→order, auth+RLS, promotions+inventory, CMS, Small Living, motion/3D, polish.
5. **VERIFY** sau mỗi slice chạy lint/typecheck/unit/integration/E2E/build, screenshot desktop/mobile, negative auth tests, DB assertions, performance/a11y scans; sửa lỗi trước khi chuyển tiếp.
6. **DELIVER** source code, migrations, seeds, tests, documentation, assets manifest, demo user flow, screenshots, 2D/3D sample scene và báo cáo kết quả thành thật; 100% features không có evidence thì không được gọi "complete".

## I. Chính sách tiến độ và chứng cứ

- Tạo `docs/FEATURE-MATRIX.md` từ `30-ACCEPTANCE-EXTENDED.md` với `ID | priority | owner | status | code paths | test command | exit code | evidence screenshot/trace | limitation`.
- Mỗi hạng mục là `NOT STARTED`, `IN PROGRESS`, `DONE`, `PARTIAL`, `BLOCKED`, `NOT RUN`; `DONE` chỉ khi giao diện + business + database/persistence + negative cases + test phù hợp thực sự hoạt động.
- Phải giải thích khi không thể hoàn thành một phần, không đánh tráo bằng "future implementation" hoặc đặt nút không hoạt động. Tránh hứa hoàn thành tất cả trong một batch khổng lồ.
- Tính năng thiết kế/phần demo 3D chỉ được hoàn thành khi chức năng có hiệu lực, không phải screenshot hoặc model xoay vô nghĩa.
- Chỉ yêu cầu phê duyệt với destructive/migrations remote/breaking public contracts/payments thật/deploy/push/global config rewrite. Các chỉnh sửa an toàn, có rollback, tự động thực hiện liên tục.

**BẮT ĐẦU NGAY: đọc `RUN-THIS-PROMPT.md`, kiểm tra repo thực và thực thi milestone an toàn đầu tiên.**
