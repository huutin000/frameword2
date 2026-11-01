# Small Living 2026 — Nền Tảng Thiết Kế & Thương Mại Điện Tử Không Gian Nhỏ

> **Dự án Portfolio Kỹ Sư Cao Cấp (Technical Showcase 2026)**  
> Tái cấu trúc toàn diện từ đồ án sinh viên cũ thành hệ thống Full-stack Modern E-commerce & Quy hoạch không gian 2D/3D tương tác.

[![Next.js 16.4](https://img.shields.io/badge/Next.js-16.4.3%20(Active%20LTS)-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x%20Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?logo=three.js)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-49%20Tests%20PASS-brightgreen?logo=vitest)](https://vitest.dev/)

---

## 1. Giới thiệu dự án & Tầm nhìn kiến trúc

**Small Living 2026** giải quyết bài toán cốt lõi của người trẻ sống tại các đô thị lớn: **Không gian sống hạn chế (phòng trọ 12–20m², chung cư mini, studio)** và quy định khắt khe của chủ nhà (*cấm khoan đục tường*).

### Tính năng độc quyền (Small Living™ Signatures):
1. **Hồ Sơ Không Gian (Room Profile):** Lưu trữ chính xác kích thước phủ bì ($L \times W \times H\text{ mm}$) và khoảng trống khả dụng thực tế để kê đồ, cờ phòng thuê, cờ cấm khoan tường.
2. **Thuật Toán SpaceFit™ Tự Giải Thích (Deterministic Rules):**
   - Đánh giá khả năng vừa vặn dựa trên số đo mm thực tế mà không dùng AI cảm tính.
   - Trả về 4 trạng thái minh bạch: `FIT` (Vừa vặn hoàn hảo), `MAY_FIT` (Cần lưu ý lối đi / xoay 90°), `DOES_NOT_FIT` (Không vừa / Chạm trần / Vi phạm cấm khoan), `INSUFFICIENT_DATA` (Thiếu số đo).
   - Đo đạc lối đi lưu thông ($\ge 600\text{ mm}$) và tỷ lệ chiếm dụng sàn ($m^2$ và %).
3. **Trình Tạo Combo Giải Pháp (Solution Bundle Builder):**
   - Các gói combo phối sẵn (Phòng trọ 12m², Góc làm việc mini 0.8m², Bếp gọn nam châm, Lưu trữ thông minh).
   - Tùy chỉnh thêm/bớt từng món đồ, tự động tính chiết khấu combo 10% và đưa toàn bộ vào giỏ hàng chỉ với 1 cú click.
4. **Tham Quan Phòng Thực Tế & Điểm Chạm (Shop The Room Hotspots):**
   - Điểm chạm radar tương tác trên ảnh nội thất chụp thực tế có bản quyền. Chạm để xem chi tiết kích thước, SpaceFit và mua ngay.
5. **Mặt Bằng 2D Kéo Thả & Phối Cảnh 3D WebGL (2D/3D Room Planner):**
   - Lưới tỷ lệ chuẩn milimét (1 ô = 100mm), kéo thả mượt mà với snap lưới.
   - Phát hiện va chạm đè nhau (AABB 2D Collision Detection) và vượt chu vi tường phòng.
   - Thao tác toàn diện bằng bàn phím (Phím Mũi tên di chuyển 100mm, phím `R` xoay 90°, phím `Del` xóa).
   - Chuyển đổi 2 chiều tức thì giữa Mặt bằng 2D và Phối cảnh 3D WebGL (Three.js) trên cùng một mô hình dữ liệu dùng chung (`RoomScene`).
   - Tự động phát hiện và fallback an toàn khi thiết bị không hỗ trợ WebGL.

---

## 2. Kiến trúc thư mục Feature-Driven (Vertical Slices)

Dự án áp dụng cấu trúc **Feature-Driven Architecture**, phân chia theo lát cắt nghiệp vụ độc lập, dễ bảo trì:

```text
web/
├── public/
│   └── brand/                    # SVG Brand Assets (Small Living Logo, Mark, Favicon)
├── src/
│   ├── app/                      # Next.js 16 App Router Routes
│   │   ├── (storefront)/         # User Storefront Route Group
│   │   │   ├── catalog/          # PLP & PDP ([id]) với SpaceFit Card & 3D Viewer
│   │   │   ├── cart/             # Giỏ hàng với mã SMALL2026 (-10%)
│   │   │   ├── checkout/         # Demo Checkout với xác thực Server Action
│   │   │   ├── orders/[id]/      # Theo dõi hành trình đơn hàng thời gian thực
│   │   │   ├── room-profile/     # Quản lý hồ sơ đo đạc phòng
│   │   │   ├── solutions/        # Combo phối sẵn ([slug])
│   │   │   ├── shop-the-room/    # Tham quan phòng thực tế với Hotspots
│   │   │   ├── planner/          # Quy hoạch 2D/3D Room Planner
│   │   │   ├── compare/          # Bảng so sánh 8 thông số kỹ thuật mm
│   │   │   ├── wishlist/         # Danh sách lưu trữ cá nhân
│   │   │   ├── guides/ faq/ contact/ about/
│   │   │   └── not-found.tsx, error.tsx, loading.tsx
│   │   └── admin/                # Admin Backoffice Route Group
│   │       ├── products/         # CRUD Sản phẩm, SKU, số đo mm, cờ không khoan
│   │       ├── categories/       # Quản lý phân cấp không tạo vòng lặp
│   │       ├── inventory/        # Sổ cái biến động kho & kiểm soát tồn
│   │       ├── orders/           # State Machine chuyển trạng thái đơn hàng
│   │       ├── promotions/       # Quản lý mã giảm giá và hạn ngạch
│   │       ├── solutions/        # Xuất bản mẫu combo cho Storefront
│   │       └── audit-logs/       # Nhật ký ghi nhận thao tác quản trị
│   ├── features/                 # Vertical Business Slices
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── room-profile/
│   │   ├── spacefit/             # Pure Deterministic Engine
│   │   ├── solutions/
│   │   ├── shop-the-room/
│   │   ├── planner/              # 2D Canvas + 3D Three.js Viewport
│   │   ├── compare/
│   │   ├── wishlist/
│   │   └── admin/
│   ├── components/               # Primitives & Global Layouts
│   │   ├── layout/               # Header, Footer, AdminSidebar
│   │   └── ui/                   # Button, Badge, Input, Card
│   └── lib/                      # Formatters, Supabase Types, Invariants
└── scripts/                      # Playwright Automated Capture Scripts
```

---

## 3. Cài đặt & Khởi chạy dự án

### Yêu cầu môi trường:
- **Node.js:** v20.x hoặc v22+ (Khuyến nghị Node.js LTS).
- **Trình quản lý gói:** `npm`.

### Các bước cài đặt:
```bash
# 1. Di chuyển vào thư mục web
cd web

# 2. Cài đặt dependencies sạch
npm install

# 3. Chạy kiểm thử tự động (Unit & Integration)
npm test

# 4. Kiểm tra linting và quy chuẩn TypeScript
npm run lint

# 5. Biên dịch sản xuất (Production Build)
npm run build

# 6. Khởi chạy ứng dụng sản xuất
npm run start
# Mở trình duyệt tại: http://localhost:3000
```

---

## 4. Tài khoản Demo & Dữ liệu mô phỏng

Hệ thống được nạp sẵn dữ liệu deterministic cho kịch bản chạy thử:

| Vai trò | Tài khoản Demo | Mật khẩu Demo | Phạm vi truy cập |
|---|---|---|---|
| **Khách mua hàng (Storefront)** | `guest` (Tự động lưu Session) | Không yêu cầu | Xem hàng, đo SpaceFit, tạo phòng, tùy biến combo, đặt hàng, theo dõi đơn |
| **Quản trị viên (Admin)** | `admin@smallliving.local` | `AdminDemo2026!` | Truy cập `/admin`, quản lý đơn hàng, xuất bản combo, kiểm soát tồn kho, xem audit logs |

- **Mã ưu đãi Demo:** Nhập `SMALL2026` tại giỏ hàng để nhận giảm giá 10% (tối đa 500.000 VNĐ).
- **Phương thức thanh toán:** Hỗ trợ mô phỏng VietQR (tự động khớp), MoMo và COD.

---

## 5. Bằng chứng kiểm thử & Nghiệm thu tự động

- **Vitest Suite:** 12 Test Suites / 49 Tests vượt qua 100% trong 456ms.
- **Next.js Compilation:** 29 tuyến đường (Static, SSG, Dynamic) biên dịch thành công không cảnh báo.
- **Playwright Visual Evidence:** Đã chụp 15+ ảnh giao diện độ nét cao lưu trữ tại thư mục Artifacts của dự án.
- **Bảo toàn dữ liệu cũ:** Thư mục gốc `frontend/` được cô lập nguyên vẹn 100% làm bằng chứng đối chiếu.

---
© 2026 Small Living Studio. Dự án phục vụ mục đích Portfolio & Technical Demonstration.
