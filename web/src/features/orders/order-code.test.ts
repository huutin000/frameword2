import { describe, it, expect, vi } from "vitest";
import { createOrderIdentifiers } from "@/features/orders/utils/order-code";

describe("createOrderIdentifiers", () => {
  it("[POS] builds SL-2026-XXXXXXXX code and the matching lowercase id", () => {
    const { orderCode, orderId } = createOrderIdentifiers(() => false);
    expect(orderCode).toMatch(/^SL-2026-[0-9A-F]{8}$/);
    expect(orderId).toBe(`ord-${orderCode.toLowerCase()}`);
    expect(orderId.startsWith("ord-seed-")).toBe(false);
  });

  it("[POS] 1000 calls against a registry yield 1000 distinct codes", () => {
    const taken = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const { orderCode, orderId } = createOrderIdentifiers((c, id) => taken.has(c) || taken.has(id));
      taken.add(orderCode);
      taken.add(orderId);
    }
    expect(taken.size).toBe(2000);
  });

  it("[NEG] retries a taken candidate, then throws after 5 attempts when all are taken", () => {
    const suffixes = ["AAAAAAAA", "BBBBBBBB"];
    const next = vi.fn(() => suffixes.shift() ?? "CCCCCCCC");
    const result = createOrderIdentifiers((c) => c === "SL-2026-AAAAAAAA", next);
    expect(result.orderCode).toBe("SL-2026-BBBBBBBB");
    expect(next).toHaveBeenCalledTimes(2);

    const alwaysNext = vi.fn(() => "DDDDDDDD");
    expect(() => createOrderIdentifiers(() => true, alwaysNext)).toThrow();
    expect(alwaysNext).toHaveBeenCalledTimes(5);
  });
});
