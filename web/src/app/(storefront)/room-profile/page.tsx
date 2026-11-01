import type { Metadata } from "next";
import { RoomProfileView } from "@/features/room-profile/components/room-profile-view";

export const metadata: Metadata = {
  title: "Hồ Sơ Không Gian — Small Living 2026",
  description:
    "Quản lý số đo phòng, trần nhà và quy định không khoan tường để thuật toán SpaceFit™ tự động so khớp nội thất hoàn hảo.",
};

export default function RoomProfilePage() {
  return <RoomProfileView />;
}

