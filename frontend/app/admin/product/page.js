"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";

export default function Product() {
  const [data, setData] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);

  const fetchProducts = async () => {
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
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        fetchProducts();
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm: " + err.message);
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Sản phẩm</h3>
        <div>
          <Link href="/admin/category" className="btn btn-outline-success rounded-0 me-2">
            Quản lý danh mục
          </Link>
          <Link href="/admin/product/add" className="btn btn-primary rounded-0">
            Thêm sản phẩm
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-box"></i>
                {data.length}
              </div>
              TỔNG SẢN PHẨM
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-0 rounded-0 bg-success-subtle text-success">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-boxes"></i>
                {totalCategories}
              </div>
              DANH MỤC
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-0 border-0 shadow-sm">
        <div className="card-body">
          <table className="table text-center">
            <thead>
              <tr>
                <th className="text-start" colSpan="2">
                  Sản phẩm
                </th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data.map((product, index) => {
                const id = product.id || product._id;
                const categoryName = product.categories?.name || product.category?.categoryName || "Chưa phân loại";

                return (
                  <tr key={id}>
                    <td style={{ width: 64 + "px" }}>
                      <img
                        src={getImageUrl(product.image)}
                        className="w-100 rounded"
                        alt={product.name}
                        style={{ maxHeight: "64px", objectFit: "contain" }}
                      />
                    </td>
                    <td className="text-start">
                      <strong>{product.name}</strong>
                      <br />
                      <small className="text-muted">
                        Danh mục: <strong>{categoryName}</strong>
                      </small>
                    </td>
                    <td>
                      {Number(product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      {product.del && Number(product.del) > 0 && (
                        <>
                          <br />
                          <del className="text-muted small">
                            {Number(product.del).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </del>
                        </>
                      )}
                    </td>
                    <td>{product.quantity}</td>
                    <td style={{ maxWidth: 300 + "px" }} className="text-truncate">
                      {product.description}
                    </td>
                    <td>
                      <Link href={`/admin/product/update/${id}`} className="btn btn-outline-warning btn-sm me-2">
                        <i className="fas fa-pencil fa-fw"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteProduct(id)}
                      >
                        <i className="fas fa-times fa-fw"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
