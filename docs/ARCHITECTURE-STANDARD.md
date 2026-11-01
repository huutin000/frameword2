# PRODUCTION ARCHITECTURE STANDARD: SMALL LIVING 2026
**Standard:** Feature-Driven Vertical Slices (Domain-Driven Architecture)  
**Date:** 2026-11-01  
**Status:** ACTIVE & ENFORCED

---

## 1. Core Principles

1. **Routing Separation (`src/app/`):**
   - Các file `page.tsx` và `layout.tsx` chỉ đóng vai trò là **Thin Orchestrators** (bộ ghép nối mỏng), điều phối dữ liệu và gọi các feature components.
   - Tuyệt đối không viết logic nghiệp vụ 300–500 dòng hay render raw HTML trực tiếp trong `page.tsx`.
2. **Domain-Driven Vertical Slices (`src/features/`):**
   - Mỗi domain nghiệp vụ độc lập là một slice hoàn chỉnh: UI components, kiểu dữ liệu (`types`), logic tính toán (`engine`), và hooks/actions nằm cùng một nơi.
   - Khi bảo trì hoặc mở rộng một tính năng (vd: SpaceFit hay 2D Planner), chỉ cần làm việc trong thư mục feature tương ứng.
3. **Atomic Reusable UI (`src/components/ui/`):**
   - Chỉ chứa các UI primitives không phụ thuộc nghiệp vụ (`button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`).
4. **Shared App Shells (`src/components/layout/`):**
   - Header, Footer, Admin Sidebar, Admin Topbar tách biệt, có trách nhiệm rõ ràng.
5. **Infrastructure & Utilities (`src/lib/`):**
   - Chứa client/server Supabase, hàm format tiền tệ VND, định dạng milimet, và hàm tiện ích `cn`.
6. **File & Folder Naming Convention:**
   - Thư mục và file sử dụng chuẩn **`kebab-case`** (`space-fit-engine.ts`, `product-card.tsx`, `room-canvas-2d.tsx`).
   - Component và Type xuất khẩu sử dụng **`PascalCase`** (`ProductCard`, `SpaceFitEvaluation`).
   - 100% TypeScript strict (`.ts`, `.tsx`), không sử dụng JavaScript tự do.

---

## 2. Directory Tree Map

```text
web/src/
├── app/                                 # THIN ROUTE ORCHESTRATORS ONLY
│   ├── (storefront)/                    # Route group người dùng
│   │   ├── layout.tsx                   # Storefront shell (StorefrontHeader + StorefrontFooter)
│   │   ├── page.tsx                     # Trang chủ (kết hợp Hero + Problem Grid + Feature ProductCard)
│   │   ├── catalog/page.tsx             # Danh mục sản phẩm (CatalogFilters + ProductGrid)
│   │   ├── planner/page.tsx             # 2D/3D Planner (RoomDimensionsForm + RoomCanvas2D + SpaceFitMetrics)
│   │   └── cart/page.tsx                # Giỏ hàng & thanh toán demo
│   ├── admin/                           # Route group quản trị Backoffice
│   │   ├── layout.tsx                   # Admin shell (AdminSidebar + AdminHeader)
│   │   └── page.tsx                     # Dashboard KPI, Sổ cái tồn kho & Đơn hàng gần đây
│   ├── globals.css                      # Tailwind v4 theme tokens
│   ├── layout.tsx                       # Root HTML, body & demo disclaimer
│   └── icon.svg                         # Vector App Favicon
│
├── features/                            # VERTICAL SLICES (DOMAIN LOGIC & COMPONENTS)
│   ├── catalog/                         # Domain: Danh mục & Khám phá sản phẩm
│   │   ├── components/
│   │   │   ├── product-card.tsx         # Thẻ sản phẩm với nhãn đo đạc mm & no-drill
│   │   │   └── catalog-filters.tsx      # Bộ lọc đa chiều (phòng, vấn đề, thanh trượt mm)
│   │   ├── data/
│   │   │   └── mock-products.ts         # Bộ dữ liệu mẫu chuẩn kích thước mm & ảnh bản quyền
│   │   └── types/
│   │       └── index.ts                 # CatalogProduct, CatalogFilterState
│   │
│   ├── planner/                         # Domain: Quy hoạch không gian & SpaceFit
│   │   ├── components/
│   │   │   ├── room-canvas-2d.tsx       # Canvas 2D vẽ mặt bằng tỷ lệ động, lưới 200mm
│   │   │   ├── room-dimensions-form.tsx # Form nhập kích thước dài, rộng, cao (mm)
│   │   │   └── space-fit-metrics.tsx    # Thẻ đánh giá tỷ lệ chiếm sàn & cảnh báo va chạm
│   │   ├── engine/
│   │   │   ├── space-fit-engine.ts      # Pure function tính toán va chạm AABB & diện tích
│   │   │   └── space-fit-engine.test.ts # Bộ kiểm thử Vitest kiểm tra thuật toán
│   │   └── types/
│   │       └── index.ts                 # PlacedFurniture, RoomProfile, SpaceFitEvaluation
│   │
│   └── admin/                           # Domain: Quản trị Backoffice
│       ├── components/
│       │   ├── kpi-card.tsx             # Thẻ hiển thị chỉ số doanh thu, đơn hàng demo
│       │   ├── recent-orders-table.tsx  # Bảng danh sách đơn hàng mô phỏng
│       │   └── inventory-alert-card.tsx # Bảng cảnh báo kho tồn thấp
│       └── types/
│           └── index.ts                 # KpiMetric, DemoOrder, InventoryBalance
│
├── components/                          # REUSABLE & STATELESS COMPONENTS
│   ├── ui/                              # Atomic Primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── layout/                          # App Shells
│       ├── storefront-header.tsx
│       ├── storefront-footer.tsx
│       ├── admin-sidebar.tsx
│       └── admin-header.tsx
│
├── lib/                                 # INFRASTRUCTURE & UTILITIES
│   ├── formatters/
│   │   ├── currency.ts                  # formatVND chuẩn xác
│   │   └── dimensions.ts                # formatDimensions (mm), calculateAreaM2
│   ├── supabase/
│   │   ├── client.ts                    # Browser client (@supabase/ssr)
│   │   ├── server.ts                    # Server client với async cookies() của Next 16
│   │   └── types.ts                     # TypeScript Schema definitions
│   ├── utils.ts                         # Helper cn (clsx + tailwind-merge)
│   └── utils.test.ts                    # Unit tests kiểm tra tiện ích
│
└── types/                               # GLOBAL DOMAIN TYPES
    └── commerce.ts                      # RoomType, SpatialProblem, OrderStatus, DemoOrder
```

