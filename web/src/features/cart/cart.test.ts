import { describe, it, expect, beforeEach } from "vitest";
import { processDemoCheckout } from "./actions/checkout-order";
import { resetOrderRegistryToSeed, getOrderById } from "@/features/orders/data/order-store";

describe("Core Commerce Cart & Checkout Server Actions", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
  });

  it("[B005] recalculates order totals server-side using trusted product prices (tamper prevention)", async () => {
    // p1 has official price 680,000 VND; p2 has 1,150,000 VND
    const payload = {
      customerName: "Lê Văn Thử",
      customerPhone: "0912345678",
      customerEmail: "levanthu@example.com",
      shippingAddress: "Số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội",
      paymentMethod: "cod" as const,
      idempotencyKey: `IDEM-TEST-${Date.now()}-1`,
      items: [
        { productId: "p1", quantity: 2 }, // 2 * 680,000 = 1,360,000
        { productId: "p2", quantity: 1 }, // 1 * 1,150,000 = 1,150,000
      ],
    };

    const res = await processDemoCheckout(payload);
    expect(res.success).toBe(true);
    expect(res.orderId).toBeDefined();

    const order = getOrderById(res.orderId!);
    expect(order).toBeDefined();
    // Subtotal: 1,360,000 + 1,150,000 = 2,510,000 VND
    expect(order?.subtotalVnd).toBe(2510000);
    // Subtotal >= 1M => Shipping is 0 VND
    expect(order?.shippingVnd).toBe(0);
    expect(order?.totalVnd).toBe(2510000);
  });

  it("[U030] calculates 10% discount for valid promo code SMALL2026 capped at 500k", async () => {
    const payload = {
      customerName: "Trần Mai Anh",
      customerPhone: "0988776655",
      shippingAddress: "Toà R4 Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội",
      paymentMethod: "vietqr" as const,
      promoCode: "SMALL2026",
      idempotencyKey: `IDEM-TEST-${Date.now()}-2`,
      items: [{ productId: "p1", quantity: 1 }], // 680,000 VND
    };

    const res = await processDemoCheckout(payload);
    expect(res.success).toBe(true);

    const order = getOrderById(res.orderId!);
    expect(order?.subtotalVnd).toBe(680000);
    // 10% of 680,000 = 68,000 VND
    expect(order?.discountVnd).toBe(68000);
    // Subtotal < 1M => Shipping is 35,000 VND
    expect(order?.shippingVnd).toBe(35000);
    // Total = 680,000 - 68,000 + 35,000 = 647,000 VND
    expect(order?.totalVnd).toBe(647000);
  });

  it("[B007] idempotency key returns existing order without creating duplicate records", async () => {
    const fixedKey = `IDEM-STABLE-${Date.now()}`;
    const payload = {
      customerName: "Phạm Hải Đăng",
      customerPhone: "0977112233",
      shippingAddress: "Số 95 Cầu Giấy, Phường Quan Hoa, Hà Nội",
      paymentMethod: "momo" as const,
      idempotencyKey: fixedKey,
      items: [{ productId: "p3", quantity: 1 }], // 420,000 VND
    };

    // First checkout call
    const res1 = await processDemoCheckout(payload);
    expect(res1.success).toBe(true);

    // Second checkout call with identical idempotency key
    const res2 = await processDemoCheckout(payload);
    expect(res2.success).toBe(true);
    expect(res2.orderId).toBe(res1.orderId);
    expect(res2.orderCode).toBe(res1.orderCode);
  });

  it("[B008] fails gracefully and prevents order placement when product is non-existent", async () => {
    const payload = {
      customerName: "Nguyễn Văn Lỗi",
      customerPhone: "0933221100",
      shippingAddress: "Địa chỉ thử nghiệm",
      paymentMethod: "cod" as const,
      idempotencyKey: `IDEM-FAIL-${Date.now()}`,
      items: [{ productId: "non-existent-product-id", quantity: 1 }],
    };

    const res = await processDemoCheckout(payload);
    expect(res.success).toBe(false);
    expect(res.error).toContain("không tồn tại");
  });
});

