import type { Metadata } from "next";
import { SolutionsListView } from "@/features/solutions/components/solutions-list-view";
import { getAllCuratedTemplates } from "@/features/solutions/data/solution-store";

export const metadata: Metadata = {
  title: "Giải Pháp Không Gian — Small Living 2026",
  description:
    "Các combo nội thất phối sẵn tối ưu theo nhu cầu: phòng trọ không khoan, góc làm việc mini, bếp gọn và lưu trữ thông minh.",
};

export default function SolutionsPage() {
  const templates = getAllCuratedTemplates();
  return <SolutionsListView initialSolutions={templates} />;
}

