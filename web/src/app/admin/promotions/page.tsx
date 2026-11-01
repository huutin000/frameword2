import React from "react";
import { getAllPromotions } from "@/features/admin/data/promotion-store";
import { PromotionManagementView } from "@/features/admin/components/promotion-management-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản trị khuyến mãi | Admin Small Living",
  description: "Thiết lập mã giảm giá, mức chiết khấu và điều kiện đơn hàng.",
};

export default function AdminPromotionsPage() {
  const promotions = getAllPromotions();

  return <PromotionManagementView initialPromotions={promotions} />;
}

