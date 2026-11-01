"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart?.items) || [];
  const cartCount = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const hasToken = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("token="));
    setIsLoggedIn(hasToken);
  }, []);

  return (
    <header className="site-header">
      {/* 1. Utility Top Bar */}
      <div className="header-utility-bar d-none d-md-block">
        <div className="site-container utility-inner">
          <div className="utility-links">
            <span className="utility-link">
              <i className="fa-solid fa-headset text-primary"></i>
              Hotline: <strong>1800 8888</strong> (7:30 - 22:00)
            </span>
            <span className="utility-link">
              <i className="fa-solid fa-truck-fast text-primary"></i>
              Giao nhanh 2h toàn quốc
            </span>
            <span className="utility-link">
              <i className="fa-solid fa-shield-check text-primary"></i>
              Cam kết 100% chính hãng
            </span>
          </div>
          <div className="utility-links">
            <Link href="/about" className="utility-link">Giới thiệu</Link>
            <Link href="/contact" className="utility-link">Hệ thống cửa hàng</Link>
            <Link href="/contact" className="utility-link">Tra cứu bảo hành</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header */}
      <div className="header-main">
        <div className="site-container header-main-inner">
          {/* Brand Logo */}
          <Link href="/" className="brand-logo" aria-label="KOVIQO Homepage"><img src="/brand/koviqo-logo.svg" alt="KOVIQO" className="brand-logo-img" width="170" height="40" /></Link>

          {/* Category Trigger Button */}
          <button
            type="button"
            className={`category-btn ${isMegaOpen ? "active" : ""}`}
            onClick={() => setIsMegaOpen(!isMegaOpen)}
            aria-expanded={isMegaOpen}
          >
            <i className="fa-solid fa-grid-2"></i>
            <span>Danh mục</span>
            <i className={`fa-solid fa-chevron-down ms-1 ${isMegaOpen ? "fa-rotate-180" : ""}`}></i>
          </button>

          {/* Instant Search Bar */}
          <div className="search-container">
            <form action="/search" method="get" className="search-form">
              <input
                className="search-input"
                type="text"
                name="keyword"
                placeholder="Bạn đang tìm điện thoại, laptop, phụ kiện gì?..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="search-btn" aria-label="Tìm kiếm">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          {/* User & Cart Actions */}
          <div className="header-actions">
            {/* Account */}
            <Link
              href={isLoggedIn ? "/info" : "/login"}
              className="header-action-item d-none d-sm-flex"
            >
              <i className="fa-regular fa-user"></i>
              <div className="d-flex flex-direction-column text-start">
                <span className="small text-muted">{isLoggedIn ? "Tài khoản" : "Xin chào,"}</span>
                <span className="fw-bold">{isLoggedIn ? "Hồ sơ cá nhân" : "Đăng nhập"}</span>
              </div>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="header-action-item cart-action-btn cart-action-item"><i className="fa-solid fa-cart-shopping"></i><span className="cart-badge">{cartCount}</span> <span className="d-none d-sm-inline ms-1">Giỏ hàng</span></Link>
          </div>
        </div>
      </div>

      {/* 3. Mega Menu Dropdown */}
      {isMegaOpen && (
        <div className="mega-menu-overlay" onClick={() => setIsMegaOpen(false)}>
          <div className="site-container position-relative">
            <div className="mega-menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="row g-4 p-4">
                <div className="col-md-3 border-end">
                  <h6 className="fw-bold text-dark mb-3">📱 Điện thoại thông minh</h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 small">
                    <li><Link href="/product?cat=Điện thoại" onClick={() => setIsMegaOpen(false)}>iPhone 15 Series / iPhone 16</Link></li>
                    <li><Link href="/product?cat=Điện thoại" onClick={() => setIsMegaOpen(false)}>Samsung Galaxy S24 Ultra</Link></li>
                    <li><Link href="/product?cat=Điện thoại" onClick={() => setIsMegaOpen(false)}>Xiaomi 14 / Redmi Note</Link></li>
                    <li><Link href="/product?cat=Điện thoại" onClick={() => setIsMegaOpen(false)}>OPPO Find X / Reno</Link></li>
                  </ul>
                </div>
                <div className="col-md-3 border-end">
                  <h6 className="fw-bold text-dark mb-3">💻 Laptop & Máy tính</h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 small">
                    <li><Link href="/product?cat=Laptop" onClick={() => setIsMegaOpen(false)}>MacBook Pro / MacBook Air</Link></li>
                    <li><Link href="/product?cat=Laptop" onClick={() => setIsMegaOpen(false)}>ASUS Zenbook / ROG Gaming</Link></li>
                    <li><Link href="/product?cat=Laptop" onClick={() => setIsMegaOpen(false)}>Dell XPS / Inspiron</Link></li>
                    <li><Link href="/product?cat=Laptop" onClick={() => setIsMegaOpen(false)}>Lenovo ThinkPad / Legion</Link></li>
                  </ul>
                </div>
                <div className="col-md-3 border-end">
                  <h6 className="fw-bold text-dark mb-3">🎧 Âm thanh & Phụ kiện</h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 small">
                    <li><Link href="/product" onClick={() => setIsMegaOpen(false)}>AirPods / Galaxy Buds</Link></li>
                    <li><Link href="/product" onClick={() => setIsMegaOpen(false)}>Loa Marshall / JBL</Link></li>
                    <li><Link href="/product" onClick={() => setIsMegaOpen(false)}>Củ sạc nhanh 65W GaN</Link></li>
                    <li><Link href="/product" onClick={() => setIsMegaOpen(false)}>Pin sạc dự phòng 20.000mAh</Link></li>
                  </ul>
                </div>
                <div className="col-md-3">
                  <h6 className="fw-bold text-primary mb-3">⭐ Dịch vụ & Ưu đãi</h6>
                  <div className="bg-light p-3 rounded">
                    <p className="small mb-2 fw-semibold text-dark">Thu cũ đổi mới trợ giá tới 4.000.000đ</p>
                    <p className="small text-muted mb-0">Trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Secondary Category Bar */}
      <nav className="category-nav-bar" aria-label="Danh mục nổi bật">
        <div className="site-container category-nav-inner">
          <Link
            href="/"
            className={`nav-category-link ${pathname === "/" ? "active" : ""}`}
          >
            <i className="fa-solid fa-house"></i>
            Trang chủ
          </Link>
          <Link
            href="/product"
            className={`nav-category-link ${pathname === "/product" ? "active" : ""}`}
          >
            <i className="fa-solid fa-mobile-screen"></i>
            Điện thoại
          </Link>
          <Link
            href="/product"
            className="nav-category-link"
          >
            <i className="fa-solid fa-laptop"></i>
            Laptop
          </Link>
          <Link
            href="/product"
            className="nav-category-link"
          >
            <i className="fa-solid fa-tablet-screen-button"></i>
            Máy tính bảng
          </Link>
          <Link
            href="/product"
            className="nav-category-link"
          >
            <i className="fa-solid fa-clock"></i>
            Đồng hồ
          </Link>
          <Link
            href="/product"
            className="nav-category-link"
          >
            <i className="fa-solid fa-headphones"></i>
            Tai nghe & Loa
          </Link>
          <Link
            href="/product"
            className="nav-category-link"
          >
            <i className="fa-solid fa-keyboard"></i>
            Phụ kiện
          </Link>
          <Link
            href="/about"
            className={`nav-category-link ${pathname === "/about" ? "active" : ""}`}
          >
            <i className="fa-solid fa-circle-info"></i>
            Giới thiệu
          </Link>
          <Link
            href="/contact"
            className={`nav-category-link ${pathname === "/contact" ? "active" : ""}`}
          >
            <i className="fa-solid fa-phone"></i>
            Liên hệ
          </Link>
        </div>
      </nav>

      {/* 5. Mobile Bottom Navigation (Strictly thumb-accessible) */}
      <div className="mobile-bottom-bar" aria-label="Điều hướng di động">
        <Link href="/" className={`mobile-nav-item ${pathname === "/" ? "active" : ""}`}>
          <i className="fa-solid fa-house"></i>
          <span>Trang chủ</span>
        </Link>
        <Link href="/product" className={`mobile-nav-item ${pathname === "/product" ? "active" : ""}`}>
          <i className="fa-solid fa-grid-2"></i>
          <span>Sản phẩm</span>
        </Link>
        <Link href="/search" className={`mobile-nav-item ${pathname === "/search" ? "active" : ""}`}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Tìm kiếm</span>
        </Link>
        <Link href="/cart" className={`mobile-nav-item ${pathname === "/cart" ? "active" : ""}`}>
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Giỏ hàng</span>
          {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
        </Link>
        <Link href={isLoggedIn ? "/info" : "/login"} className={`mobile-nav-item ${pathname === "/login" || pathname === "/info" ? "active" : ""}`}>
          <i className="fa-solid fa-user"></i>
          <span>{isLoggedIn ? "Hồ sơ" : "Tài khoản"}</span>
        </Link>
      </div>
    </header>
  );
}
