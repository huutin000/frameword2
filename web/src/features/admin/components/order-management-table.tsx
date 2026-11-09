"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  CreditCard,
  Phone,
} from "lucide-react";
import type { DemoOrderRecord, OrderStatus } from "@/features/orders/types";
import { formatVND } from "@/lib/formatters/currency";

interface OrderManagementTableProps {
  initialOrders: DemoOrderRecord[];
}

export function OrderManagementTable({ initialOrders }: OrderManagementTableProps) {
  const [orders] = useState<DemoOrderRecord[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    const matchesSearch =
      !search ||
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return (
          <span className="inline-flex items-center gap-1 bg-[#EBF0ED] text-[#5B7065] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Mới đặt</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 bg-[#FFF9E6] text-[#A05C52] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Package className="w-3 h-3" />
            <span>Đang đóng gói</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 bg-[#EBF0ED] text-[#5A4033] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Truck className="w-3 h-3" />
            <span>Đang vận chuyển</span>
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 bg-[#EBF0ED] text-[#3E5247] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã giao hàng</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-[#FDF2F0] text-[#A05C52] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <XCircle className="w-3 h-3" />
            <span>Đã hủy / Hoàn kho</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, tên hoặc số ĐT..."
              className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
            />
            <Search className="w-4 h-4 text-[#786C5E] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          >
            <option value="all">Tất cả trạng thái ({initialOrders.length})</option>
            <option value="placed">Mới đặt (Chờ đóng gói)</option>
            <option value="processing">Đang đóng gói</option>
            <option value="shipped">Đang vận chuyển</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                <th className="py-3 px-4">Mã đơn hàng</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Thanh toán</th>
                <th className="py-3 px-4">Tổng tiền (VND)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFEA]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#786C5E]">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Order Code */}
                    <td className="py-3 px-4 font-mono font-bold text-[#29241E] whitespace-nowrap">
                      {o.orderCode}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#29241E]">{o.customerName}</div>
                      <div className="text-[11px] text-[#786C5E] flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        <span>{o.customerPhone}</span>
                      </div>
                    </td>

                    {/* Items count */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[#5A4033] font-medium">{o.items.length} mặt hàng</span>
                      <div className="text-[10px] text-[#786C5E] truncate max-w-44">
                        {o.items.map((i) => i.productName).join(", ")}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-[#29241E]">
                        <CreditCard className="w-3 h-3 text-[#5B7065]" />
                        <span>{o.paymentMethod.toUpperCase()}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          o.paymentStatus === "paid" ? "text-[#5B7065]" : "text-[#786C5E]"
                        }`}
                      >
                        {o.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : o.paymentMethod === "cod"
                          ? "Thu hộ khi giao"
                          : "Chờ thanh toán"}
                      </span>
                    </td>

                    {/* Total VND */}
                    <td className="py-3 px-4 font-black text-[#5B7065] whitespace-nowrap">
                      {formatVND(o.totalVnd)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(o.orderStatus)}</td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#786C5E] whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EBF0ED] text-[#5B7065] border border-[#D3C7B7] transition-colors font-medium text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem & Xử lý</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

