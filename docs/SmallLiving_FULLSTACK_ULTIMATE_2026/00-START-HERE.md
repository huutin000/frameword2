# SMALL LIVING 2026 — ULTIMATE FULL-STACK REBUILD KIT

**Edition:** 2026-11-01 | **Scope:** Storefront + Admin + Backend + 2D/3D + Motion + UX + testing.

## Mục tiêu
Chuyển `Shop-Ecommerce` cũ (điện thoại/laptop, Next.js/React/Supabase thời 2024) thành một **nền tảng portfolio Small Living hoàn chỉnh**: mua hàng mô phỏng, kho và đơn demo xử lý thật trên cơ sở dữ liệu thử nghiệm, quản trị có phân quyền, công cụ đo độ phù hợp sản phẩm với phòng, trình thiết kế phòng 2D/3D, giao diện cao cấp nhiều chuyển động đúng lúc.

**Không kinh doanh thật. Không nhập hàng, mua ảnh, mua model, mua template, dùng AI-generated imagery, thanh toán hoặc vận chuyển thật.** Các ảnh đều phải là ảnh chụp thực có nguồn và giấy phép phù hợp. Mock data phải dán nhãn DEMO. Số liệu/logic có thể là demo nhưng **phải hoạt động thực tế và có kiểm thử**.

## Bắt đầu nhanh
1. Giải nén thư mục này vào gốc repo hiện tại (chẳng hạn `prompts/small-living-2026/`).
2. Mở Antigravity hoặc Claude Code tại **repo root**, không phải trong thư mục ZIP.
3. Dán nội dung `RUN-THIS-PROMPT.md` (hoặc đưa đường dẫn file đó cho Agent).
4. Agent phải đọc `MASTER-PROMPT.md`, các file 01–19 và **20–35 (bổ sung nghiệp vụ, bảo mật, UX và 155 acceptance checks)**; dùng chúng làm source of truth khi thực thi.
5. Agent **không được xóa/sửa phá hủy ngay**: kiểm toán repo và lập chiến lược giữ lại / viết lại có căn cứ. Có thể tạo `frontend-v2/` hoặc branch riêng để rebuild song song.
6. Cài Skills/MCP **chọn lọc**, chỉ sau khi kiểm tra những gì đã cài trong môi trường IDE, theo `03-SKILLS-MCP-SETUP.md`.
7. Làm theo từng milestone; test và chụp ảnh trình duyệt trước khi báo PASS.

## Mục lục
- `MASTER-PROMPT.md`: Hợp đồng triển khai tổng thể, Agent phải ưu tiên.
- `RUN-THIS-PROMPT.md`: Prompt ngắn gửi trực tiếp Agent.
- `01-REPO-AUDIT-REBUILD-DECISION.md`: Điều tra repo, quyết định rebuild vs migration.
- `02-STACK-2026-UPGRADE.md`: Lựa chọn stack, nâng cấp dependencies từ 2024.
- `03-SKILLS-MCP-SETUP.md`: Lệnh cài, cấu hình và kiểm tra công cụ cho Agent.
- `04-ARCHITECTURE-MIGRATION.md`: Cấu trúc, phân lớp, đường chuyển đổi an toàn.
- `05-VISUAL-RESEARCH.md`: Nghiên cứu thị giác, anti-AI-template, UX.
- `06-BRANDING-DESIGN-SYSTEM.md`: Brand/logo/favicon/metadata/design tokens.
- `07-CATALOG-IMAGES-MODELS.md`: Danh mục, dữ liệu demo, giấy phép ảnh và model 3D.
- `08-STOREFRONT-UX-FUNCTIONS.md`: Toàn bộ User pages và các tương tác thật.
- `09-ADMIN-BACKOFFICE.md`: Admin UI/UX và nghiệp vụ quản trị.
- `10-DATABASE-COMMERCE-SECURITY.md`: Schema, Auth, RLS, giao dịch mua bán demo.
- `11-SMALL-LIVING-SIGNATURE.md`: Room Profile/SpaceFit/Solution Builder.
- `12-3D-MOTION-EXPERIENCE.md`: 2D/3D planner, viewers và animation.
- `13-COMPONENT-REUSE-RECIPES.md`: Quy trình tìm và chọn component có sẵn.
- `14-QA-ACCESSIBILITY-PERFORMANCE.md`: Chất lượng, E2E, an ninh và hiệu năng.
- `15-IMPLEMENTATION-MILESTONES.md`: Đợt triển khai, stop/go gates, deliverables.
- `16-FEATURE-ACCEPTANCE.md`: Ma trận nghiệm thu và không cho phép nút giả.
- `17-REFERENCE-LINKS.md`: Nguồn chính thức, link trang gốc.
- `18-CLI-COMMANDS.md`: Lệnh kiểm tra/cài đặt, phạm vi an toàn.
- `19-UX-SCREEN-BLUEPRINTS.md`: Bố cục các trang theo desktop/mobile.

