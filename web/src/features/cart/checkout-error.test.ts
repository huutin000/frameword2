import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/features/orders/data/order-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/orders/data/order-store")>();
  return {
    ...actual,
    saveNewOrder: vi.fn(actual.saveNewOrder),
    getOrderById: vi.fn(actual.getOrderById),
  };
});

import { processDemoCheckout, type CheckoutInput } from "@/features/cart/actions/checkout-order";
import { resetOrderRegistryToSeed, saveNewOrder, getOrderById } from "@/features/orders/data/order-store";

const MARKER = "SECRET-INTERNAL-DETAIL";
const PHONE_ERROR = "Số điện thoại không hợp lệ (VD: 0901234567)";
const GENERIC_ERROR = "Không thể xử lý đơn hàng. Vui lòng thử lại.";
const NAME = "qa-auto-Nguyen Van Private";
const PHONE = "0901234567";
const ADDRESS = "qa-auto-99 Duong Rieng Tu, Quan 3, TP HCM";

let seq = 0;

const buildPayload = (over: Partial<CheckoutInput> = {}): CheckoutInput => ({
  customerName: NAME,
  customerPhone: PHONE,
  shippingAddress: ADDRESS,
  paymentMethod: "cod",
  idempotencyKey: `qa-auto-idem-error-${++seq}-${Math.random().toString(36).slice(2)}`,
  items: [{ productId: "p1", quantity: 1 }],
  ...over,
});

describe("C-03 server action error handling", () => {
  beforeEach(() => {
    resetOrderRegistryToSeed();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    resetOrderRegistryToSeed();
  });

  it("[NEG] unexpected internal exception returns a generic message without the internal detail", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(saveNewOrder).mockImplementationOnce(() => {
      throw new Error(MARKER);
    });

    const result = await processDemoCheckout(buildPayload());

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).not.toContain(MARKER);
    expect(result.error!.length).toBeGreaterThan(0);
  });

  it("[NEG] internal exception is logged server-side without customer PII", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(saveNewOrder).mockImplementationOnce(() => {
      throw new Error(MARKER);
    });

    await processDemoCheckout(buildPayload());

    expect(errorSpy).toHaveBeenCalled();
    const logged = errorSpy.mock.calls
      .flat()
      .map((a) => (a instanceof Error ? `${a.message}\n${a.stack ?? ""}` : String(a)))
      .join("\n");
    expect(logged).toContain(MARKER);
    expect(logged).not.toContain(NAME);
    expect(logged).not.toContain(PHONE);
    expect(logged).not.toContain(ADDRESS);
  });

  it("[NEG] Zod validation messages are still returned unchanged (phone)", async () => {
    const result = await processDemoCheckout(buildPayload({ customerPhone: "0|12345678" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain(PHONE_ERROR);
  });

  it("[NEG] Zod quantity-cap message is still returned unchanged", async () => {
    const result = await processDemoCheckout(buildPayload({ items: [{ productId: "p1", quantity: 1_000_000 }] }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/tối đa/);
  });

  it("[NEG] C-02 every generated order id is already taken: generic failure after 5 attempts, nothing saved", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const takenOrder = getOrderById("ord-seed-01");
    expect(takenOrder).toBeDefined();
    vi.mocked(getOrderById).mockReturnValue(takenOrder);
    vi.mocked(saveNewOrder).mockClear();

    try {
      const result = await processDemoCheckout(buildPayload());

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toBe(GENERIC_ERROR);
      expect(saveNewOrder).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      // 5 attempts x 1 probe: the first lookup (code) is truthy, so the id lookup is short-circuited.
      expect(vi.mocked(getOrderById).mock.calls.length).toBeGreaterThanOrEqual(5);
    } finally {
      vi.mocked(getOrderById).mockReset();
    }
  });
});
