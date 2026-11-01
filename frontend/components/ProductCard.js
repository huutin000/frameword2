"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import { useToast } from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";

export default function ProductCard({ data }) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [addedId, setAddedId] = useState(null);

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="box"
        title="Chưa có sản phẩm phù hợp"
        description="Hiện danh mục này chưa có sản phẩm nào khả dụng. Quý khách vui lòng xem qua các sản phẩm khác hoặc quay lại sau."
        actionLabel="Khám phá tất cả sản phẩm"
        actionHref="/product"
      />
    );
  }

  const handleAddToCart = (product) => {
    const id = product.id || product._id;
    dispatch(addToCart({ item: product, quantity: 1 }));
    setAddedId(id);
    success(`Đã thêm "${product.name}" vào giỏ hàng!`, "Giỏ Hàng");
    setTimeout(() => {
      setAddedId(null);
    }, 1800);
  };

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/brand/product-placeholder.svg";
  };

  return (
    <div className="product-grid">
      {data.map((product) => {
        const id = product.id || product._id;
        const { name, price, del, image, categories } = product;
        const currentPrice = Number(price) || 0;
        const originalPrice = Number(del) || 0;
        const discountPercent =
          originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0;

        const categoryName =
          typeof categories === "object" ? categories?.name : categories;

        return (
          <div className="product-card" key={id}>
            {/* Badges */}
            <div className="card-badges">
              {discountPercent > 0 && (
                <span className="badge-tag badge-deal">
                  -{discountPercent}%
                </span>
              )}
              <span className="badge-tag badge-installment">
                Trả góp 0%
              </span>
            </div>

            {/* Thumbnail */}
            <Link href={`/product-detail/${id}`} className="card-thumbnail-wrap">
              <img
                src={getImageUrl(image)}
                alt={name}
                className="card-thumbnail"
                loading="lazy"
                onError={handleImageError}
              />
            </Link>

            {/* Content */}
            <div className="card-body">
              {categoryName && (
                <span className="card-category-tag">{categoryName}</span>
              )}

              <Link href={`/product-detail/${id}`} className="card-title" title={name}>
                {name}
              </Link>

              {/* Pricing */}
              <div className="card-pricing">
                <span className="price-current">
                  {currentPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>

                {originalPrice > currentPrice && (
                  <div className="price-del-wrap">
                    <span className="price-del">
                      {originalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span className="price-discount-percent">
                      Tiết kiệm {(originalPrice - currentPrice).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                className="btn-add-cart dat-hang"
                onClick={() => handleAddToCart(product)}
                aria-label={`Thêm ${name} vào giỏ hàng`}
              >
                {addedId === id ? (
                  <>
                    <i className="fa-solid fa-check text-success"></i>
                    <span className="text-success fw-bold">Đã thêm vào giỏ!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-plus"></i>
                    <span>Thêm vào giỏ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
