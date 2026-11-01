"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  createAdminProduct,
  updateAdminProduct,
  toggleAdminProductPublish,
  deleteAdminProduct,
} from "../data/product-store";
import type { RoomType, SpatialProblem } from "@/types/commerce";

const productFormSchema = z.object({
  title: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  roomType: z.enum(["studio", "bedroom", "workspace", "kitchen", "balcony"]),
  roomTag: z.string().min(1, "Vui lòng nhập nhãn phòng"),
  problem: z.enum(["no-drill", "tight-space", "dead-corner", "foldable"]),
  problemTag: z.string().min(1, "Vui lòng nhập giải pháp không gian"),
  widthMm: z.number().int().positive("Chiều rộng (mm) phải lớn hơn 0"),
  depthMm: z.number().int().positive("Chiều sâu (mm) phải lớn hơn 0"),
  heightMm: z.number().int().positive("Chiều cao (mm) phải lớn hơn 0"),
  priceVnd: z.number().int().positive("Giá niêm yết (VND) phải lớn hơn 0"),
  sku: z.string().min(3, "Mã SKU ít nhất 3 ký tự"),
  stockBalance: z.number().int().min(0, "Tồn kho không được âm"),
  weightCapacityKg: z.number().optional(),
  material: z.string().optional(),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ"),
  fitScoreExplanation: z.string().min(5, "Mô tả tính tương thích không gian ít nhất 5 ký tự"),
  noDrill: z.boolean(),
});

export async function createProductAction(formData: unknown) {
  try {
    const parsed = productFormSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
    }

    const data = parsed.data;
    const dimensions = `${data.widthMm} × ${data.depthMm} × ${data.heightMm} mm`;

    const product = createAdminProduct({
      ...data,
      dimensions,
      inStock: data.stockBalance > 0,
      isPublished: true,
      roomType: data.roomType as RoomType,
      problem: data.problem as SpatialProblem,
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");

    return { success: true, product };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi tạo sản phẩm";
    return { success: false, error: msg };
  }
}

export async function updateProductAction(id: string, formData: unknown) {
  try {
    const parsed = productFormSchema.partial().safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
    }

    const data = parsed.data;
    let dimensions: string | undefined;
    if (data.widthMm && data.depthMm && data.heightMm) {
      dimensions = `${data.widthMm} × ${data.depthMm} × ${data.heightMm} mm`;
    }

    const updated = updateAdminProduct(id, {
      ...data,
      ...(dimensions ? { dimensions } : {}),
      ...(typeof data.stockBalance === "number" ? { inStock: data.stockBalance > 0 } : {}),
    });

    if (!updated) {
      return { success: false, error: "Không tìm thấy sản phẩm cần cập nhật" };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/catalog/${id}`);
    revalidatePath("/catalog");

    return { success: true, product: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi cập nhật sản phẩm";
    return { success: false, error: msg };
  }
}

export async function toggleProductStatusAction(id: string) {
  const result = toggleAdminProductPublish(id);
  if (!result) return { success: false, error: "Không tìm thấy sản phẩm" };
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true, isPublished: result.isPublished };
}

export async function deleteProductAction(id: string) {
  const success = deleteAdminProduct(id);
  if (!success) return { success: false, error: "Không thể xóa sản phẩm" };
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true };
}
