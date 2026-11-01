"use client";

import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/store";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";

export default function DetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { success } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name)")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="site-container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Đang tải chi tiết...</span>
        </div>
        <p className="text-muted fw-semibold">Đang tải thông tin sản phẩm KOVIQO...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="site-container py-5">
        <EmptyState
          icon="error"
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh trên hệ thống KOVIQO."
          actionLabel="Quay lại danh mục sản phẩm"
          actionHref="/product"
        />
      </div>
    );
  }

  const currentPrice = Number(product.price) || 0;
  const originalPrice = Number(product.del) || 0;
  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const categoryName = product.categories?.name || "Thiết bị công nghệ";

  const handleAddToCart = () => {
    dispatch(addToCart({ item: product, quantity: quantity }));
    success(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`, "Giỏ Hàng");
  };

  return (
    <div className="site-container py-4">
      {/* Breadcrumbs */}
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
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Detail Grid */}
      <div className="detail-layout">
        {/* Left: Product Media Gallery */}
        <div className="detail-gallery-card">
          <div className="detail-image-box">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="detail-main-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/brand/product-placeholder.svg";
              }}
            />
          </div>
          <div className="detail-badges-row mt-3">
            <span className="badge bg-primary-subtle text-primary p-2">
              <i className="fa-solid fa-shield-check me-1"></i> 100% Chính hãng
            </span>
            <span className="badge bg-success-subtle text-success p-2">
              <i className="fa-solid fa-rotate-left me-1"></i> 1 đổi 1 30 ngày
            </span>
            <span className="badge bg-warning-subtle text-warning p-2">
              <i className="fa-solid fa-bolt-lightning me-1"></i> Giao 2h
            </span>
          </div>
        </div>

        {/* Right: Product Meta & Purchase */}
        <div className="detail-info-card">
          <span className="badge bg-secondary-subtle text-secondary mb-2">
            {categoryName}
          </span>

          <h1 className="detail-product-title">{product.name}</h1>

          {/* Rating */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="text-warning small">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star-half-stroke"></i>
            </div>
            <span className="small text-muted fw-semibold">4.9 (128 đánh giá)</span>
            <span className="text-muted">|</span>
            <span className="small text-success fw-semibold">Còn hàng tại Showroom</span>
          </div>

          {/* Price Box */}
          <div className="detail-price-box">
            <div className="d-flex align-items-baseline gap-3">
              <span className="detail-price-current">
                {currentPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              {originalPrice > currentPrice && (
                <>
                  <del className="detail-price-del">
                    {originalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </del>
                  <span className="badge bg-danger fw-bold">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
            {originalPrice > currentPrice && (
              <p className="small text-success fw-bold mt-1 mb-0">
                Tiết kiệm {(originalPrice - currentPrice).toLocaleString("vi-VN")}đ khi mua hôm nay
              </p>
            )}
          </div>

          {/* Quantity Stepper */}
          <div className="detail-quantity-group mb-4">
            <label className="fw-semibold small text-muted d-block mb-2">Số lượng:</label>
            <div className="d-flex align-items-center gap-3">
              <div className="cart-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Giảm số lượng"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  className="stepper-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  aria-label="Số lượng sản phẩm"
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
              <span className="small text-muted">Có sẵn tại kho TP.HCM & Hà Nội</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              className="btn btn-primary btn-lg flex-grow-1 fw-bold rounded-3 shadow-sm py-3"
              onClick={handleAddToCart}
            >
              <i className="fa-solid fa-cart-plus me-2"></i>
              Thêm Vào Giỏ Hàng
            </button>
            <Link
              href="/cart"
              className="btn btn-danger btn-lg px-4 fw-bold rounded-3 shadow-sm py-3"
              onClick={handleAddToCart}
            >
              Mua Ngay
            </Link>
          </div>

          {/* Purchase Perks */}
          <div className="detail-perks p-3 rounded-3 bg-light border small">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fa-solid fa-check-circle text-primary"></i>
              <span>Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp sạc chính hãng</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fa-solid fa-check-circle text-primary"></i>
              <span>Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền toàn quốc</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-check-circle text-primary"></i>
              <span>Đổi mới trong 30 ngày đầu nếu phát sinh lỗi từ nhà sản xuất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <section className="detail-desc-card mt-5">
        <h3 className="fw-bold mb-3">Mô Tả & Thông Tin Chi Tiết</h3>
        <div className="detail-desc-content">
          <p>{product.description || "Thông tin chi tiết về sản phẩm đang được cập nhật."}</p>
        </div>
      </section>
    </div>
  );
}
