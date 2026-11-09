"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Ruler,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useCart } from "../context/cart-context";
import { MAX_CART_ITEM_QUANTITY } from "../utils/quantity";
import { formatVND } from "@/lib/formatters/currency";
import { Button } from "@/components/ui/button";

export function CartView() {
  const {
    items,
    isHydrated,
    summary,
    promoCode,
    promoError,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  if (!isHydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E7E0D6] rounded w-1/3 mx-auto"></div>
          <div className="h-24 bg-[#E7E0D6] rounded max-w-md mx-auto"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-sm text-[#786C5E] max-w-md mx-auto leading-relaxed">
            Khám phá các sản phẩm nội thất tinh gọn cho không gian nhỏ hoặc thử ướm đồ trên công cụ lập kế hoạch không gian 2D/3D.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/catalog">
            <Button variant="primary" size="md">
              <span>Khám phá sản phẩm</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/planner">
            <Button variant="secondary" size="md">
              <span>Mở 2D Room Planner</span>
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-[#E7E0D6] max-w-md mx-auto text-xs text-[#786C5E] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#5B7065]" />
          <span>Bảo vệ quyền lợi khách hàng · Đổi trả trong 30 ngày</span>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 1000000;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotalVnd);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E7E0D6] gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">Giỏ hàng của bạn</h1>
          <p className="text-sm text-[#786C5E] mt-1">
            Đang có {summary.itemCount} sản phẩm tối ưu không gian sẵn sàng đặt hàng
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A05C52] hover:text-[#7A362D] font-medium self-start sm:self-auto transition-colors"
        >
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      {/* Free shipping progress alert */}
      {distanceToFreeShipping > 0 ? (
        <div className="mt-6 p-3.5 bg-[#FFF9E6] border border-[#F4E0A5] rounded-xl flex items-center gap-3 text-xs sm:text-sm text-[#7A5B00]">
          <Truck className="w-5 h-5 shrink-0 text-[#C48C00]" />
          <div className="flex-1">
            Mua thêm <strong className="font-semibold">{formatVND(distanceToFreeShipping)}</strong> để được{" "}
            <span className="font-semibold underline">MIỄN PHÍ VẬN CHUYỂN</span> toàn quốc!
          </div>
        </div>
      ) : (
        <div className="mt-6 p-3.5 bg-[#EBF0ED] border border-[#C5D3CC] rounded-xl flex items-center gap-3 text-xs sm:text-sm text-[#3E5247]">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#5B7065]" />
          <div>
            Đơn hàng của bạn đã đủ điều kiện nhận <strong className="font-semibold">Miễn phí giao hàng</strong>!
          </div>
        </div>
      )}

      {/* Main Grid: Cart Items & Summary */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E7E0D6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs hover:border-[#D3C7B7] transition-colors"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-start sm:items-center flex-1">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#F3EFEA] shrink-0 border border-[#E7E0D6]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="text-xs text-[#786C5E] font-medium">{item.category}</div>
                  <Link
                    href={`/catalog/${item.productId}`}
                    className="text-sm sm:text-base font-semibold text-[#29241E] hover:text-[#5B7065] transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  {/* Dimensions & Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF8F5] border border-[#E7E0D6] text-[#5A4033] px-2 py-0.5 rounded font-mono">
                      <Ruler className="w-3 h-3" />
                      {item.dimensions}
                    </span>
                    {item.noDrill && (
                      <span className="text-[11px] bg-[#EBF0ED] text-[#5B7065] px-2 py-0.5 rounded font-medium">
                        Không khoan tường
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-[#5B7065] sm:hidden pt-1">
                    {formatVND(item.priceVnd)}
                  </div>
                </div>
              </div>

              {/* Controls: Stepper, Price, Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F3EFEA]">
                {/* Stepper */}
                <div className="flex items-center border border-[#D3C7B7] rounded-lg overflow-hidden bg-[#FAF8F5]">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-[#E7E0D6] text-[#5A4033] transition-colors disabled:opacity-40"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs sm:text-sm font-semibold text-[#29241E] min-w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
                    className="p-1.5 hover:bg-[#E7E0D6] text-[#5A4033] transition-colors disabled:opacity-40"
                    aria-label={
                      item.quantity >= MAX_CART_ITEM_QUANTITY
                        ? `Đã đạt số lượng tối đa (${MAX_CART_ITEM_QUANTITY})`
                        : "Tăng số lượng"
                    }
                    title={
                      item.quantity >= MAX_CART_ITEM_QUANTITY
                        ? `Đã đạt số lượng tối đa (${MAX_CART_ITEM_QUANTITY})`
                        : undefined
                    }
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-28 hidden sm:block">
                  <div className="text-base font-bold text-[#29241E]">
                    {formatVND(item.priceVnd * item.quantity)}
                  </div>
                  <div className="text-xs text-[#786C5E]">
                    {formatVND(item.priceVnd)} / cái
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-[#786C5E] hover:text-[#A05C52] hover:bg-[#FAF8F5] rounded-md transition-colors"
                  title="Xóa khỏi giỏ"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick link back to catalog */}
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs text-[#5B7065] hover:text-[#4A5D53] font-medium transition-colors"
            >
              <span>← Tiếp tục chọn thêm sản phẩm cho phòng</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E7E0D6] rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-[#29241E] pb-3 border-b border-[#E7E0D6]">
            Tóm tắt đơn hàng
          </h2>

          {/* Pricing Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#786C5E]">
              <span>Tạm tính ({summary.itemCount} sản phẩm)</span>
              <span className="font-medium text-[#29241E]">{formatVND(summary.subtotalVnd)}</span>
            </div>

            {summary.discountVnd > 0 && (
              <div className="flex justify-between text-[#5B7065] font-medium">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Ưu đãi mã ({promoCode?.code})</span>
                </span>
                <span>-{formatVND(summary.discountVnd)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#786C5E]">
              <span>Phí giao hàng</span>
              <span>
                {summary.shippingVnd === 0 ? (
                  <span className="text-[#5B7065] font-medium">Miễn phí</span>
                ) : (
                  formatVND(summary.shippingVnd)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E7E0D6] flex justify-between items-baseline">
              <span className="text-base font-bold text-[#29241E]">Tổng thanh toán</span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-[#5B7065]">
                  {formatVND(summary.totalVnd)}
                </span>
                <div className="text-[11px] text-[#786C5E]">(Đã bao gồm VAT)</div>
              </div>
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="pt-2 border-t border-[#E7E0D6]">
            <label className="block text-xs font-semibold text-[#5A4033] mb-1.5">
              Mã ưu đãi / Phiếu giảm giá
            </label>
            {promoCode ? (
              <div className="flex items-center justify-between p-2.5 bg-[#EBF0ED] border border-[#C5D3CC] rounded-lg text-xs">
                <div className="flex items-center gap-2 text-[#3E5247]">
                  <CheckCircle2 className="w-4 h-4 text-[#5B7065]" />
                  <span>
                    Đã áp dụng <strong>{promoCode.code}</strong> (-{promoCode.percent}%)
                  </span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-xs text-[#A05C52] hover:underline font-medium"
                >
                  Gỡ bỏ
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Nhập mã (VD: SMALL2026)"
                    className="flex-1 bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-1.5 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (promoInput.trim()) {
                        applyPromoCode(promoInput);
                      }
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-[#A05C52] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{promoError}</span>
                  </p>
                )}
                <p className="text-[11px] text-[#786C5E]">
                  Gợi ý: Nhập mã <strong className="text-[#5B7065]">SMALL2026</strong> để giảm 10% tối đa 500k.
                </p>
              </div>
            )}
          </div>

          {/* Checkout CTA */}
          <Link href="/checkout" className="block w-full">
            <Button variant="primary" size="lg" className="w-full justify-center text-sm font-bold shadow-md">
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          {/* Guarantees */}
          <div className="space-y-2 pt-2 text-[11px] text-[#786C5E]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5B7065] shrink-0" />
              <span>Giao dịch demo bảo mật · Tính toán phía máy chủ</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#5B7065] shrink-0" />
              <span>Giao hàng toàn quốc trong 24–48h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

