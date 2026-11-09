import { describe, it, expect, beforeEach } from "vitest";
import { processDemoCheckout, type CheckoutInput } from "@/features/cart/actions/checkout-order";
import { resetOrderRegistryToSeed } from "@/features/orders/data/order-store";

import { VN_PHONE_REGEX } from "@/features/cart/utils/phone";

const PHONE_ERROR = "Số điện thoại không hợp lệ (VD: 0901234567)";

describe("VN_PHONE_REGEX (shared by client checkout form and server action)", () => {
  it.each(["0901234567", "0351234567", "0561234567", "0701234567", "0801234567", "+84901234567"])(
    "[POS] matches %s",
    (phone) => expect(VN_PHONE_REGEX.test(phone)).toBe(true)
  );

  it.each(["0|12345678", "+84|12345678", "0201234567", "0401234567", "0601234567", "090123456", "09012345678", ""])(
    "[NEG] does not match %j",
    (phone) => expect(VN_PHONE_REGEX.test(phone)).toBe(false)
  );

  it("[NEG] has no global/sticky flag, so .test() is stateless across calls", () => {
    expect(VN_PHONE_REGEX.global || VN_PHONE_REGEX.sticky).toBe(false);
  });
});

describe("Checkout phone validation (server action)", () => {
  let seq = 0;

  const buildPayload = (customerPhone: unknown) =>
    ({
      customerName: "qa-auto-Nguyen Van A",
      customerPhone,
      shippingAddress: "qa-auto-123 Duong Test, Quan 1, TP HCM",
      paymentMethod: "cod" as const,
      idempotencyKey: `qa-auto-idem-phone-${++seq}-${Date.now()}`,
      items: [{ productId: "p1", quantity: 1 }],
    }) as unknown as CheckoutInput;

  beforeEach(() => {
    resetOrderRegistryToSeed();
  });

  it.each([
    "0901234567", // 09x
    "0351234567", // 03x
    "0561234567", // 05x
    "0701234567", // 07x
    "0801234567", // 08x
    "+84901234567",
    "+84351234567",
  ])("[POS] accepts valid number %s", async (phone) => {
    const result = await processDemoCheckout(buildPayload(phone));
    expect(result.success).toBe(true);
  });

  it.each([
    ["pipe as second digit", "0|12345678"],
    ["pipe after +84", "+84|12345678"],
    ["pipe in the middle", "090|234567"],
    ["pipe at the end", "090123456|"],
    ["9 digits", "090123456"],
    ["11 digits", "09012345678"],
    ["+84 with 9 digits", "+8490123456"],
    ["+84 with 11 digits", "+849012345678"],
    ["prefix 02", "0201234567"],
    ["prefix 04", "0401234567"],
    ["prefix 06", "0601234567"],
    ["prefix 01", "0101234567"],
    ["letters", "09abc34567"],
    ["only letters", "abcdefghij"],
    ["empty", ""],
    ["no leading 0 or +84", "9012345678"],
    ["spaces inside", "0901 234 567"],
    ["trailing newline", "0901234567\n"],
  ])("[NEG] rejects %s (%s)", async (_label, phone) => {
    const payload = buildPayload(phone);
    const result = await processDemoCheckout(payload);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain(PHONE_ERROR);
  });

  it("[NEG] server does not trim: surrounding whitespace is rejected (the client trims before sending)", async () => {
    const result = await processDemoCheckout(buildPayload(" 0901234567 "));
    expect(result.success).toBe(false);
  });
});
