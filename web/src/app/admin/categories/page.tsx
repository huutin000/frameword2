import React from "react";
import { getAllCategories } from "@/features/admin/data/category-store";
import { CategoryManagementView } from "@/features/admin/components/category-management-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản trị danh mục | Admin Small Living",
  description: "Cấu trúc danh mục đa tầng và kiểm soát vòng lặp phân cấp.",
};

export default function AdminCategoriesPage() {
  const categories = getAllCategories();

  return <CategoryManagementView initialCategories={categories} />;
}

