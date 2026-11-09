import { describe, it, expect } from "vitest";
import { MAX_CART_ITEM_QUANTITY, clampCartQuantity } from "@/features/cart/utils/quantity";

describe("clampCartQuantity (per-line cart quantity cap)", () => {
  it("[BND] exposes the cap as 25", () => {
    expect(MAX_CART_ITEM_QUANTITY).toBe(25);
  });

  it.each([
    [0, 1],
    [-5, 1],
    [1, 1],
    [24, 24],
    [25, 25],
    [26, 25],
    [1000, 25],
    [2.9, 2],
    [0.4, 1],
    [Infinity, 25],
    [-Infinity, 1],
    ["7", 7],
  ])("[BND] clamps %j to %i", (input, expected) => {
    expect(clampCartQuantity(input)).toBe(expected);
  });

  it.each([[NaN], [undefined], ["abc"]])("[NEG] falls back to 1 for non-numeric %j", (input) => {
    expect(clampCartQuantity(input)).toBe(1);
  });

  it("[NEG] coerces null to 1 (Number(null) === 0, raised to the minimum)", () => {
    expect(clampCartQuantity(null)).toBe(1);
  });

  it("[PROP] always returns an integer within [1, MAX] for generated inputs", () => {
    let seed = 12345;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 500; i++) {
      const v = (rand() - 0.5) * 2000;
      const out = clampCartQuantity(v);
      expect(Number.isInteger(out)).toBe(true);
      expect(out).toBeGreaterThanOrEqual(1);
      expect(out).toBeLessThanOrEqual(MAX_CART_ITEM_QUANTITY);
      expect(clampCartQuantity(out)).toBe(out); // idempotent
    }
  });
});
