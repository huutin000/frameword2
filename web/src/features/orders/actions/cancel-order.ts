"use server";

import { transitionOrderStatus } from "../data/order-store";

export async function cancelOrderByCustomer(orderId: string, reason?: string) {
  try {
    const result = transitionOrderStatus(
      orderId,
      "cancelled",
      reason || "Khách hàng yêu cầu hủy đơn hàng trước khi đóng gói",
      "customer"
    );
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Không thể hủy đơn hàng";
    return { success: false, error: msg };
  }
}

