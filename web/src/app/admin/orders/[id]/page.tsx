import React from "react";
import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/data/order-store";
import { AdminOrderDetailView } from "@/features/admin/components/admin-order-detail-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return { title: "Không tìm thấy đơn hàng | Admin" };
  return {
    title: `Xử lý đơn ${order.orderCode} | Admin Small Living`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return <AdminOrderDetailView initialOrder={order} />;
}
