"use server";

import { revalidatePath } from "next/cache";
import {
  adjustInventoryStock,
  type MovementType,
} from "../data/inventory-store";
import { assertPermission } from "../utils/permissions";
import type { AdminRole } from "../types/acl";

export async function adjustStockAction(
  sku: string,
  quantityChange: number,
  movementType: MovementType,
  referenceId: string,
  note: string,
  callerRole: AdminRole = "super_admin"
) {
  // A035: Content editor cannot change inventory
  const permCheck = assertPermission(callerRole, "manage_inventory");
  if (!permCheck.allowed) {
    return {
      success: false,
      error: permCheck.error || "Không có quyền điều chỉnh tồn kho (A035 Guard)",
    };
  }

  const res = adjustInventoryStock(
    sku,
    quantityChange,
    movementType,
    referenceId,
    note,
    `Admin (${callerRole})`
  );

  if (res.success) {
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
  }

  return res;
}

