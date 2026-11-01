"use server";

import { revalidatePath } from "next/cache";
import {
  createPromotion,
  togglePromotionStatus,
  deletePromotion,
} from "../data/promotion-store";
import { assertPermission } from "../utils/permissions";
import type { AdminRole } from "../types/acl";

export async function createPromotionAction(
  data: {
    code: string;
    discountPercent: number;
    maxDiscountVnd: number;
    minOrderVnd: number;
    usageLimit: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    description: string;
  },
  callerRole: AdminRole = "super_admin"
) {
  // A034: Warehouse staff cannot manage promotions
  const permCheck = assertPermission(callerRole, "manage_promotions");
  if (!permCheck.allowed) {
    return {
      success: false,
      error: permCheck.error || "Không có quyền quản lý khuyến mãi (A034 Guard)",
    };
  }

  const res = createPromotion(data);
  if (res.success) {
    revalidatePath("/admin/promotions");
    revalidatePath("/cart");
  }
  return res;
}

export async function togglePromotionStatusAction(
  id: string,
  callerRole: AdminRole = "super_admin"
) {
  const permCheck = assertPermission(callerRole, "manage_promotions");
  if (!permCheck.allowed) {
    return {
      success: false,
      error: permCheck.error || "Không có quyền sửa đổi khuyến mãi (A034 Guard)",
    };
  }

  const res = togglePromotionStatus(id);
  if (res.success) {
    revalidatePath("/admin/promotions");
  }
  return res;
}

export async function deletePromotionAction(
  id: string,
  callerRole: AdminRole = "super_admin"
) {
  const permCheck = assertPermission(callerRole, "manage_promotions");
  if (!permCheck.allowed) {
    return { success: false, error: permCheck.error || "Không có quyền xóa khuyến mãi" };
  }

  const success = deletePromotion(id);
  if (success) {
    revalidatePath("/admin/promotions");
  }
  return { success };
}

