import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { processDemoCheckout, type CheckoutInput } from "@/features/cart/actions/checkout-order";
import { resetOrderRegistryToSeed, getOrderById } from "@/features/orders/data/order-store";

let seq = 0;

const buildPayload = (paymentMethod: "cod" | "vietqr" | "momo" = "cod"): CheckoutInput => ({
  customerName: "qa-auto-Nguyen Van A",
  customerPhone: "0901234567",
  shippingAddress: "qa-auto-123 Duong Test, Quan 1, TP HCM",
  paymentMethod,
  idempotencyKey: `qa-auto-idem-hardening-${++seq}-${Math.random().toString(36).slice(2)}`,
  items: [{ productId: "p1", quantity: 1 }],
});

describe("C-01 order id collision (Date.now suffix repeats)", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    resetOrderRegistryToSeed();
  });

  it.each([
    ["same millisecond", 0],
    ["1,000,000 ms apart (same 6-digit suffix)", 1_000_000],
  ])("[NEG] two orders created %s get distinct ids and are each retrievable", async (_label, deltaMs) => {
    const base = new Date("2026-06-01T10:00:00.000Z").getTime();

    vi.setSystemTime(base);
    const first = await processDemoCheckout(buildPayload());
    vi.setSystemTime(base + deltaMs);
    const second = await processDemoCheckout(buildPayload());

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) return;

    expect(second.orderId).not.toBe(first.orderId);
    expect(second.orderCode).not.toBe(first.orderCode);
    expect(getOrderById(first.orderId!)?.orderCode).toBe(first.orderCode);
    expect(getOrderById(second.orderId!)?.orderCode).toBe(second.orderCode);
    expect(getOrderById(first.orderId!)?.idempotencyKey).not.toBe(
      getOrderById(second.orderId!)?.idempotencyKey
    );
  });
});

describe("C-04 payment status of newly created orders", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    resetOrderRegistryToSeed();
  });

  it.each(["cod", "vietqr", "momo"] as const)("[POS] %s order is created with paymentStatus pending", async (method) => {
    const result = await processDemoCheckout(buildPayload(method));
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(getOrderById(result.orderId!)?.paymentStatus).toBe("pending");
  });
});
