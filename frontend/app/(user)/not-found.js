import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-container py-5 text-center">
      <div className="error-card mx-auto" style={{ maxWidth: "560px" }}>
        <div className="error-badge mb-3">
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold">
            LỖI 404 — KHÔNG TÌM THẤY TRANG
          </span>
        </div>

        {/* Geometric Tech 404 Illustration */}
        <div className="error-illustration my-4">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>

        <h1 className="fw-black mb-2" style={{ fontSize: "2rem", color: "var(--text-primary)" }}>
          Trang Bạn Tìm Kiếm Không Tồn Tại
        </h1>
        <p className="text-secondary mb-4" style={{ fontSize: "0.95rem" }}>
          Đường dẫn có thể đã thay đổi hoặc không còn khả dụng trên hệ thống KOVIQO. Vui lòng kiểm tra lại địa chỉ hoặc khám phá các danh mục nổi bật dưới đây.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <Link href="/" className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
            <i className="fa-solid fa-house me-2"></i>
            Về Trang Chủ
          </Link>
          <Link href="/product" className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-semibold">
            <i className="fa-solid fa-grid-2 me-2"></i>
            Xem Sản Phẩm
          </Link>
        </div>

        {/* Quick Search Help */}
        <div className="p-3 bg-light rounded-3 text-start small">
          <span className="fw-bold text-dark d-block mb-1">Gợi ý tìm kiếm phổ biến:</span>
          <div className="d-flex flex-wrap gap-2">
            <Link href="/search?keyword=iPhone" className="badge bg-white text-secondary border text-decoration-none p-2">iPhone 15</Link>
            <Link href="/search?keyword=MacBook" className="badge bg-white text-secondary border text-decoration-none p-2">MacBook Pro</Link>
            <Link href="/search?keyword=Samsung" className="badge bg-white text-secondary border text-decoration-none p-2">Galaxy S24</Link>
            <Link href="/search?keyword=Tai+nghe" className="badge bg-white text-secondary border text-decoration-none p-2">Tai nghe Hi-Res</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

