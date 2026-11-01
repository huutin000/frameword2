import React from "react";
import {
  getAllInventoryBalances,
  getAllInventoryLedger,
} from "@/features/admin/data/inventory-store";
import { InventoryLedgerView } from "@/features/admin/components/inventory-ledger-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sổ cái tồn kho & Biến động | Admin Small Living",
  description: "Theo dõi lượng tồn khả dụng, định mức an toàn và nhật ký xuất nhập kho bất biến.",
};

export default function AdminInventoryPage() {
  const balances = getAllInventoryBalances();
  const ledger = getAllInventoryLedger();

  return <InventoryLedgerView initialBalances={balances} initialLedger={ledger} />;
}

