"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Ruler,
  AlertTriangle,
  ArrowRight,
  Printer,
  Compass,
} from "lucide-react";
import type { DemoOrderRecord } from "../types";
import { OrderTimeline } from "./order-timeline";
import { formatVND } from "@/lib/formatters/currency";
import { cancelOrderByCustomer } from "../actions/cancel-order";
import { Button } from "@/components/ui/button";

interface OrderDetailsViewProps {
  initialOrder: DemoOrderRecord;
}

export function OrderDetailsView({ initialOrder }: OrderDetailsViewProps) {
  const [order, setOrder] = useState<DemoOrderRecord>(initialOrder);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const canCancel = order.orderStatus === "placed";

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác không thể hoàn tác.")) {
      return;
    }
    setIsCancelling(true);
    setCancelError(null);

    const res = await cancelOrderByCustomer(order.id);
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      setCancelError(res.error || "Không thể hủy đơn hàng vào lúc này.");
    }
    setIsCancelling(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "placed":
        return <span className="bg-[#EBF0ED] text-[#5B7065] px-3 py-1 rounded-full text-xs font-bold">Chờ xử lý</span>;
      case "processing":
        return <span className="bg-[#FFF9E6] text-[#A05C52] px-3 py-1 rounded-full text-xs font-bold">Đang đóng gói</span>;
      case "shipped":
        return <span className="bg-[#EBF0ED] text-[#5A4033] px-3 py-1 rounded-full text-xs font-bold">Đang vận chuyển</span>;
      case "delivered":
        return <span className="bg-[#EBF0ED] text-[#3E5247] px-3 py-1 rounded-full text-xs font-bold">Giao thành công</span>;
      case "cancelled":
        return <span className="bg-[#FDF2F0] text-[#A05C52] px-3 py-1 rounded-full text-xs font-bold">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner: Success Header */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
                Mã đơn hàng: {order.orderCode}
              </h1>
              {getStatusBadge(order.orderStatus)}
            </div>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
              Khởi tạo lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5A4033] border border-[#D3C7B7] rounded-lg hover:bg-[#FAF8F5] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In hóa đơn</span>
          </button>
        </div>
      </div>

      {cancelError && (
        <div className="p-4 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl text-xs text-[#A05C52] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{cancelError}</span>
        </div>
      )}

      {/* Order Timeline Component */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 shadow-xs">
        <OrderTimeline currentStatus={order.orderStatus} events={order.events} />
      </div>

      {/* Grid: Delivery Info & Itemized Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Line Items (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#29241E] flex items-center gap-2 pb-3 border-b border-[#E7E0D6]">
            <Package className="w-4 h-4 text-[#5B7065]" />
            <span>Danh sách sản phẩm ({order.items.length})</span>
          </h2>

          <div className="divide-y divide-[#F3EFEA]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-lg bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E7E0D6]">
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#29241E] truncate">
                    {item.productName}
                  </div>
                  <div className="text-xs text-[#786C5E] flex items-center gap-1 font-mono mt-0.5">
                    <Ruler className="w-3 h-3" />
                    <span>{item.dimensionsText}</span>
                  </div>
                  <div className="text-xs text-[#5B7065] mt-1 font-medium">
                    {formatVND(item.unitPriceVnd)} × {item.quantity}
                  </div>
                </div>
                <div className="text-sm font-bold text-[#29241E] text-right">
                  {formatVND(item.subtotalVnd)}
                </div>
              </div>
            ))}
          </div>

          {/* Cancellation button if allowed */}
          {canCancel && (
            <div className="pt-4 border-t border-[#E7E0D6] flex justify-between items-center">
              <p className="text-xs text-[#786C5E]">
                Đơn hàng chưa qua đóng gói, bạn có thể hủy trực tiếp.
              </p>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="text-xs font-semibold text-[#A05C52] hover:text-[#7A362D] px-3 py-1.5 rounded border border-[#F5C2BC] hover:bg-[#FDF2F0] transition-colors"
              >
                {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
            </div>
          )}
        </div>

        {/* Right: Customer & Financials (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Thông tin nhận hàng
            </h3>

            <div className="text-xs space-y-2 text-[#5A4033]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#29241E] text-sm">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-[#786C5E]">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2 text-[#786C5E]">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{order.shippingAddress}</span>
              </div>
              {order.notes && (
                <div className="pt-2 text-[11px] text-[#786C5E] italic">
                  Ghi chú: &ldquo;{order.notes}&rdquo;
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E7E0D6] flex items-center justify-between text-xs">
              <span className="text-[#786C5E]">Phương thức:</span>
              <span className="font-semibold text-[#29241E] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#5B7065]" />
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận (COD)"
                  : order.paymentMethod === "vietqr"
                  ? "Chuyển khoản VietQR"
                  : "Ví điện tử MoMo"}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Chi tiết thanh toán
            </h3>

            <div className="flex justify-between text-[#786C5E]">
              <span>Tạm tính</span>
              <span className="font-medium text-[#29241E]">{formatVND(order.subtotalVnd)}</span>
            </div>

            {order.discountVnd > 0 && (
              <div className="flex justify-between text-[#5B7065] font-medium">
                <span>Giảm giá ({order.promoCode})</span>
                <span>-{formatVND(order.discountVnd)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#786C5E]">
              <span>Phí vận chuyển</span>
              <span>{order.shippingVnd === 0 ? "Miễn phí" : formatVND(order.shippingVnd)}</span>
            </div>

            <div className="pt-3 border-t border-[#E7E0D6] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#29241E]">Tổng cộng</span>
              <span className="text-xl font-black text-[#5B7065]">
                {formatVND(order.totalVnd)}
              </span>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="space-y-2">
            <Link href="/catalog" className="block w-full">
              <Button variant="secondary" size="md" className="w-full justify-center text-xs">
                <span>Khám phá thêm sản phẩm khác</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/planner" className="block w-full">
              <Button variant="ghost" size="md" className="w-full justify-center text-xs text-[#5B7065]">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                <span>Ướm thử nội thất với 2D Planner</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

