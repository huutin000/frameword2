import { describe, it, expect } from "vitest";
import {
  getAllInventoryBalances,
  adjustInventoryStock,
} from "./data/inventory-store";

describe("A041: Bulk Dangerous Actions & Partial Failure Handling", () => {
  it("successfully updates all selected valid SKUs in a bulk batch", () => {
    const initialBalances = getAllInventoryBalances();
    const targetSkus = [initialBalances[0].sku, initialBalances[1].sku];
    const initialStocks = targetSkus.map(
      (s) => initialBalances.find((b) => b.sku === s)!.availableStock
    );

    const delta = 15;
    const successes: string[] = [];

    for (const sku of targetSkus) {
      const res = adjustInventoryStock(sku, delta, "import", "BULK-TEST", "Bulk restock");
      if (res.success) {
        successes.push(sku);
      }
    }

    expect(successes.length).toBe(targetSkus.length);

    const updatedBalances = getAllInventoryBalances();
    targetSkus.forEach((sku, idx) => {
      const updated = updatedBalances.find((b) => b.sku === sku)!;
      expect(updated.availableStock).toBe(initialStocks[idx] + delta);
    });
  });

  it("handles partial failure and reports failed items when some SKUs are invalid", () => {
    const initialBalances = getAllInventoryBalances();
    const validSku = initialBalances[0].sku;
    const invalidSku = "SKU-NON-EXISTENT-9999";
    const batch = [validSku, invalidSku];

    const successes: string[] = [];
    const failures: { sku: string; error: string }[] = [];

    for (const sku of batch) {
      const res = adjustInventoryStock(sku, 10, "import", "BULK-TEST", "Batch with error");
      if (res.success) {
        successes.push(sku);
      } else {
        failures.push({ sku, error: res.error || "Failed" });
      }
    }

    // A041: Must report partial failure accurately
    expect(successes.length).toBe(1);
    expect(successes[0]).toBe(validSku);
    expect(failures.length).toBe(1);
    expect(failures[0].sku).toBe(invalidSku);
    expect(failures[0].error).toContain("Không tìm thấy");
  });
});
