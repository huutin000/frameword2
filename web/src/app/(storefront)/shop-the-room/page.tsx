import type { Metadata } from "next";
import { ShopTheRoomView } from "@/features/shop-the-room/components/shop-the-room-view";

export const metadata: Metadata = {
  title: "Shop The Room — Khám Phá Không Gian Thực Tế",
  description:
    "Trải nghiệm khám phá nội thất tương tác qua các bức ảnh thực tế với điểm chạm hotspot, xem kích thước và thêm nhanh vào giỏ hàng.",
};

export default function ShopTheRoomPage() {
  return <ShopTheRoomView />;
}

