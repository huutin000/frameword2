import React from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import type { DemoOrder } from "@/types/commerce";

export interface RecentOrdersTableProps {
  orders: DemoOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E0D6] p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA]">
        <div>
          <h2 className="text-sm font-bold text-[#29241E]">Đơn hàng Demo gần đây</h2>
          <p className="text-[11px] text-[#786C5E]">Tất cả giao dịch được ghi lại vào cơ sở dữ liệu mô phỏng.</p>
        </div>
        <Link href="/admin/orders" className="text-xs text-[#5B7065] font-semibold hover:underline">
          Xem tất cả ({orders.length}) →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E7E0D6] text-[#786C5E]">
              <th className="pb-2 font-semibold">Mã đơn</th>
              <th className="pb-2 font-semibold">Khách hàng</th>
              <th className="pb-2 font-semibold">Thời gian</th>
              <th className="pb-2 font-semibold text-right">Tổng tiền</th>
              <th className="pb-2 font-semibold text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EFEA]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                <td className="py-3 font-mono font-bold text-[#29241E]">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-[#5B7065] hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="py-3 text-[#29241E] font-medium">{order.customerName}</td>
                <td className="py-3 text-[#786C5E]">{order.createdAt}</td>
                <td className="py-3 font-bold text-[#29241E] text-right">{formatVND(order.totalVnd)}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      order.status === "processing"
                        ? "bg-[#FFF8E6] text-[#B87A1E]"
                        : order.status === "placed"
                        ? "bg-[#EBF0ED] text-[#5B7065]"
                        : "bg-[#F3EFEA] text-[#786C5E]"
                    }`}
                  >
                    {order.statusLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

