import React from "react";
import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/data/order-store";
import { OrderDetailsView } from "@/features/orders/components/order-details-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return { title: "Không tìm thấy đơn hàng | Small Living 2026" };
  return {
    title: `Chi tiết đơn hàng ${order.orderCode} | Small Living 2026`,
    description: `Hành trình và trạng thái giao hàng đơn hàng ${order.orderCode}`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailsView initialOrder={order} />;
}
