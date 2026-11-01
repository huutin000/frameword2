"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
} from "lucide-react";
import type { DemoOrderRecord, OrderStatus } from "@/features/orders/types";
import { formatVND } from "@/lib/formatters/currency";
import { updateAdminOrderStatus } from "../actions/order-actions";
import { Button } from "@/components/ui/button";

interface AdminOrderDetailViewProps {
  initialOrder: DemoOrderRecord;
}

const ALLOWED_NEXT_STATUSES: Record<OrderStatus, { status: OrderStatus; label: string }[]> = {
  placed: [
    { status: "processing", label: "Chuyển sang: Đang đóng gói (processing)" },
    { status: "cancelled", label: "Hủy đơn hàng và hoàn trả tồn kho (cancelled)" },
  ],
  processing: [
    { status: "shipped", label: "Chuyển sang: Đang vận chuyển (shipped)" },
    { status: "cancelled", label: "Hủy đơn hàng và hoàn trả tồn kho (cancelled)" },
  ],
  shipped: [
    { status: "delivered", label: "Chuyển sang: Đã giao thành công (delivered)" },
    { status: "cancelled", label: "Hủy đơn hàng (giao thất bại / hoàn hàng)" },
  ],
  delivered: [],
  cancelled: [],
};

export function AdminOrderDetailView({ initialOrder }: AdminOrderDetailViewProps) {
  const [order, setOrder] = useState<DemoOrderRecord>(initialOrder);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | "">("");
  const [transitionNote, setTransitionNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableTransitions = ALLOWED_NEXT_STATUSES[order.orderStatus] || [];

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) return;

    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await updateAdminOrderStatus(
      order.id,
      targetStatus as OrderStatus,
      transitionNote.trim() || undefined
    );

    if (res.success && res.order) {
      setOrder(res.order);
      setTargetStatus("");
      setTransitionNote("");
      setSuccessMessage(`Đã cập nhật trạng thái đơn sang "${res.order.orderStatus}" thành công!`);
    } else {
      setErrorMessage(res.error || "Không thể cập nhật trạng thái đơn hàng");
    }
    setIsUpdating(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return <span className="bg-[#EBF0ED] text-[#5B7065] px-3 py-1 rounded-full text-xs font-bold">Chờ đóng gói</span>;
      case "processing":
        return <span className="bg-[#FFF9E6] text-[#A05C52] px-3 py-1 rounded-full text-xs font-bold">Đang đóng gói</span>;
      case "shipped":
        return <span className="bg-[#EBF0ED] text-[#5A4033] px-3 py-1 rounded-full text-xs font-bold">Đang vận chuyển</span>;
      case "delivered":
        return <span className="bg-[#EBF0ED] text-[#3E5247] px-3 py-1 rounded-full text-xs font-bold">Giao thành công</span>;
      case "cancelled":
        return <span className="bg-[#FDF2F0] text-[#A05C52] px-3 py-1 rounded-full text-xs font-bold">Đã hủy</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#5B7065] hover:text-[#4A5D53] font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
              Đơn hàng: {order.orderCode}
            </h1>
            {getStatusBadge(order.orderStatus)}
          </div>
          <div className="text-xs text-[#786C5E]">
            Mã định danh hệ thống: <span className="font-mono">{order.id}</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#EBF0ED] border border-[#C5D3CC] rounded-xl text-xs text-[#3E5247] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5B7065] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl text-xs text-[#A05C52] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* State Machine Transition Control Panel */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#5B7065]" />
            <span>Điều phối trạng thái đơn hàng (Order State Machine)</span>
          </span>
          <span className="text-[11px] font-normal text-[#786C5E]">
            Hiện tại: <strong className="text-[#29241E]">{order.orderStatus}</strong>
          </span>
        </h2>

        {availableTransitions.length > 0 ? (
          <form onSubmit={handleUpdateStatus} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Chọn trạng thái tiếp theo cho phép
                </label>
                <select
                  required
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                >
                  <option value="">-- Chọn bước tiếp theo --</option>
                  {availableTransitions.map((t) => (
                    <option key={t.status} value={t.status}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Ghi chú điều phối (Mã vận đơn / Lý do hủy)
                </label>
                <input
                  type="text"
                  value={transitionNote}
                  onChange={(e) => setTransitionNote(e.target.value)}
                  placeholder="VD: Đã đóng gói xong, giao cho Viettel Post..."
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!targetStatus || isUpdating}
                variant="primary"
                size="sm"
                className="font-bold text-xs shadow-xs"
              >
                {isUpdating ? "Đang xử lý..." : "Cập nhật trạng thái đơn"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-[#FAF8F5] rounded-xl text-xs text-[#786C5E]">
            Đơn hàng này đã ở trạng thái kết thúc (<strong>{order.orderStatus}</strong>), không thể chuyển trạng thái tiếp theo.
          </div>
        )}
      </div>

      {/* Grid: Items & Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Products & Totals (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#5B7065]" />
            <span>Sản phẩm trong đơn hàng ({order.items.length})</span>
          </h2>

          <div className="divide-y divide-[#F3EFEA]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-lg bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E7E0D6]">
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#29241E] truncate">{item.productName}</div>
                  <div className="text-[11px] text-[#786C5E] font-mono">{item.dimensionsText}</div>
                  <div className="text-xs text-[#5B7065] font-semibold mt-0.5">
                    {formatVND(item.unitPriceVnd)} × {item.quantity} cái
                  </div>
                </div>
                <div className="text-xs font-black text-[#29241E] text-right">
                  {formatVND(item.subtotalVnd)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7E0D6] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#786C5E]">
              <span>Tạm tính</span>
              <span className="font-semibold text-[#29241E]">{formatVND(order.subtotalVnd)}</span>
            </div>
            {order.discountVnd > 0 && (
              <div className="flex justify-between text-[#5B7065] font-semibold">
                <span>Ưu đãi ({order.promoCode})</span>
                <span>-{formatVND(order.discountVnd)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#786C5E]">
              <span>Phí vận chuyển</span>
              <span>{order.shippingVnd === 0 ? "Miễn phí" : formatVND(order.shippingVnd)}</span>
            </div>
            <div className="pt-2 border-t border-[#E7E0D6] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#29241E]">Tổng doanh thu</span>
              <span className="text-lg font-black text-[#5B7065]">{formatVND(order.totalVnd)}</span>
            </div>
          </div>
        </div>

        {/* Right: Customer & Audit Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer info */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Thông tin nhận hàng
            </h2>

            <div className="space-y-1.5">
              <div className="font-bold text-[#29241E] text-sm">{order.customerName}</div>
              <div className="flex items-center gap-2 text-[#786C5E] font-mono">
                <Phone className="w-3.5 h-3.5" />
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

            <div className="pt-3 border-t border-[#E7E0D6] flex justify-between items-center">
              <span className="text-[#786C5E]">Phương thức:</span>
              <span className="font-bold text-[#29241E] uppercase">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Audit Event Log */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#5B7065]" />
              <span>Nhật ký kiểm toán đơn hàng</span>
            </h2>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {order.events
                .slice()
                .reverse()
                .map((e) => (
                  <div key={e.id} className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E7E0D6] text-[11px]">
                    <div className="flex items-center justify-between font-bold text-[#29241E]">
                      <span className="capitalize">{e.actor}</span>
                      <span className="font-mono text-[#786C5E]">
                        {new Date(e.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-[#5A4033] mt-1">{e.note}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
