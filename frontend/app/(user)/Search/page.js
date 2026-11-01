import React from "react";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const keyword = searchParams?.keyword || "";
  let productSearch = [];
  let errorMsg = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .ilike("name", `%${keyword}%`);

    if (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      errorMsg = error.message;
    } else {
      productSearch = data || [];
    }
  } catch (err) {
    console.error("Lỗi kết nối tìm kiếm:", err);
    errorMsg = err.message;
  }

  return (
    <div className="site-container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small text-muted">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none">
              <i className="fa-solid fa-house me-1"></i> Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/product" className="text-decoration-none">
              Sản phẩm
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            Tìm kiếm
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>
            Kết Quả Tìm Kiếm: &ldquo;{keyword}&rdquo;
          </h1>
          <p className="text-muted small mb-0">
            Tìm thấy <strong>{productSearch.length}</strong> sản phẩm phù hợp trên hệ thống KOVIQO
          </p>
        </div>
        <Link href="/product" className="btn btn-outline-secondary btn-sm rounded-3">
          Xem tất cả danh mục
        </Link>
      </div>

      {productSearch.length === 0 ? (
        <EmptyState
          icon="search"
          title={`Không tìm thấy kết quả nào cho "${keyword}"`}
          description="Hãy thử kiểm tra lại lỗi chính tả, sử dụng từ khóa ngắn gọn hơn hoặc tham khảo các dòng sản phẩm phổ biến."
          actionLabel="Xem toàn bộ sản phẩm"
          actionHref="/product"
        />
      ) : (
        <ProductCard data={productSearch} />
      )}
    </div>
  );
}
