import React from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, AlertTriangle, Compass, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/features/admin/components/kpi-card";
import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";
import { InventoryAlertCard } from "@/features/admin/components/inventory-alert-card";
import { getAllOrders } from "@/features/orders/data/order-store";
import type { KpiMetric } from "@/features/admin/types";
import type { DemoOrder, InventoryBalance } from "@/types/commerce";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const allOrders = getAllOrders();
  const totalRevenueVnd = allOrders.reduce((sum, o) => sum + o.totalVnd, 0);

  const kpis: KpiMetric[] = [
    {
      title: "Doanh số Demo tích lũy",
      value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenueVnd),
      subtext: `Từ ${allOrders.length} đơn hàng thử nghiệm`,
      icon: DollarSign,
      colorClass: "text-[#5B7065] bg-[#EBF0ED]",
    },
    {
      title: "Đơn hàng mô phỏng",
      value: `${allOrders.length} đơn`,
      subtext: `${allOrders.filter((o) => o.orderStatus === "placed").length} đơn chờ đóng gói`,
      icon: ShoppingBag,
      colorClass: "text-[#5A4033] bg-[#F5EFEB]",
    },
    {
      title: "Cảnh báo sắp hết hàng",
      value: "2 sản phẩm",
      subtext: "Số lượng khả dụng < 5",
      icon: AlertTriangle,
      colorClass: "text-[#B85D43] bg-[#F9EBE7]",
    },
    {
      title: "Chuẩn hóa SpaceFit",
      value: "100%",
      subtext: "Đủ thông số mm & ảnh có bản quyền",
      icon: Compass,
      colorClass: "text-[#2E6F40] bg-[#EBF0ED]",
    },
  ];

  const recentOrders: DemoOrder[] = allOrders.slice(0, 5).map((o) => ({
    id: o.orderCode,
    customerName: o.customerName,
    itemsCount: o.items.length,
    totalVnd: o.totalVnd,
    status: o.orderStatus,
    statusLabel:
      o.orderStatus === "placed"
        ? "Mới đặt"
        : o.orderStatus === "processing"
        ? "Đang đóng gói"
        : o.orderStatus === "shipped"
        ? "Đang giao"
        : o.orderStatus === "delivered"
        ? "Đã giao"
        : "Đã hủy",
    createdAt: new Date(o.createdAt).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  const lowStockAlerts: InventoryBalance[] = [
    {
      sku: "SL-SHELF-600-OAK",
      productName: "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm",
      dimensions: "600 × 280 × 2600 mm",
      availableStock: 3,
      reservedStock: 1,
      lowStockThreshold: 5,
    },
    {
      sku: "SL-DESK-800-WALNUT",
      productName: "Bàn Làm Việc Gấp Gọn Piston 800mm",
      dimensions: "800 × 500 × 750 mm",
      availableStock: 2,
      reservedStock: 0,
      lowStockThreshold: 5,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#29241E]">Bảng điều khiển quản trị</h1>
          <p className="text-xs text-[#786C5E] mt-0.5">
            Tổng quan nghiệp vụ kho, đơn hàng demo và catalog hệ thống Small Living.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm mới</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} metric={kpi} />
        ))}
      </div>

      {/* Grid: Recent Orders + Inventory Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div>
          <InventoryAlertCard alerts={lowStockAlerts} />
        </div>
      </div>
    </div>
  );
}
