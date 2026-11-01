"use client";

import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "@/lib/store";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const { info, success } = useToast();
  const rawItems = useSelector((state) => state.cart?.items);
  const cartItems = useMemo(() => rawItems || [], [rawItems]);

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      ),
    [cartItems]
  );

  const shippingFee = subtotal > 5000000 || subtotal === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "KOVIQO2026") {
      setDiscountAmount(200000);
      success("Đã áp dụng mã giảm giá 200.000đ từ KOVIQO!", "Mã giảm giá");
    } else {
      info("Mã giảm giá dùng thử: KOVIQO2026", "Thông báo voucher");
    }
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    info(`Đã xóa sản phẩm "${name || 'khỏi giỏ'}"`, "Giỏ Hàng");
  };

  if (cartItems.length === 0) {
    return (
      <div className="site-container py-5">
        <EmptyState
          icon="cart"
          title="Giỏ hàng của bạn đang trống"
          description="Bạn chưa chọn sản phẩm nào. Hãy khám phá hàng ngàn thiết bị công nghệ chính hãng giá tốt tại KOVIQO."
          actionLabel="Khám phá sản phẩm ngay"
          actionHref="/product"
        />
      </div>
    );
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
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            Giỏ hàng ({cartItems.length})
          </li>
        </ol>
      </nav>

      <h1 className="fw-bold mb-4" style={{ fontSize: "1.75rem" }}>
        Giỏ Hàng Của Bạn
      </h1>

      <div className="cart-layout">
        {/* Left Column: Cart Items Table */}
        <div className="cart-items-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "90px" }}>Hình ảnh</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col" style={{ width: "130px" }}>Đơn giá</th>
                  <th scope="col" style={{ width: "120px" }}>Số lượng</th>
                  <th scope="col" style={{ width: "140px" }}>Thành tiền</th>
                  <th scope="col" style={{ width: "80px" }} className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const id = item.id || item._id;
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const itemTotal = itemPrice * itemQty;

                  return (
                    <tr key={id}>
                      <td>
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="cart-item-img border rounded"
                          style={{ width: "70px", height: "70px", objectFit: "contain" }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/brand/product-placeholder.svg";
                          }}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/product-detail/${id}`}
                          className="fw-semibold text-dark text-decoration-none"
                        >
                          {item.name}
                        </Link>
                        <div className="small text-muted mt-1">
                          <span className="badge bg-light text-secondary border">Chính hãng KOVIQO</span>
                        </div>
                      </td>
                      <td>
                        <span className="fw-semibold">
                          {itemPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="cart-stepper">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            className="form-control form-control-sm stepper-input"
                            value={item.quantity}
                            onChange={(e) =>
                              dispatch(
                                updateCartItemQuantity({
                                  id: id,
                                  _id: id,
                                  quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                                })
                              )
                            }
                            aria-label={`Số lượng ${item.name}`}
                          />
                        </div>
                      </td>
                      <td>
                        <strong className="text-primary">
                          {itemTotal.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </strong>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-2 py-1"
                          onClick={() => handleRemove(id, item.name)}
                          aria-label={`Xóa ${item.name}`}
                          title="Xóa sản phẩm"
                        >
                          <i className="fa-solid fa-trash-can me-1"></i>
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <Link href="/product" className="btn btn-outline-secondary btn-sm rounded-3">
              <i className="fa-solid fa-arrow-left me-2"></i> Tiếp tục mua hàng
            </Link>
            <span className="small text-muted">
              <i className="fa-solid fa-shield-check text-success me-1"></i> Miễn phí đổi trả 30 ngày
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-card">
          <h4 className="fw-bold mb-3" style={{ fontSize: "1.25rem" }}>
            Tóm Tắt Đơn Hàng
          </h4>

          {/* Voucher Code Form */}
          <form onSubmit={handleApplyCoupon} className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control form-control-sm rounded-3 text-uppercase"
              placeholder="Mã voucher (KOVIQO2026)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary btn-sm rounded-3 fw-bold">
              Áp dụng
            </button>
          </form>

          <div className="summary-row">
            <span>Tạm tính ({cartItems.length} sản phẩm):</span>
            <span className="fw-semibold">
              {subtotal.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row text-success">
              <span>Giảm giá voucher:</span>
              <span className="fw-semibold">
                -{discountAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          )}

          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>
              {shippingFee === 0 ? (
                <span className="badge bg-success-subtle text-success">Miễn phí</span>
              ) : (
                shippingFee.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              )}
            </span>
          </div>

          <div className="summary-total">
            <span>Tổng cộng:</span>
            <span>
              {finalTotal.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>

          <p className="small text-muted mt-2 mb-3">
            (Đã bao gồm thuế GTGT và phí vận chuyển tiêu chuẩn)
          </p>

          <button
            type="button"
            className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mb-3"
            onClick={() => info("Tính năng thanh toán trực tuyến sẽ mở trong giai đoạn tiếp theo.", "Thông báo đặt hàng")}
          >
            <i className="fa-solid fa-lock me-2"></i>
            Tiến Hành Đặt Hàng
          </button>

          {/* Secure Shopping Badges */}
          <div className="p-3 bg-light rounded-3 small">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fa-solid fa-truck-fast text-primary"></i>
              <span>Giao siêu tốc 2h tại khu vực nội thành</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fa-solid fa-shield-check text-primary"></i>
              <span>Bảo hành chính hãng 12-24 tháng</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-credit-card text-primary"></i>
              <span>Thanh toán khi nhận hàng hoặc trả góp 0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
