import React from "react";
import { getAllAdminProducts } from "@/features/admin/data/product-store";
import { ProductManagementTable } from "@/features/admin/components/product-management-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý sản phẩm | Admin Small Living",
  description: "Quản trị danh mục sản phẩm, biến thể và số liệu không gian SpaceFit.",
};

export default function AdminProductsPage() {
  const products = getAllAdminProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
          Quản lý sản phẩm & Tồn kho SpaceFit
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
          Theo dõi thông số kích thước milimét, khả năng không khoan tường và trạng thái hiển thị trên cửa hàng.
        </p>
      </div>

      <ProductManagementTable initialProducts={products} />
    </div>
  );
}
