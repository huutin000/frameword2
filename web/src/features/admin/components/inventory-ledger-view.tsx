"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Ruler,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";
import type { InventoryBalanceRecord, InventoryLedgerRecord } from "../data/inventory-store";
import { adjustStockAction } from "../actions/inventory-actions";
import { formatVND } from "@/lib/formatters/currency";
import { Button } from "@/components/ui/button";
import { BulkConfirmModal } from "./bulk-confirm-modal";

interface InventoryLedgerViewProps {
  initialBalances: InventoryBalanceRecord[];
  initialLedger: InventoryLedgerRecord[];
}

export function InventoryLedgerView({
  initialBalances,
  initialLedger,
}: InventoryLedgerViewProps) {
  const [balances, setBalances] = useState<InventoryBalanceRecord[]>(initialBalances);
  const [ledger, setLedger] = useState<InventoryLedgerRecord[]>(initialLedger);
  const [activeTab, setActiveTab] = useState<"balances" | "ledger">("balances");

  // Adjustment modal states
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [changeAmount, setChangeAmount] = useState<number>(10);
  const [actionType, setActionType] = useState<"import" | "manual_audit">("import");
  const [referenceId, setReferenceId] = useState("");
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Bulk dangerous action states (A041)
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const bulkDelta = 15;

  const selectedItem = balances.find((b) => b.sku === selectedSku);

  const toggleSelectSku = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSkus.length === balances.length) {
      setSelectedSkus([]);
    } else {
      setSelectedSkus(balances.map((b) => b.sku));
    }
  };

  const handleBulkConfirm = async () => {
    setIsBulkModalOpen(false);
    setIsSubmitting(true);
    setMessage(null);

    const successes: string[] = [];
    const failures: { sku: string; error: string }[] = [];

    for (const sku of selectedSkus) {
      const res = await adjustStockAction(
        sku,
        bulkDelta,
        "import",
        `BULK-${Date.now().toString().slice(-6)}`,
        `Nhập bổ sung khẩn cấp hàng loạt +${bulkDelta} (A041 Bulk Action)`
      );
      if (res.success && res.balance) {
        successes.push(sku);
        setBalances((prev) =>
          prev.map((b) => (b.sku === sku ? res.balance! : b))
        );
        if (res.ledgerEntry) {
          setLedger((prev) => [res.ledgerEntry!, ...prev]);
        }
      } else {
        failures.push({ sku, error: res.error || "Thất bại khi cập nhật tồn" });
      }
    }

    if (failures.length === 0) {
      setMessage({
        type: "success",
        text: `Đã hoàn tất điều chỉnh hàng loạt cho ${successes.length} SKU thành công!`,
      });
    } else {
      setMessage({
        type: "error",
        text: `Thao tác hàng loạt hoàn tất một phần (A041): Thành công ${successes.length}/${selectedSkus.length} SKU, Thất bại ${failures.length} SKU (${failures.map((f) => `${f.sku}: ${f.error}`).join(", ")})`,
      });
    }

    setSelectedSkus([]);
    setIsSubmitting(false);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku) return;

    setIsSubmitting(true);
    setMessage(null);

    const delta = actionType === "import" ? Math.abs(changeAmount) : changeAmount;
    const res = await adjustStockAction(
      selectedSku,
      delta,
      actionType,
      referenceId.trim(),
      adjustmentNote.trim() || (actionType === "import" ? "Nhập bổ sung kho" : "Kiểm kê điều chỉnh")
    );

    if (res.success && res.balance) {
      setBalances((prev) =>
        prev.map((b) => (b.sku === selectedSku ? res.balance! : b))
      );
      if (res.ledgerEntry) {
        setLedger((prev) => [res.ledgerEntry!, ...prev]);
      }
      setMessage({
        type: "success",
        text: `Đã cập nhật tồn kho cho ${res.balance.productTitle} thành công!`,
      });
      setSelectedSku(null);
      setChangeAmount(10);
      setReferenceId("");
      setAdjustmentNote("");
    } else {
      setMessage({
        type: "error",
        text: res.error || "Không thể thực hiện điều chỉnh kho",
      });
    }
    setIsSubmitting(false);
  };

  const lowStockCount = balances.filter((b) => b.availableStock <= b.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
            Sổ cái tồn kho & Biến động SpaceFit™ (A021 / A022)
          </h1>
          <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
            Mỗi thao tác bán lẻ, hủy đơn hoặc nhập hàng đều được ghi nhận bất biến vào sổ cái kiểm toán.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#D3C7B7]">
          <button
            onClick={() => setActiveTab("balances")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "balances"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:text-[#29241E]"
            }`}
          >
            Số dư tồn kho ({balances.length})
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ledger"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:text-[#29241E]"
            }`}
          >
            Nhật ký xuất nhập ({ledger.length})
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-[#EBF0ED] border-[#C5D3CC] text-[#3E5247]"
              : "bg-[#FDF2F0] border-[#F5C2BC] text-[#A05C52]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#5B7065] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#A05C52] shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Low stock alert box */}
      {lowStockCount > 0 && (
        <div className="p-3.5 bg-[#FFF9E6] border border-[#F4E0A5] rounded-xl flex items-center gap-3 text-xs text-[#7A5B00]">
          <AlertTriangle className="w-5 h-5 text-[#C48C00] shrink-0" />
          <div>
            Có <strong>{lowStockCount} sản phẩm</strong> đang ở dưới mức định mức an toàn (&le; ngưỡng cảnh báo). Vui lòng lên kế hoạch nhập hàng!
          </div>
        </div>
      )}

      {/* Tab 1: Current Stock Balances Table */}
      {activeTab === "balances" && (
        <div className="space-y-3">
          {/* Bulk Selection Bar (A041) */}
          {selectedSkus.length > 0 && (
            <div className="bg-[#FAF8F5] border border-[#5B7065]/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-[#29241E]">
                <Layers className="w-4 h-4 text-[#5B7065]" />
                <span>
                  Đã chọn <strong>{selectedSkus.length} / {balances.length}</strong> sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkus([])}
                  className="text-xs text-[#786C5E]"
                >
                  Bỏ chọn
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsBulkModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Điều chỉnh hàng loạt (+{bulkDelta} tồn kho)</span>
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                    <th className="py-3 px-3 w-10 text-center">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        title="Chọn tất cả"
                        className="text-[#5B7065] hover:text-[#3E5247]"
                      >
                        {selectedSkus.length === balances.length && balances.length > 0 ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">SKU / Sản phẩm</th>
                    <th className="py-3 px-4">Kích thước (mm)</th>
                    <th className="py-3 px-4 text-center">Khả dụng</th>
                    <th className="py-3 px-4 text-center">Đang giữ chỗ</th>
                    <th className="py-3 px-4 text-center">Định mức tối thiểu</th>
                    <th className="py-3 px-4">Giá vốn nhập</th>
                    <th className="py-3 px-4">Trạng thái kho</th>
                    <th className="py-3 px-4 text-right">Điều phối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFEA]">
                  {balances.map((b) => {
                    const isLow = b.availableStock <= b.lowStockThreshold;
                    const isSelected = selectedSkus.includes(b.sku);
                    return (
                      <tr
                        key={b.sku}
                        className={`hover:bg-[#FAF8F5]/60 transition-colors ${
                          isSelected ? "bg-[#FAF8F5]" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectSku(b.sku)}
                            className="text-[#5B7065] hover:text-[#3E5247]"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#29241E]">{b.productTitle}</div>
                          <div className="font-mono text-[11px] text-[#786C5E] mt-0.5">{b.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#5A4033] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Ruler className="w-3 h-3 text-[#5B7065]" />
                            <span>{b.dimensions}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-sm text-[#29241E]">
                          {b.availableStock}
                        </td>
                        <td className="py-3 px-4 text-center text-[#786C5E] font-medium">
                          {b.reservedStock}
                        </td>
                        <td className="py-3 px-4 text-center text-[#5A4033] font-mono">
                          {b.lowStockThreshold}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#786C5E]">
                          {formatVND(b.unitCostVnd)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#FDF2F0] text-[#A05C52] px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Sắp hết hàng</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#EBF0ED] text-[#3E5247] px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>An toàn</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedSku(b.sku)}
                            className="gap-1 text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Nhập / Điều chỉnh</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Append-only Inventory Ledger */}
      {activeTab === "ledger" && (
        <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Mã SKU / Sản phẩm</th>
                  <th className="py-3 px-4">Loại biến động</th>
                  <th className="py-3 px-4 text-center">Thay đổi</th>
                  <th className="py-3 px-4 text-center">Tồn trước &rarr; sau</th>
                  <th className="py-3 px-4">Mã đối chiếu</th>
                  <th className="py-3 px-4">Ghi chú & Tác nhân</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EFEA]">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 text-[#786C5E] font-mono whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#29241E]">{entry.productTitle}</div>
                      <div className="font-mono text-[11px] text-[#786C5E]">{entry.sku}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-[#5A4033]">
                        {entry.movementType === "import"
                          ? "Nhập kho sản xuất"
                          : entry.movementType === "order_reservation"
                          ? "Tạm giữ đơn hàng"
                          : entry.movementType === "order_deduction"
                          ? "Xuất kho giao vận"
                          : entry.movementType === "cancellation_restock"
                          ? "Hoàn kho hủy đơn"
                          : "Kiểm kê điều chỉnh"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm">
                      <span
                        className={entry.quantityChange > 0 ? "text-[#5B7065]" : "text-[#A05C52]"}
                      >
                        {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#786C5E]">
                      {entry.previousStock} &rarr; <strong>{entry.newStock}</strong>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#29241E] font-semibold">
                      {entry.referenceId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#29241E]">{entry.note}</div>
                      <div className="text-[10px] text-[#786C5E] italic">Bởi: {entry.actor}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-white border border-[#E7E0D6] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95"
          >
            <h2 className="text-base font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Điều chỉnh tồn kho: {selectedItem.sku}
            </h2>

            <div className="p-3 bg-[#FAF8F5] rounded-xl text-xs space-y-1">
              <div className="font-semibold text-[#29241E]">{selectedItem.productTitle}</div>
              <div className="text-[#786C5E]">
                Tồn khả dụng hiện tại: <strong className="text-[#5B7065] text-sm">{selectedItem.availableStock}</strong> cái
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Loại điều chỉnh</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType("import")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      actionType === "import"
                        ? "bg-[#5B7065] text-white border-[#5B7065]"
                        : "bg-[#FAF8F5] border-[#D3C7B7] text-[#5A4033]"
                    }`}
                  >
                    + Nhập bổ sung
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType("manual_audit")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      actionType === "manual_audit"
                        ? "bg-[#5B7065] text-white border-[#5B7065]"
                        : "bg-[#FAF8F5] border-[#D3C7B7] text-[#5A4033]"
                    }`}
                  >
                    Kiểm kê lệch kho
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">
                  Số lượng thay đổi {actionType === "import" ? "(+)" : "(dương để thêm, âm để trừ)"}
                </label>
                <input
                  type="number"
                  required
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Mã tham chiếu (PO / Phiếu kiểm kê)</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="VD: PO-2026-XUONG02"
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Lý do điều chỉnh</label>
                <input
                  type="text"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="VD: Nhập thêm 20 sản phẩm từ kho tổng"
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E0D6]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSku(null)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary" size="sm" className="font-bold">
                {isSubmitting ? "Đang ghi sổ..." : "Xác nhận ghi sổ cái"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Dangerous Action 2-Step Confirmation Modal (A041) */}
      <BulkConfirmModal
        isOpen={isBulkModalOpen}
        title="Xác nhận điều chỉnh tồn kho hàng loạt"
        description={`Bạn đang thực hiện thao tác nhập bổ sung +${bulkDelta} tồn kho trên ${selectedSkus.length} SKU đã chọn. Toàn bộ các dòng biến động sẽ được ghi nhận bất biến vào sổ cái kiểm toán.`}
        itemCount={selectedSkus.length}
        expectedConfirmationText="XAC NHAN"
        onConfirm={handleBulkConfirm}
        onCancel={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
}
