"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    loading: true,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClient();

        // 1. Fetch counts
        const [{ count: pCount }, { count: cCount }] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
        ]);

        // 2. Fetch recent products
        const { data: latest } = await supabase
          .from("products")
          .select("*, categories(name)")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          productsCount: pCount || 0,
          categoriesCount: cCount || 0,
          loading: false,
        });
        setRecentProducts(latest || []);
      } catch (err) {
        console.error("Lỗi nạp dữ liệu dashboard:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Bảng điều khiển</h1>
          <p className="text-muted small mb-0">
            Tổng quan hệ thống thương mại điện tử NEXUSTECH
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/product/add" className="btn btn-primary btn-sm fw-semibold">
            <i className="fa-solid fa-plus me-1"></i> Thêm sản phẩm
          </Link>
          <Link href="/admin/category/add" className="btn btn-outline-primary btn-sm fw-semibold">
            <i className="fa-solid fa-folder-plus me-1"></i> Thêm danh mục
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="row g-3 mb-4">
        {/* Products Stat */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">
                {stats.loading ? "..." : stats.productsCount}
              </div>
              <div className="admin-stat-label">Tổng sản phẩm</div>
            </div>
            <div className="admin-stat-icon bg-primary-subtle text-primary">
              <i className="fa-solid fa-box-archive"></i>
            </div>
          </div>
        </div>

        {/* Categories Stat */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">
                {stats.loading ? "..." : stats.categoriesCount}
              </div>
              <div className="admin-stat-label">Danh mục thiết bị</div>
            </div>
            <div className="admin-stat-icon bg-success-subtle text-success">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value text-success" style={{ fontSize: "1.5rem" }}>
                100%
              </div>
              <div className="admin-stat-label">Database Health</div>
            </div>
            <div className="admin-stat-icon bg-info-subtle text-info">
              <i className="fa-solid fa-server"></i>
            </div>
          </div>
        </div>

        {/* Next.js Core */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value text-dark" style={{ fontSize: "1.25rem" }}>
                App Router
              </div>
              <div className="admin-stat-label">Next.js 14.2 LTS</div>
            </div>
            <div className="admin-stat-icon bg-warning-subtle text-warning">
              <i className="fa-solid fa-code"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2 className="h5 fw-bold text-dark mb-1">Thao tác quản lý nhanh</h2>
            <p className="text-muted small mb-0">Truy cập các tác vụ thường dùng trong 1 click chuột</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link href="/admin/product" className="btn btn-light btn-sm border fw-semibold">
              <i className="fa-solid fa-list me-1 text-primary"></i> Xem kho hàng
            </Link>
            <Link href="/admin/category" className="btn btn-light btn-sm border fw-semibold">
              <i className="fa-solid fa-tags me-1 text-success"></i> Quản lý danh mục
            </Link>
            <Link href="/admin/register" className="btn btn-light btn-sm border fw-semibold">
              <i className="fa-solid fa-user-shield me-1 text-warning"></i> Thêm tài khoản quản trị
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <h2 className="h6 fw-bold text-dark mb-0">Sản phẩm mới cập nhật gần đây</h2>
            <span className="text-muted small">5 sản phẩm gần nhất được lưu trong cơ sở dữ liệu</span>
          </div>
          <Link href="/admin/product" className="btn btn-outline-primary btn-sm fw-semibold">
            Xem tất cả <i className="fa-solid fa-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th style={{ width: "100px" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Chưa có sản phẩm nào được tạo.
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => {
                  const id = p.id || p._id;
                  const price = Number(p.price) || 0;
                  return (
                    <tr key={id}>
                      <td>
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.name}
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "contain",
                            borderRadius: "6px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">{p.name}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {p.categories?.name || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        {price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            (p.quantity || 0) > 0
                              ? "bg-success-subtle text-success border border-success-subtle"
                              : "bg-danger-subtle text-danger border border-danger-subtle"
                          }`}
                        >
                          {(p.quantity || 0) > 0 ? `Còn ${p.quantity}` : "Hết hàng"}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/product/update/${id}`}
                          className="btn btn-outline-secondary btn-sm px-2 py-1"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
