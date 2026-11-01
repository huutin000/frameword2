"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";

export default function AdminProductPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCategories, setTotalCategories] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: products, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(products || []);

      const { count } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });
      setTotalCategories(count || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        setData((prev) => prev.filter((p) => (p.id || p._id) !== id));
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm: " + err.message);
      }
    }
  };

  const filteredProducts = data.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Quản lý Sản phẩm</h1>
          <p className="text-muted small mb-0">
            Xem, thêm mới, sửa đổi thông tin và trạng thái tồn kho thiết bị
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/category" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="fa-solid fa-layer-group me-1"></i> Quản lý danh mục
          </Link>
          <Link href="/admin/product/add" className="btn btn-primary btn-sm fw-semibold">
            <i className="fa-solid fa-plus me-1"></i> Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">{data.length}</div>
              <div className="admin-stat-label">Tổng sản phẩm</div>
            </div>
            <div className="admin-stat-icon bg-primary-subtle text-primary">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value">{totalCategories}</div>
              <div className="admin-stat-label">Danh mục phụ trách</div>
            </div>
            <div className="admin-stat-icon bg-success-subtle text-success">
              <i className="fa-solid fa-tags"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold text-dark">Danh sách ({filteredProducts.length})</span>
          </div>

          <div className="d-flex align-items-center gap-2" style={{ maxWidth: "320px", width: "100%" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="fa-solid fa-magnifying-glass text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Lọc theo tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn giá</th>
                <th>Tồn kho</th>
                <th style={{ minWidth: "200px" }}>Mô tả ngắn</th>
                <th className="text-end" style={{ width: "120px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Đang nạp danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    {searchTerm ? "Không tìm thấy sản phẩm khớp từ khóa." : "Chưa có sản phẩm nào trong kho."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const id = item.id || item._id;
                  const price = Number(item.price) || 0;
                  const qty = Number(item.quantity) || 0;

                  return (
                    <tr key={id}>
                      <td>
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{item.name}</div>
                        <span className="text-muted small">ID: {id}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {item.categories?.name || "Chưa phân loại"}
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
                            qty > 0
                              ? "bg-success-subtle text-success border border-success-subtle"
                              : "bg-danger-subtle text-danger border border-danger-subtle"
                          }`}
                        >
                          {qty > 0 ? `Còn ${qty}` : "Hết hàng"}
                        </span>
                      </td>
                      <td>
                        <div
                          className="text-muted small"
                          style={{
                            maxWidth: "280px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description || "Không có mô tả."}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            href={`/admin/product/update/${id}`}
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                            title="Chỉnh sửa"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(id, item.name)}
                            className="btn btn-outline-danger btn-sm px-2 py-1"
                            title="Xóa"
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