## Các tài liệu bổ sung mới (20–35)
- `20-FULL-COMMERCE-OPERATIONS.md`: vòng đời order/payments/refunds/promos/stock DEMO.
- `21-ADMIN-ENTERPRISE-BACKOFFICE.md`: toàn bộ Admin, vai trò, CMS, reports và operation flows.
- `22-DATABASE-ENTITY-RELATIONSHIPS.md`: model DB, RLS, constraints và transactions.
- `23-SECURITY-ABUSE-NEGATIVE-TESTS.md`: threat model, test bảo mật và quyền.
- `24-UX-SCREEN-INVENTORY.md`: toàn bộ screens, responsive và UI states.
- `25-LOCALIZATION-CONTENT-SEO.md`: tiếng Việt, brand/metadata/SEO và nội dung.
- `26-PERFORMANCE-OBSERVABILITY-CI.md`: Core Web Vitals, logging, CI, ngân sách 3D.
- `27-WORKING-E2E-SCENARIOS.md`: 10 user journeys xuyên hệ thống.
- `28-DEPENDENCY-DECISION-MATRIX.md`: lựa chọn thư viện 2026 không chồng chéo.
- `29-SKILLS-MCP-INSTALL-CHECKLIST.md`: **nguồn ưu tiên để cài Skills/MCP chính xác**.
- `30-ACCEPTANCE-EXTENDED.md`: 155 tiêu chí P0–P3; ghi DONE chỉ với evidence.
- `31-REALISTIC-DEMO-DATA-PLAN.md`: seed catalog/asset/license/trạng thái demo.
- `32-ROLLBACK-REBUILD-MIGRATION.md`: quy trình rebuild an toàn.
- `33-UI-COMPONENT-RECIPES.md`: component/motion/3D theo màn hình, tránh AI-slop.
- `34-CHANGE-GOVERNANCE-SCOPE.md`: approvals và báo cáo progress.
- `35-FINAL-DELIVERY-GATES.md`: checklist final full-stack.

## Quy tắc ưu tiên nếu file mâu thuẫn
1. Quy tắc an toàn và bảo vệ dữ liệu của người dùng.
2. `MASTER-PROMPT.md` và mục tiêu user hiện tại: **cho phép viết lại nhưng không tự ý phá hủy**.
3. Kết quả kiểm toán repository có bằng chứng.
4. Tài liệu chính thức/khả năng tương thích theo ngày chạy.
5. Hướng dẫn chức năng và giao diện theo từng file.

## Định nghĩa hoàn thành
Không phải: một bộ hình đẹp, màn hình giả, mock API tĩnh, README nói đã xong.
Phải là: chạy được locally; các luồng user/admin trên chung database demo; 3D có input/output/điều khiển thật và fallback; lint/typecheck/unit/integration/E2E/build đạt; mobile có trải nghiệm thực; ảnh/model hợp giấy phép; có tài liệu tái lập và screenshots. Nếu chưa xong, báo rõ phần nào chưa hoàn thành.
