"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  QrCode,
  Truck,
  AlertCircle,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useCart } from "../context/cart-context";
import { formatVND } from "@/lib/formatters/currency";
import { processDemoCheckout } from "../actions/checkout-order";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "../types";

export function CheckoutView() {
  const router = useRouter();
  const { items, isHydrated, summary, promoCode, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [district, setDistrict] = useState("Cầu Giấy");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Idempotency key generated once per checkout session (B007)
  const [idempotencyKey] = useState(
    () => `SL-IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E7E0D6] rounded w-1/3 mx-auto"></div>
          <div className="h-32 bg-[#E7E0D6] rounded max-w-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#29241E]">Giỏ hàng của bạn đang trống</h1>
        <p className="text-sm text-[#786C5E]">Vui lòng chọn sản phẩm trước khi tiến hành thanh toán.</p>
        <Link href="/catalog">
          <Button variant="primary" size="md">
            Quay lại danh mục sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend checks
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Vui lòng nhập họ và tên người nhận (ít nhất 2 ký tự)");
      return;
    }
    if (!customerPhone.trim() || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(customerPhone.trim())) {
      setErrorMessage("Vui lòng nhập số điện thoại Việt Nam hợp lệ (VD: 0901234567)");
      return;
    }
    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      setErrorMessage("Vui lòng nhập địa chỉ giao hàng cụ thể (số nhà, tên đường, tòa nhà)");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${shippingAddress.trim()}, ${district}, ${city}`;
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: fullAddress,
        notes: notes.trim() || undefined,
        paymentMethod,
        promoCode: promoCode?.code,
        idempotencyKey: idempotencyKey || `SL-FALLBACK-${Date.now()}`,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const result = await processDemoCheckout(payload);

      if (result.success && result.orderId) {
        // Clear client cart after successful order creation
        clearCart();
        router.push(`/orders/${result.orderId}`);
      } else {
        setErrorMessage(result.error || "Không thể xử lý đơn hàng. Vui lòng thử lại.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-[#5B7065] hover:text-[#4A5D53] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại giỏ hàng</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E] mt-2">
          Thông tin đặt hàng & Giao nhận
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
          Đơn hàng demo sẽ được tạo thật trong hệ thống Small Living với giá trị tính toán an toàn.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl flex items-start gap-3 text-sm text-[#A05C52]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Lỗi xác thực:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery details & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#29241E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Thông tin người nhận</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Họ và tên người nhận <span className="text-[#A05C52]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Tuấn Anh"
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Số điện thoại liên hệ <span className="text-[#A05C52]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Email nhận hóa đơn điện tử (không bắt buộc)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#29241E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Địa chỉ nhận hàng (Căn hộ / Nhà trọ / Nhà riêng)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Tỉnh / Thành phố
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Quận / Huyện
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận / Huyện"
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Địa chỉ chi tiết (Số phòng, số tầng, tòa nhà, ngõ ngách) <span className="text-[#A05C52]">*</span>
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="VD: Phòng 302, Ngõ 45 phố Nguyễn Khang..."
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Ghi chú cho shipper (Không bắt buộc)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Gọi trước khi giao 15 phút, nhà có thang máy..."
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#29241E] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Phương thức thanh toán</span>
            </h2>

            <div className="space-y-3">
              {/* COD Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "bg-[#FAF8F5] border-[#5B7065] ring-1 ring-[#5B7065]"
                    : "bg-white border-[#E7E0D6] hover:border-[#D3C7B7]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-[#5B7065] focus:ring-[#5B7065]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#29241E]">
                    <Truck className="w-4 h-4 text-[#5B7065]" />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <p className="text-xs text-[#786C5E] mt-0.5">
                    Kiểm tra kiện hàng nội thất tinh gọn trước khi thanh toán tiền mặt cho nhân viên giao vận.
                  </p>
                </div>
              </label>

              {/* VietQR Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "vietqr"
                    ? "bg-[#FAF8F5] border-[#5B7065] ring-1 ring-[#5B7065]"
                    : "bg-white border-[#E7E0D6] hover:border-[#D3C7B7]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vietqr"
                  checked={paymentMethod === "vietqr"}
                  onChange={() => setPaymentMethod("vietqr")}
                  className="mt-1 text-[#5B7065] focus:ring-[#5B7065]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#29241E]">
                    <QrCode className="w-4 h-4 text-[#5B7065]" />
                    <span>Chuyển khoản VietQR (Mô phỏng 24/7)</span>
                  </div>
                  <p className="text-xs text-[#786C5E] mt-0.5">
                    Quét mã QR từ ứng dụng mọi ngân hàng; hệ thống tự động xác nhận sau khi tạo đơn.
                  </p>
                </div>
              </label>

              {/* MoMo Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "momo"
                    ? "bg-[#FAF8F5] border-[#5B7065] ring-1 ring-[#5B7065]"
                    : "bg-white border-[#E7E0D6] hover:border-[#D3C7B7]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="mt-1 text-[#5B7065] focus:ring-[#5B7065]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#29241E]">
                    <CreditCard className="w-4 h-4 text-[#A05C52]" />
                    <span>Ví điện tử MoMo (Mô phỏng tức thì)</span>
                  </div>
                  <p className="text-xs text-[#786C5E] mt-0.5">
                    Thanh toán bảo mật một chạm qua liên kết ví MoMo demo.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Review (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E7E0D6] rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-[#29241E] pb-3 border-b border-[#E7E0D6] flex items-center justify-between">
            <span>Đơn hàng của bạn</span>
            <span className="text-xs font-normal text-[#786C5E]">{summary.itemCount} sản phẩm</span>
          </h2>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-xs">
                <div className="relative w-12 h-12 rounded bg-[#F3EFEA] shrink-0 overflow-hidden border border-[#E7E0D6]">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#29241E] truncate">{item.title}</div>
                  <div className="text-[#786C5E] font-mono text-[11px]">{item.dimensions}</div>
                  <div className="text-[#5B7065] font-medium">SL: {item.quantity} × {formatVND(item.priceVnd)}</div>
                </div>
                <div className="font-bold text-[#29241E] text-right shrink-0">
                  {formatVND(item.priceVnd * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-[#E7E0D6] space-y-2 text-xs">
            <div className="flex justify-between text-[#786C5E]">
              <span>Tạm tính</span>
              <span className="font-medium text-[#29241E]">{formatVND(summary.subtotalVnd)}</span>
            </div>

            {summary.discountVnd > 0 && (
              <div className="flex justify-between text-[#5B7065] font-medium">
                <span>Mã giảm giá ({promoCode?.code})</span>
                <span>-{formatVND(summary.discountVnd)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#786C5E]">
              <span>Phí vận chuyển</span>
              <span>
                {summary.shippingVnd === 0 ? (
                  <span className="text-[#5B7065] font-semibold">Miễn phí</span>
                ) : (
                  formatVND(summary.shippingVnd)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E7E0D6] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#29241E]">Tổng cộng thanh toán</span>
              <span className="text-xl font-black text-[#5B7065]">
                {formatVND(summary.totalVnd)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="lg"
            className="w-full justify-center text-sm font-bold shadow-md"
          >
            {isSubmitting ? (
              <span>Đang khởi tạo đơn hàng...</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Hoàn tất đặt hàng · {formatVND(summary.totalVnd)}</span>
              </span>
            )}
          </Button>

          {/* Idempotency badge notice */}
          <div className="text-[10px] text-[#786C5E] text-center font-mono">
            Key: {idempotencyKey.slice(0, 18)}... (Chống tạo đơn trùng)
          </div>
        </div>
      </form>
    </div>
  );
}
