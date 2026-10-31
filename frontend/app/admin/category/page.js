"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Category() {
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCategory = async () => {
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
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const deleteCategory = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá danh mục này không?")) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
        fetchCategory();
      } catch (err) {
        alert("Lỗi khi xóa danh mục: " + err.message);
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Danh mục sản phẩm</h3>
        <div>
          <Link href="/admin/category" className="btn btn-outline-success rounded-0 me-2">
            Quản lý danh mục
          </Link>
          <Link href="/admin/category/add" className="btn btn-primary rounded-0">
            Thêm danh mục
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-box"></i>
                {totalProducts}
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
                {data.length}
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
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data.map((category) => {
                const id = category.id || category._id;
                return (
                  <tr key={id}>
                    <td className="text-start">
                      <strong>{category.name}</strong>
                    </td>
                    <td>{category.description || "-"}</td>
                    <td>
                      <Link
                        href={`/admin/category/update/${id}`}
                        className="btn btn-outline-warning btn-sm me-2"
                      >
                        <i className="fas fa-pencil fa-fw"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteCategory(id)}
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
