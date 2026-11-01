import React from "react";
import { CartView } from "@/features/cart/components/cart-view";

export const metadata = {
  title: "Giỏ hàng | Small Living 2026",
  description: "Xem và điều chỉnh các sản phẩm nội thất tinh gọn cho không gian nhỏ.",
};

export default function CartPage() {
  return <CartView />;
}
