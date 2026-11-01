"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminCategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(categories || []);

      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      setTotalProducts(count || 0);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
        setData((prev) => prev.filter((c) => (c.id || c._id) !== id));
      } catch (err) {
        alert("Lỗi khi xóa danh mục: " + err.message);
      }
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Quản lý Danh mục</h1>
          <p className="text-muted small mb-0">
            Quản lý nhóm phân loại thiết bị công nghệ (Điện thoại, Laptop, Tablet, Phụ kiện,...)
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/product" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="fa-solid fa-box-archive me-1"></i> Xem sản phẩm
          </Link>
          <Link href="/admin/category/add" className="btn btn-primary btn-sm fw-semibold">
            <i className="fa-solid fa-plus me-1"></i> Thêm danh mục
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">{data.length}</div>
              <div className="admin-stat-label">Tổng danh mục</div>
            </div>
            <div className="admin-stat-icon bg-primary-subtle text-primary">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">{totalProducts}</div>
              <div className="admin-stat-label">Sản phẩm thuộc danh mục</div>
            </div>
            <div className="admin-stat-icon bg-success-subtle text-success">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <span className="fw-bold text-dark">Danh sách phân loại ({data.length})</span>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Mã ID</th>
                <th>Tên danh mục</th>
                <th>Ngày khởi tạo</th>
                <th className="text-end" style={{ width: "120px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Đang nạp danh mục...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Chưa có danh mục nào được khởi tạo.
                  </td>
                </tr>
              ) : (
                data.map((cat) => {
                  const id = cat.id || cat._id;
                  const dateStr = cat.created_at
                    ? new Date(cat.created_at).toLocaleDateString("vi-VN")
                    : "—";

                  return (
                    <tr key={id}>
                      <td>
                        <span className="badge bg-light text-muted border font-monospace">
                          #{id}
                        </span>
                      </td>
                      <td>
                        <strong className="text-dark">{cat.name}</strong>
                      </td>
                      <td className="text-muted small">{dateStr}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            href={`/admin/category/update/${id}`}
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                            title="Chỉnh sửa danh mục"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteCategory(id, cat.name)}
                            className="btn btn-outline-danger btn-sm px-2 py-1"
                            title="Xóa danh mục"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
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
