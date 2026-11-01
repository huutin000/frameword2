import React from "react";
import { getAllOrders } from "@/features/orders/data/order-store";
import { OrderManagementTable } from "@/features/admin/components/order-management-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý đơn hàng | Admin Small Living",
  description: "Xử lý quy trình đơn hàng, chuyển trạng thái và theo dõi nhật ký sự kiện giao nhận.",
};

export default function AdminOrdersPage() {
  const orders = getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
          Quản lý đơn hàng & Vận chuyển
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
          Điều phối quy trình từ tiếp nhận, đóng gói, bàn giao vận chuyển và xử lý hủy đơn hàng hoàn kho.
        </p>
      </div>

      <OrderManagementTable initialOrders={orders} />
    </div>
  );
}
