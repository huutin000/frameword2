# SMALL LIVING 2026 — ULTIMATE FULL-STACK AGENT SPEC

**Phiên bản:** 01/11/2026 · **Mục đích:** đưa repo thương mại điện tử sinh viên lên mức portfolio full-stack có UX cao, chức năng thật trên dữ liệu demo và trải nghiệm room planning tương tác. **Không chứa source code ứng dụng đã hoàn thành.**

## Dùng thế nào

1. Giải nén thư mục vào root repository `Shop-Ecommerce`, ví dụ `agent-spec/SmallLiving_FULLSTACK_ULTIMATE_2026/`.
2. Mở Antigravity IDE hoặc Claude Code ở repository root; bảo đảm Agent đọc được folder này.
3. Dán toàn bộ nội dung **`RUN-THIS-PROMPT.md`** hoặc nói: `Đọc agent-spec/SmallLiving_FULLSTACK_ULTIMATE_2026/RUN-THIS-PROMPT.md và triển khai đúng các tài liệu tham chiếu`.
4. Agent phải đọc **MASTER-PROMPT.md** và tất cả các module, tạo implementation roadmap và feature matrix trong **repo ứng dụng**, không phải trong bộ đặc tả.
5. Yêu cầu Agent báo cáo bằng `DONE/PARTIAL/BLOCKED/NOT RUN` + test evidence và tiếp tục từng batch an toàn.

## Bạn nhận được

- 22 file nền tảng (00–19 + master/run) được mở rộng bằng các chương 20–35.
- Tài liệu chuyên sâu: User, Admin, fulfillment/payment DEMO, refund, tồn kho, promotions, CMS, phân quyền, audit, schema SQL logic, UX mọi màn hình, responsive, performance, SEO, analytics, 2D/3D, assets license, QA, Skills/MCP.
- `30-ACCEPTANCE-EXTENDED.md`: ma trận nhiều tính năng với tiêu chí PASS thật.
- `27-WORKING-E2E-SCENARIOS.md`: các test journey xuyên hệ thống.
- `35-FINAL-DELIVERY-GATES.md`: điều kiện công bố hoàn thành.

## Thứ tự ưu tiên nếu thời gian/công cụ có giới hạn

P0: data protection, auth+roles+RLS, product admin→user, cart→checkout demo→order admin→user, lint/build/tests. P1: toàn bộ màn hình cơ bản, inventory/promo/CMS/reviews/accounts, design system/responsive. P2: SpaceFit/bundle/room profile/2D. P3: 3D planner đầy đủ, advanced analytics/polish. **Tất cả thuộc mục tiêu cuối nhưng không được báo hoàn thành khi còn thiếu.**

## Quan trọng về install lệnh

Không chạy tất cả lệnh trong `29-SKILLS-MCP-INSTALL-CHECKLIST.md` một cách tự động. Agent phải audit OS, package manager, phiên bản, cài những gì có ích và thử kết nối MCP thực tế. Kết nối external accounts/MCP trả phí cần người dùng chủ động đăng nhập/phê duyệt. Không chỉnh global claude-kit.

## Ranh giới trách nhiệm

Agent được quyền thay toàn bộ UI/stack hoặc dựng folder v2, **không được tự ý xóa project gốc, remote DB, `.env`, Git history**. Đơn hàng/thanh toán/vận chuyển/reviews đều được xử lý theo logic DEMO, có nhãn công khai; không thực hiện giao dịch hoặc thông báo thật.
