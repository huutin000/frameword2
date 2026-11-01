import React from "react";
import { ProductForm } from "@/features/admin/components/product-form";

export const metadata = {
  title: "Thêm sản phẩm mới | Admin Small Living",
  description: "Tạo sản phẩm nội thất tối ưu không gian với kích thước mm và cơ chế không khoan.",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
          Thêm sản phẩm mới
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
          Khai báo thông số milimét chuẩn xác để hệ thống SpaceFit™ có thể tính toán tương thích căn hộ.
        </p>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}

