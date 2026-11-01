"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Leftbar() {
  const pathname = usePathname();

  const isExactActive = (path) => pathname === path;
  const isSectionActive = (path) => pathname.startsWith(path);

  return (
    <div className="admin-sidebar-menu">
      {/* Group 1: Overview */}
      <div>
        <div className="admin-menu-group-title">TỔNG QUAN</div>
        <ul className="admin-menu-list">
          <li>
            <Link
              href="/admin"
              className={`admin-nav-item ${isExactActive("/admin") ? "active" : ""}`}
            >
              <i className="fa-solid fa-gauge-high"></i>
              <span>Bảng điều khiển</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Group 2: Catalog */}
      <div>
        <div className="admin-menu-group-title">QUẢN LÝ CỬA HÀNG</div>
        <ul className="admin-menu-list">
          <li>
            <Link
              href="/admin/product"
              className={`admin-nav-item ${isSectionActive("/admin/product") ? "active" : ""}`}
            >
              <i className="fa-solid fa-box-archive"></i>
              <span>Sản phẩm</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/category"
              className={`admin-nav-item ${isSectionActive("/admin/category") ? "active" : ""}`}
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>Danh mục</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Group 3: System */}
      <div>
        <div className="admin-menu-group-title">HỆ THỐNG</div>
        <ul className="admin-menu-list">
          <li>
            <Link
              href="/admin/register"
              className={`admin-nav-item ${isExactActive("/admin/register") ? "active" : ""}`}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Thêm Admin</span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              target="_blank"
              className="admin-nav-item"
            >
              <i className="fa-solid fa-store"></i>
              <span>Trang Storefront</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
