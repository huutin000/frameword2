import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="site-container py-5 text-center">
        <div className="alert alert-warning p-4 shadow-sm rounded-3">
          <h4 className="alert-heading">⚠️ Chưa nhận được biến môi trường</h4>
          <p>Hệ thống đang thiếu cấu hình Supabase trong file <code>frontend/.env.local</code>.</p>
        </div>
      </div>
    );
  }

  let dienthoai = [];
  let laptop = [];
  let allProducts = [];

  try {
    const supabase = createClient();

    // 1. Lấy toàn bộ sản phẩm
    const { data: productsData } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    allProducts = productsData || [];

    // 2. Lấy sản phẩm Điện thoại
    dienthoai = allProducts.filter((p) => {
      const catName = p.categories?.name || "";
      return /điện thoại|phone|iphone|samsung/i.test(catName + " " + p.name);
    });

    // 3. Lấy sản phẩm Laptop
    laptop = allProducts.filter((p) => {
      const catName = p.categories?.name || "";
      return /laptop|macbook|asus|dell/i.test(catName + " " + p.name);
    });

    // Fallback: nếu chưa phân loại theo tên thì chia đều sản phẩm
    if (dienthoai.length === 0 && laptop.length === 0 && allProducts.length > 0) {
      dienthoai = allProducts.slice(0, 4);
      laptop = allProducts.slice(4, 8);
    }
  } catch (error) {
    console.error("Lỗi truy vấn dữ liệu trang chủ:", error);
  }

  const categoryCards = [
    { name: "Điện thoại", icon: "fa-mobile-screen", link: "/product?cat=phone" },
    { name: "Laptop", icon: "fa-laptop", link: "/product?cat=laptop" },
    { name: "Tablet", icon: "fa-tablet-screen-button", link: "/product?cat=tablet" },
    { name: "Smartwatch", icon: "fa-clock", link: "/product?cat=watch" },
    { name: "Tai nghe & Loa", icon: "fa-headphones", link: "/product?cat=audio" },
    { name: "Màn hình & PC", icon: "fa-desktop", link: "/product?cat=pc" },
    { name: "Cáp sạc & Pin", icon: "fa-battery-full", link: "/product?cat=battery" },
    { name: "Gaming Gear", icon: "fa-gamepad", link: "/product?cat=gaming" },
  ];

  return (
    <div className="site-container">
      {/* 1. Hero Section (2026 Tech Flagship Layout) */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Main Hero Card */}
          <div className="hero-main-card">
            <div className="hero-main-content">
              <span className="hero-tag">Flagship Tech 2026</span>
              <h1 className="hero-title">Đỉnh Cao Công Nghệ, Trải Nghiệm Khác Biệt</h1>
              <p className="hero-desc">
                Sở hữu thế hệ iPhone 15 Pro Max & MacBook M3 chính hãng với ưu đãi thu cũ đổi mới trợ giá tới 4.000.000đ. Trả góp 0% lãi suất.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/product" className="hero-btn-primary">
                  <span>Khám phá ngay</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link href="/about" className="btn btn-outline-light px-4 py-2 fw-semibold rounded">
                  Xem đặc quyền
                </Link>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                src="/asset/image/top-card.webp"
                alt="Flagship Tech"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* Secondary Spotlight Promotional Cards */}
          <div className="hero-side-cards">
            <div className="hero-promo-card">
              <div className="promo-card-content">
                <span className="badge bg-danger-subtle text-danger fw-bold mb-1">HOT DEAL</span>
                <h4>Laptop Gaming 2026</h4>
                <p>Hiệu năng vượt trội, đồ họa đỉnh cao với chip RTX mới nhất.</p>
                <Link href="/product" className="promo-card-link">
                  <span>Mua ngay</span>
                  <i className="fa-solid fa-chevron-right small"></i>
                </Link>
              </div>
              <img src="/asset/image/laptop1.png" alt="Laptop Gaming" className="promo-card-image" />
            </div>

            <div className="hero-promo-card">
              <div className="promo-card-content">
                <span className="badge bg-primary-subtle text-primary fw-bold mb-1">ÂM THANH</span>
                <h4>Tai nghe & Loa Hi-Res</h4>
                <p>Khử tiếng ồn chủ động, âm thanh không gian sống động.</p>
                <Link href="/product" className="promo-card-link">
                  <span>Khám phá</span>
                  <i className="fa-solid fa-chevron-right small"></i>
                </Link>
              </div>
              <img src="/asset/image/dienthoai1.png" alt="Phụ kiện" className="promo-card-image" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Highlights Bar */}
      <section className="trust-bar" aria-label="Cam kết dịch vụ">
        <div className="trust-item">
          <div className="trust-icon">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div className="trust-text">
            <h6>Giao Hàng Siêu Tốc 2H</h6>
            <p>Nhận hàng nhanh chóng nội thành</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <i className="fa-solid fa-shield-check"></i>
          </div>
          <div className="trust-text">
            <h6>100% Hàng Chính Hãng</h6>
            <p>Bảo hành chính hãng toàn quốc</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <i className="fa-solid fa-rotate-left"></i>
          </div>
          <div className="trust-text">
            <h6>1 Đổi 1 Trong 30 Ngày</h6>
            <p>Nếu phát sinh lỗi từ nhà sản xuất</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <i className="fa-solid fa-credit-card"></i>
          </div>
          <div className="trust-text">
            <h6>Trả Góp 0% Lãi Suất</h6>
            <p>Hỗ trợ đa dạng thẻ tín dụng & cty tài chính</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Showcase */}
      <section className="mb-5">
        <div className="section-header">
          <div className="section-title-wrap">
            <div className="section-indicator"></div>
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
          </div>
          <Link href="/product" className="section-view-all">
            <span>Xem tất cả</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="category-grid">
          {categoryCards.map((cat, idx) => (
            <Link href={cat.link} className="category-card" key={idx}>
              <div className="category-card-icon">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className="category-card-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flash Sale Hot Deal Section */}
      <section className="flash-sale-section">
        <div className="flash-sale-header">
          <div className="flash-title">
            <i className="fa-solid fa-fire text-danger fs-4"></i>
            <span>FLASH SALE GIÁ SỐC HÔM NAY</span>
          </div>
          <div className="flash-timer">
            <span>Kết thúc sau:</span>
            <span className="timer-box">08</span> :
            <span className="timer-box">45</span> :
            <span className="timer-box">12</span>
          </div>
        </div>

        <ProductCard data={allProducts.slice(0, 4)} />
      </section>

      {/* 5. Featured Smartphones Section */}
      <section className="mb-5">
        <div className="section-header">
          <div className="section-title-wrap">
            <div className="section-indicator"></div>
            <h2 className="section-title">Điện Thoại Thông Minh Nổi Bật</h2>
          </div>
          <Link href="/product" className="section-view-all">
            <span>Xem thêm điện thoại</span>
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        <ProductCard data={dienthoai.length > 0 ? dienthoai : allProducts.slice(0, 4)} />
      </section>

      {/* 6. Featured Laptops Section */}
      <section className="mb-5">
        <div className="section-header">
          <div className="section-title-wrap">
            <div className="section-indicator"></div>
            <h2 className="section-title">Laptop & Máy Tính Bán Chạy</h2>
          </div>
          <Link href="/product" className="section-view-all">
            <span>Xem thêm laptop</span>
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        <ProductCard data={laptop.length > 0 ? laptop : allProducts.slice(0, 4)} />
      </section>

      {/* 7. Promotional Callout Banner */}
      <section className="mb-5 p-4 rounded-4 text-white" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="badge bg-primary px-3 py-2 mb-2 fw-bold">CHƯƠNG TRÌNH ĐẶC QUYỀN</span>
            <h3 className="fw-bold mb-2">Ưu đãi sinh viên & Cán bộ giáo dục</h3>
            <p className="text-secondary mb-0" style={{ color: "#94a3b8" }}>
              Giảm thêm tới 500.000đ khi mua laptop hoặc tablet. Tặng thêm 1 năm bảo hành mở rộng chính hãng.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link href="/about" className="btn btn-primary btn-lg px-4 fw-semibold rounded-3 shadow">
              Đăng ký nhận ưu đãi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
