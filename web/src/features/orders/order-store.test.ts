import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllOrders,
  getOrderById,
  transitionOrderStatus,
  resetOrderRegistryToSeed,
} from "./data/order-store";

describe("Order Domain State Machine & Audit Timeline", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
  });

  it("[A016] retrieves seeded orders correctly with default filters", () => {
    const orders = getAllOrders();
    expect(orders.length).toBeGreaterThanOrEqual(2);
    expect(orders.some((o) => o.orderCode === "SL-2026-001")).toBe(true);
  });

  it("[A018] allows valid state transition: placed -> processing -> shipped -> delivered", () => {
    const order = getOrderById("ord-seed-01");
    expect(order).toBeDefined();

    // ord-seed-01 starts in 'processing' in seed
    // Transition processing -> shipped
    const res1 = transitionOrderStatus("ord-seed-01", "shipped", "Bàn giao vận chuyển");
    expect(res1.success).toBe(true);
    expect(res1.order?.orderStatus).toBe("shipped");

    // Transition shipped -> delivered
    const res2 = transitionOrderStatus("ord-seed-01", "delivered", "Giao thành công");
    expect(res2.success).toBe(true);
    expect(res2.order?.orderStatus).toBe("delivered");

    // Terminal state delivered cannot transition backwards
    const res3 = transitionOrderStatus("ord-seed-01", "processing", "Thử quay lại");
    expect(res3.success).toBe(false);
    expect(res3.error).toContain("không hợp lệ");
  });

  it("[A019] allows cancellation and appends event to audit timeline", () => {
    // ord-seed-02 starts in 'shipped'
    const res = transitionOrderStatus(
      "ord-seed-02",
      "cancelled",
      "Khách hủy và hoàn kho",
      "admin"
    );
    expect(res.success).toBe(true);
    expect(res.order?.orderStatus).toBe("cancelled");

    const lastEvent = res.order?.events[res.order.events.length - 1];
    expect(lastEvent?.toStatus).toBe("cancelled");
    expect(lastEvent?.actor).toBe("admin");
  });

  it("[A020] rejects invalid state jump: placed -> delivered directly", () => {
    // ord-seed-01 reset to placed first
    const order = getOrderById("ord-seed-01")!;
    order.orderStatus = "placed";

    const res = transitionOrderStatus("ord-seed-01", "delivered", "Nhảy cóc trạng thái");
    expect(res.success).toBe(false);
    expect(res.error).toContain("không hợp lệ");
  });
});

