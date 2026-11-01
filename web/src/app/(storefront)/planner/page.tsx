import type { Metadata } from "next";
import { PlannerView } from "@/features/planner/components/planner-view";

export const metadata: Metadata = {
  title: "2D Room Planner — Quy Hoạch Không Gian Tương Tác",
  description:
    "Công cụ quy hoạch không gian 2D theo tỷ lệ chuẩn mm, kéo thả đồ đạc, tự động kiểm tra va chạm, đo lối đi lưu thông và thêm trực tiếp vào giỏ hàng.",
};

export default function PlannerPage() {
  return <PlannerView />;
}
