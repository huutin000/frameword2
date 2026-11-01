import { describe, it, expect } from "vitest";
import {
  getAllInventoryBalances,
  getAllInventoryLedger,
  adjustInventoryStock,
} from "./data/inventory-store";

describe("[A021 / A022] Inventory Ledger & Non-Negative Stock Invariant", () => {
  it("retrieves current inventory balances and low stock warnings", () => {
    const balances = getAllInventoryBalances();
    expect(balances.length).toBeGreaterThanOrEqual(6);

    const lowStock = balances.filter((b) => b.availableStock <= b.lowStockThreshold);
    expect(lowStock.length).toBeGreaterThan(0);
  });

  it("[A021] records stock import and appends entry to ledger", () => {
    const initialLedgerCount = getAllInventoryLedger().length;
    const res = adjustInventoryStock(
      "SL-P1-101",
      10,
      "import",
      "PO-TEST-001",
      "Nhập thử nghiệm 10 cái"
    );

    expect(res.success).toBe(true);
    expect(res.balance?.availableStock).toBeGreaterThan(15);

    const updatedLedger = getAllInventoryLedger();
    expect(updatedLedger.length).toBe(initialLedgerCount + 1);
    expect(updatedLedger[0].movementType).toBe("import");
    expect(updatedLedger[0].quantityChange).toBe(10);
  });

  it("[A022] enforces invariant: prevents negative stock balance under concurrent/oversell conditions", () => {
    const balance = getAllInventoryBalances().find((b) => b.sku === "SL-P1-101")!;
    const excessiveDeduction = -(balance.availableStock + 999);

    const res = adjustInventoryStock(
      "SL-P1-101",
      excessiveDeduction,
      "order_deduction",
      "ORD-TEST-FAIL",
      "Thử trừ vượt tồn kho"
    );

    expect(res.success).toBe(false);
    expect(res.error).toContain("không thể âm");
  });
});

