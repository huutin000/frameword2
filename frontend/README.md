# Shop-Ecommerce — Modernized Next.js & Supabase Architecture

Dự án thương mại điện tử đã được tái cấu trúc và hiện đại hoá toàn diện từ kiến trúc legacy nguyên khối (Express/MongoDB) sang nền tảng Next.js App Router kết hợp Supabase BaaS (Postgres, Storage, Auth), Redux Toolkit thuần khiết, và bộ kiểm thử tự động (Vitest + Playwright).

---

## 1. Cấu trúc Thư mục Chuẩn hoá Tiếng Anh (English Modular Structure)

```text
frontend/
├── app/                        # Next.js App Router (Public routes & page entry points)
│   ├── (user)/                 # Route group người dùng cuối
│   │   ├── page.js             # Trang chủ (/)
│   │   ├── layout.js           # Root layout với StoreProvider & Script loading
│   │   ├── cart/               # Giỏ hàng (/cart)
│   │   ├── product/            # Danh sách sản phẩm (/product)
│   │   ├── product-detail/[id] # Chi tiết sản phẩm (/product-detail/:id)
│   │   ├── search/             # Tìm kiếm sản phẩm (/search)
│   │   ├── login/              # Đăng nhập (/login)
│   │   ├── register/           # Đăng ký (/register)
│   │   ├── info/               # Thông tin tài khoản (/info)
│   │   ├── about/              # Trang giới thiệu (/about)
│   │   └── contact/            # Trang liên hệ (/contact)
│   └── admin/                  # Quản trị viên (/admin/*)
│       ├── page.js             # Dashboard admin (/admin)
│       ├── layout.js           # Admin layout
│       ├── Leftbar.js          # Menu điều hướng bên trái Admin
│       ├── login/              # Đăng nhập admin (/admin/login)
│       ├── register/           # Đăng ký admin (/admin/register)
│       ├── category/           # Quản lý danh mục
│       │   ├── page.js         # Danh sách danh mục (/admin/category)
│       │   ├── add/            # Thêm danh mục (/admin/category/add)
│       │   └── update/[id]/    # Cập nhật danh mục (/admin/category/update/:id)
│       └── product/            # Quản lý sản phẩm
│           ├── page.js         # Danh sách sản phẩm (/admin/product)
│           ├── add/            # Thêm sản phẩm (/admin/product/add)
│           └── update/[id]/    # Cập nhật sản phẩm (/admin/product/update/:id)
├── components/                 # Reusable UI Components
│   ├── Header.js               # Thanh điều hướng, tìm kiếm & giỏ hàng
│   ├── Footer.js               # Chân trang & thông tin liên hệ
│   └── ProductCard.js          # Card hiển thị sản phẩm & nút thêm vào giỏ
├── lib/                        # Singletons & Domain Helpers
│   ├── image.js                # Helper ảnh Supabase / Local Fallback
│   ├── store/                  # Redux Toolkit thuần khiết (StoreProvider, storage, cartSlice)
│   └── supabase/               # Supabase Client SDK (client.js, server.js)
├── middleware.js               # Route guard bảo vệ trang /info
├── tests/                      # Testing Suite
│   ├── unit/                   # 18 Vitest unit tests (cart reducers, persistence, image helper)
│   └── e2e/                    # 3 Playwright browser E2E test suites (cart lifecycle & routes)
├── next.config.mjs             # Next.js Config tích hợp Rewrites tương thích ngược
├── vitest.config.mjs           # Cấu hình Vitest
└── playwright.config.js        # Cấu hình Playwright
```

---

## 2. Chuẩn hoá Route & Tương thích ngược (Backward Compatibility Rewrites)

Tất cả các route tiếng Việt và không chuẩn đã được đổi tên sang tiếng Anh chuẩn RESTful/Next.js conventions:
- `/gioithieu` ➔ `/about`
- `/Search` ➔ `/search`
- `/login/dangnhap` ➔ `/login`
- `/login/dangky` ➔ `/register`
- `/admin/category/addcate` ➔ `/admin/category/add`
- `/admin/category/updatecate/:id` ➔ `/admin/category/update/:id`
- `/admin/login/dangnhap` ➔ `/admin/login`
- `/admin/login/dangky` ➔ `/admin/register`

Cấu hình `rewrites` trong `next.config.mjs` bảo đảm nếu người dùng truy cập các URL cũ thì server vẫn phục vụ đúng trang mà không bị lỗi 404.

---

## 3. Lệnh Kiểm thử & Phát triển

```bash
# Khởi động môi trường phát triển
npm run dev

# Kiểm tra cú pháp (ESLint)
npm run lint

# Chạy Unit Tests (Vitest)
npm test

# Chạy Browser E2E Tests (Playwright)
npm run test:e2e

# Đóng gói ứng dụng Production
npm run build

# Chạy Production Server
npm start
```
