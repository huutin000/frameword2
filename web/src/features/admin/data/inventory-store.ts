export type MovementType =
  | "import"
  | "order_reservation"
  | "order_deduction"
  | "cancellation_restock"
  | "manual_audit";

export interface InventoryLedgerRecord {
  id: string;
  sku: string;
  productTitle: string;
  movementType: MovementType;
  quantityChange: number; // e.g. +10, -2, +1
  previousStock: number;
  newStock: number;
  referenceId: string;
  note: string;
  actor: string;
  createdAt: string;
}

export interface InventoryBalanceRecord {
  sku: string;
  productId: string;
  productTitle: string;
  dimensions: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  unitCostVnd: number;
  lastRestockedAt: string;
}

const INVENTORY_BALANCES: InventoryBalanceRecord[] = [
  {
    sku: "SL-P1-101",
    productId: "p1",
    productTitle: "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm",
    dimensions: "600 × 280 × 2600 mm",
    availableStock: 15,
    reservedStock: 1,
    lowStockThreshold: 5,
    unitCostVnd: 420000,
    lastRestockedAt: "2026-10-25T08:00:00Z",
  },
  {
    sku: "SL-P2-102",
    productId: "p2",
    productTitle: "Bàn Làm Việc Gấp Gọn Piston Thủy Lực 800mm",
    dimensions: "800 × 500 × 750 mm",
    availableStock: 18,
    reservedStock: 1,
    lowStockThreshold: 5,
    unitCostVnd: 750000,
    lastRestockedAt: "2026-10-26T09:00:00Z",
  },
  {
    sku: "SL-P3-103",
    productId: "p3",
    productTitle: "Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe",
    dimensions: "150 × 450 × 850 mm",
    availableStock: 22,
    reservedStock: 2,
    lowStockThreshold: 8,
    unitCostVnd: 260000,
    lastRestockedAt: "2026-10-28T14:00:00Z",
  },
  {
    sku: "SL-P4-104",
    productId: "p4",
    productTitle: "Hộp Lưu Trữ Nắp Đôi Có Bánh Xe Dưới Gầm Giường",
    dimensions: "800 × 400 × 180 mm",
    availableStock: 4, // Below low stock threshold!
    reservedStock: 0,
    lowStockThreshold: 6,
    unitCostVnd: 190000,
    lastRestockedAt: "2026-10-20T10:00:00Z",
  },
  {
    sku: "SL-P5-105",
    productId: "p5",
    productTitle: "Cây Treo Quần Áo Bo Góc Chữ L 450mm",
    dimensions: "450 × 450 × 1750 mm",
    availableStock: 3, // Below low stock threshold!
    reservedStock: 0,
    lowStockThreshold: 5,
    unitCostVnd: 310000,
    lastRestockedAt: "2026-10-22T11:00:00Z",
  },
  {
    sku: "SL-P6-106",
    productId: "p6",
    productTitle: "Giàn Phơi Xếp Gọn Gắn Lan Can Ban Công 900mm",
    dimensions: "900 × 500 × 300 mm",
    availableStock: 26,
    reservedStock: 0,
    lowStockThreshold: 5,
    unitCostVnd: 340000,
    lastRestockedAt: "2026-10-29T16:00:00Z",
  },
];

const INVENTORY_LEDGER: InventoryLedgerRecord[] = [
  {
    id: "mvt-01",
    sku: "SL-P1-101",
    productTitle: "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm",
    movementType: "import",
    quantityChange: 20,
    previousStock: 0,
    newStock: 20,
    referenceId: "PO-2026-001",
    note: "Nhập lô hàng sản xuất đợt 1 từ xưởng Mộc Tinh Gọn",
    actor: "Nguyễn Văn Kho (Admin)",
    createdAt: "2026-10-25T08:00:00Z",
  },
  {
    id: "mvt-02",
    sku: "SL-P1-101",
    productTitle: "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm",
    movementType: "order_reservation",
    quantityChange: -1,
    previousStock: 20,
    newStock: 19,
    referenceId: "SL-2026-001",
    note: "Giữ chỗ tồn kho cho đơn hàng SL-2026-001",
    actor: "Hệ thống (Checkout)",
    createdAt: "2026-10-31T08:30:00Z",
  },
  {
    id: "mvt-03",
    sku: "SL-P3-103",
    productTitle: "Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe",
    movementType: "order_deduction",
    quantityChange: -2,
    previousStock: 24,
    newStock: 22,
    referenceId: "SL-2026-002",
    note: "Xuất kho bàn giao Viettel Post cho đơn SL-2026-002",
    actor: "Trần Đóng Gói (Staff)",
    createdAt: "2026-10-31T10:00:00Z",
  },
];

export function getAllInventoryBalances(): InventoryBalanceRecord[] {
  return [...INVENTORY_BALANCES];
}

export function getAllInventoryLedger(): InventoryLedgerRecord[] {
  return [...INVENTORY_LEDGER].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function adjustInventoryStock(
  sku: string,
  quantityChange: number,
  movementType: MovementType,
  referenceId: string,
  note: string,
  actor = "Admin"
): {
  success: boolean;
  balance?: InventoryBalanceRecord;
  ledgerEntry?: InventoryLedgerRecord;
  error?: string;
} {
  const balance = INVENTORY_BALANCES.find((b) => b.sku === sku);
  if (!balance) return { success: false, error: `Không tìm thấy mã SKU: ${sku}` };

  const previousStock = balance.availableStock;
  const newStock = previousStock + quantityChange;

  // Invariant check: Never negative stock (A022)
  if (newStock < 0) {
    return {
      success: false,
      error: `Thao tác thất bại: Số lượng tồn kho không thể âm (Hiện có: ${previousStock}, Cần trừ: ${Math.abs(quantityChange)})`,
    };
  }

  balance.availableStock = newStock;
  if (quantityChange > 0 && movementType === "import") {
    balance.lastRestockedAt = new Date().toISOString();
  }

  const ledgerEntry: InventoryLedgerRecord = {
    id: `mvt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sku,
    productTitle: balance.productTitle,
    movementType,
    quantityChange,
    previousStock,
    newStock,
    referenceId: referenceId || `ADJ-${Date.now().toString().slice(-4)}`,
    note,
    actor,
    createdAt: new Date().toISOString(),
  };

  INVENTORY_LEDGER.unshift(ledgerEntry);
  return { success: true, balance, ledgerEntry };
}
