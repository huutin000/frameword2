import "@/public/style/globals.css";
import "@/public/bootstrap/css/bootstrap.min.css";
import Leftbar from "./Leftbar";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "NEXUS Admin — Hệ thống quản trị NEXUSTECH",
  description: "Bảng điều khiển quản trị sản phẩm, danh mục và đơn hàng.",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <div className="admin-shell">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
              <div className="admin-brand-icon">
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <div>
                <div className="admin-brand-title">NEXUS<strong>ADMIN</strong></div>
                <div className="admin-brand-subtitle">Console v2.6</div>
              </div>
            </div>

            <Leftbar />

            <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
              <div className="d-flex align-items-center justify-content-between text-muted small">
                <span>Database:</span>
                <span className="badge bg-success-subtle text-success">
                  <i className="fa-solid fa-circle me-1" style={{ fontSize: "6px" }}></i>Online
                </span>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <div className="admin-content-area">
            {/* Topbar */}
            <header className="admin-topbar">
              <div className="admin-search-wrapper">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  placeholder="Tìm nhanh sản phẩm, danh mục..."
                  className="admin-search-input"
                />
              </div>

              <div className="d-flex align-items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  className="btn btn-outline-secondary btn-sm fw-semibold d-flex align-items-center gap-2"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  <span>Xem Storefront</span>
                </Link>

                <div className="admin-user-pill">
                  <div className="admin-avatar">AD</div>
                  <span className="d-none d-md-inline">Quản trị viên</span>
                </div>

                <Link
                  href="/admin/login"
                  className="btn btn-outline-danger btn-sm"
                  title="Đăng xuất khỏi phiên quản trị"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </Link>
              </div>
            </header>

            {/* Canvas */}
            <main className="admin-page-container">
              {children}
            </main>
          </div>
        </div>
        <Script src="/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
