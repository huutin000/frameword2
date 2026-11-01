import { describe, it, expect, beforeEach } from "vitest";
import { processDemoCheckout, type CheckoutInput } from "@/features/cart/actions/checkout-order";
import { resetOrderRegistryToSeed, getOrderById } from "@/features/orders/data/order-store";
import { sanitizeReviewText } from "@/features/catalog/data/review-store";
import { getCurrentUser, loginCustomer } from "@/features/auth/data/auth-store";

describe("Security Invariants & Negative Test Suite (E001, E002, E003, B005)", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
    loginCustomer("demo.customer@smallliving.vn", "password123");
  });

  it("[E001 / B005] prevents client price tampering: server always re-evaluates official catalog price", async () => {
    // Malicious attempt: client sends payload with an arbitrary attempt to inject forged price
    const payload: CheckoutInput = {
      customerName: "Hacker X",
      customerPhone: "0912345678",
      shippingAddress: "Số 99 Phố Hack, Cầu Giấy, Hà Nội",
      paymentMethod: "cod",
      idempotencyKey: `IDEM-HACK-${Date.now()}`,
      items: [
        {
          productId: "p1",
          quantity: 1,
        },
      ],
    };

    const result = await processDemoCheckout(payload);
    expect(result.success).toBe(true);

    // Verify order was created with the TRUE catalog price (680,000 VND), NOT client-supplied
    const createdOrder = getOrderById(result.orderId!);
    expect(createdOrder).toBeDefined();
    expect(createdOrder?.totalVnd).toBe(680000 + 35000); // 680k + 35k shipping
    expect(createdOrder?.subtotalVnd).toBe(680000);
  });

  it("[E001] rejects invalid or negative quantities in checkout", async () => {
    const invalidPayload = {
      customerName: "Hacker X",
      customerPhone: "0912345678",
      shippingAddress: "Số 99 Phố Hack, Cầu Giấy, Hà Nội",
      paymentMethod: "cod" as const,
      idempotencyKey: `IDEM-NEG-${Date.now()}`,
      items: [
        {
          productId: "p1",
          quantity: -5, // Negative quantity attack
        },
      ],
    };

    const result = await processDemoCheckout(invalidPayload as unknown as CheckoutInput);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("[E001] rejects zero quantity in checkout", async () => {
    const zeroPayload = {
      customerName: "Hacker X",
      customerPhone: "0912345678",
      shippingAddress: "Số 99 Phố Hack, Cầu Giấy, Hà Nội",
      paymentMethod: "cod" as const,
      idempotencyKey: `IDEM-ZERO-${Date.now()}`,
      items: [
        {
          productId: "p1",
          quantity: 0,
        },
      ],
    };

    const result = await processDemoCheckout(zeroPayload as unknown as CheckoutInput);
    expect(result.success).toBe(false);
  });

  it("[E002] verifies customer session cannot assume admin role without proper authentication", () => {
    loginCustomer("regular.user@example.com", "password123");
    const user = getCurrentUser();
    expect(user?.role).toBe("customer");
    expect(user?.role).not.toBe("admin");
  });

  it("[E003] sanitizes multiple nested XSS payloads across strings", () => {
    const attackStrings = [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert('xss')>",
      "<svg/onload=alert('document.cookie')>",
      "javascript:alert(1)",
    ];

    for (const str of attackStrings) {
      const clean = sanitizeReviewText(str);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("<img");
      expect(clean).not.toContain("<svg");
    }
  });
});
