"use server";

import { revalidatePath } from "next/cache";
import { transitionOrderStatus } from "@/features/orders/data/order-store";
import type { OrderStatus } from "@/features/orders/types";
import { assertPermission } from "../utils/permissions";
import type { AdminRole } from "../types/acl";

export async function updateAdminOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  callerRole: AdminRole = "super_admin"
) {
  // A035: Content editor cannot change order status
  const permCheck = assertPermission(callerRole, "manage_orders");
  if (!permCheck.allowed) {
    return {
      success: false,
      error: permCheck.error || "Không có quyền sửa đổi đơn hàng (A035 Guard)",
    };
  }

  try {
    const res = transitionOrderStatus(orderId, newStatus, note, "admin");
    if (!res.success) {
      return { success: false, error: res.error };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/admin");

    return { success: true, order: res.order };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái đơn";
    return { success: false, error: msg };
  }
}

export async function cancelAdminOrderAction(
  orderId: string,
  note?: string,
  callerRole: AdminRole = "super_admin"
) {
  return updateAdminOrderStatus(
    orderId,
    "cancelled",
    note || "Quản trị viên hủy đơn hàng và hoàn trả lại số lượng tồn kho",
    callerRole
  );
}

