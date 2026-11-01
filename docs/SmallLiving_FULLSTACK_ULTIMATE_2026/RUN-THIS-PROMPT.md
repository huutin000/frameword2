# RUN THIS — PROMPT KHỞI CHẠY DUY NHẤT

Hãy đọc **`MASTER-PROMPT.md`**, **`README-START-HERE.md`**, **toàn bộ file `01`–`35`** trong thư mục bộ đặc tả `SmallLiving_FULLSTACK_ULTIMATE_2026`. Các file này là hợp đồng triển khai; phải kiểm tra nội dung trước khi code.

Tôi muốn thay toàn bộ dự án `Shop-Ecommerce` 2024 thành **Small Living 2026 — một hệ thống Full-stack E-commerce + Interactive Space Planning hoàn chỉnh, User + Admin + Backend + 2D/3D + QA/Security/Performance/SEO/A11y**. Đây là portfolio cá nhân, mọi giao dịch là **DEMO**, không cần kinh doanh, không mua tài nguyên, không dùng AI-generated imagery; nhưng *tất cả chức năng phải thực sự chạy trên dữ liệu demo*, không được làm các form/button giả.

**Bạn có toàn quyền thiết kế/kiến trúc lại và tạo bản rebuild sạch bằng Next.js stable, React, TypeScript, Tailwind v4, shadcn nếu audit cho thấy đáng dùng. Không phải giữ Bootstrap, Redux, JS, naming, folder cũ.** Tuy nhiên, phải bảo vệ Git history, working tree, secrets, assets và Supabase remote; chỉ xây mới song song an toàn hoặc branch với rollback. Không xóa dự án cũ và không tự ý deploy/push/reset remote.

Bắt buộc tìm UI thực tế và component có nguồn trước khi code; ưu tiên frontend-design, shadcn MCP, 21st.dev Skills, web-design-guidelines, Motion AI Kit khi đã xác minh phù hợp và có sẵn, không cài trùng lặp hoặc trả phí. Ưu tiên sử dụng Skills/Agent hiện có của claude-kit/reuse-first; không cần slash command thủ công.

**Không được bỏ sót hệ thống quản trị**: admin modules về product/variants/categories/collections, inventory, orders, customers, promotions, editorial CMS, room layouts, moderation, reporting, access roles, audit logs, settings và asset licenses. User phải có đầy đủ catalog/search/filters/sort, PDP, saved/wishlist, compare, cart, demo checkout/order timeline, account, support/help, editorial collections. Small Living phải có room profile, SpaceFit, bundle builder, 2D plan và 3D viewer/planner với save/load, có fallback.

Đặt ra ma trận tính năng đầy đủ và triển khai thực tế theo vertical slices, không chỉ mô tả hoặc chỉ làm trang chủ/product/cart. Kiểm thử User→DB→Admin→User, RLS, validation giá/tồn, double submit, role denial, ảnh/model provenance, loading/errors/empty, responsive, performance, accessibility, SEO, 3D performance. Chỉ báo DONE khi có test và bằng chứng.

BẮT ĐẦU NGAY: (1) audit repository/Git/deps thực tế; (2) đánh giá rebuild-vs-refactor và đề xuất kiến trúc gọn; (3) chuẩn bị bản mới an toàn, tool compatibility; (4) thực thi milestone đầu tiên, báo cáo file/diff + lệnh kiểm thử + evidence; (5) tiếp tục các milestones an toàn không cần hỏi từng file. Chỉ dừng để duyệt những hành động rủi ro cao.
