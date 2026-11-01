import React from "react";
import { notFound } from "next/navigation";
import { getAdminProductById } from "@/features/admin/data/product-store";
import { ProductForm } from "@/features/admin/components/product-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getAdminProductById(id);
  if (!product) return { title: "Không tìm thấy sản phẩm | Admin" };
  return {
    title: `Chỉnh sửa: ${product.title} | Admin Small Living`,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
          Cập nhật thông số kỹ thuật, giá niêm yết hoặc tồn kho của {product.title}.
        </p>
      </div>

      <ProductForm initialProduct={product} isEdit={true} />
    </div>
  );
}
