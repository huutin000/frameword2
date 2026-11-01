"use client";

import React from "react";
import type { PlannerItem, SceneEvaluation } from "../utils/collision";
import { getEffectiveDimensions } from "../utils/collision";
import { getAllAdminProducts } from "@/features/admin/data/product-store";
import type { CatalogProduct } from "@/features/catalog/types";
import { formatVND } from "@/lib/formatters/currency";
import {
  RotateCw,
  Trash2,
  Plus,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";

export interface PlannerSidebarProps {
  items: PlannerItem[];
  selectedItem: PlannerItem | null;
  sceneSummary: SceneEvaluation;
  onAddItem: (product: CatalogProduct) => void;
  onRotateItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateCoordinates: (id: string, xMm: number, zMm: number) => void;
  onAddAllToCart: () => void;
  onSaveScene: () => void;
  onClearScene: () => void;
  justAddedToCart: boolean;
  savedSuccess: boolean;
}

export function PlannerSidebar({
  items,
  selectedItem,
  sceneSummary,
  onAddItem,
  onRotateItem,
  onDeleteItem,
  onUpdateCoordinates,
  onAddAllToCart,
  onSaveScene,
  onClearScene,
  justAddedToCart,
  savedSuccess,
}: PlannerSidebarProps) {
  const catalogProducts = getAllAdminProducts();
  const totalCostVnd = items.reduce((sum, item) => sum + item.priceVnd, 0);

  return (
    <div className="space-y-6">
      {/* 1. Selected Item Inspector (if an item is selected) */}
      {selectedItem ? (
        <div className="bg-white border-2 border-[#5B7065] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E7E0D6]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B7065]">
                Đang Chọn
              </span>
              <h3 className="text-sm font-bold text-[#29241E] line-clamp-1">
                {selectedItem.name}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#5B7065] font-mono">
              {formatVND(selectedItem.priceVnd)}
            </span>
          </div>

          {/* Effective dimensions & coordinates */}
          {(() => {
            const dims = getEffectiveDimensions(selectedItem);
            return (
              <div className="space-y-2.5 text-xs text-[#5A4033]">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E7E0D6]">
                    <span className="block text-[10px] text-[#7A7265]">Kích thước đáy</span>
                    <strong className="font-mono">{dims.effectiveWidthMm} × {dims.effectiveDepthMm} mm</strong>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E7E0D6]">
                    <span className="block text-[10px] text-[#7A7265]">Chiều cao</span>
                    <strong className="font-mono">{selectedItem.heightMm} mm</strong>
                  </div>
                </div>

                {/* Coordinate Inputs */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7265] mb-0.5">Tọa độ X (mm)</label>
                    <input
                      type="number"
                      step={50}
                      value={selectedItem.xMm}
                      onChange={(e) =>
                        onUpdateCoordinates(selectedItem.id, Number(e.target.value), selectedItem.zMm)
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[#DED7CC] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7265] mb-0.5">Tọa độ Z (mm)</label>
                    <input
                      type="number"
                      step={50}
                      value={selectedItem.zMm}
                      onChange={(e) =>
                        onUpdateCoordinates(selectedItem.id, selectedItem.xMm, Number(e.target.value))
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[#DED7CC] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E7E0D6]">
            <button
              onClick={() => onRotateItem(selectedItem.id)}
              className="py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#E7E0D6] text-xs font-bold text-[#29241E] flex items-center justify-center gap-1.5 transition-colors border border-[#E7E0D6]"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#5B7065]" />
              <span>Xoay 90° (Phím R)</span>
            </button>

            <button
              onClick={() => onDeleteItem(selectedItem.id)}
              className="py-2 px-3 rounded-xl bg-[#FDF2F2] hover:bg-[#FCE8E8] text-xs font-bold text-[#9E2A2B] flex items-center justify-center gap-1.5 transition-colors border border-[#F2B8B8]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa (Phím Del)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF7F2] border border-dashed border-[#DED7CC] rounded-2xl p-4 text-center text-xs text-[#7A7265]">
          Nhấp vào một món đồ trong phòng để di chuyển, xoay hoặc chỉnh tọa độ.
        </div>
      )}

      {/* 2. SpaceFit Room Analysis Card */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5B7065]" />
            <h3 className="text-sm font-bold text-[#29241E] uppercase tracking-wider">
              SpaceFit™ Phân Tích Phòng
            </h3>
          </div>
          <span className="text-xs font-bold text-[#5B7065]">
            {items.length} món đồ
          </span>
        </div>

        {/* Warning Alert if collision or out of bounds */}
        {sceneSummary.hasCollisions && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F2B8B8] rounded-xl flex items-start gap-2 text-xs text-[#9E2A2B]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Cảnh báo va chạm:</strong> Có {sceneSummary.collidingPairs.length} vị trí đồ đạc đang bị xếp đè lên nhau.
            </span>
          </div>
        )}

        {sceneSummary.hasOutOfBounds && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F2B8B8] rounded-xl flex items-start gap-2 text-xs text-[#9E2A2B]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Chạm tường:</strong> Một số món đang vượt quá chu vi bức tường phòng.
            </span>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
          <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E7E0D6]">
            <span className="block text-[10px] text-[#7A7265] uppercase font-semibold">
              Chiếm dụng sàn
            </span>
            <span className="block text-base font-bold text-[#29241E] mt-0.5">
              {sceneSummary.occupancyRatio}%
            </span>
            <span className="block text-[10px] text-[#A8A196]">
              {sceneSummary.occupiedAreaM2} / {sceneSummary.totalAreaM2} m²
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E7E0D6]">
            <span className="block text-[10px] text-[#7A7265] uppercase font-semibold">
              Sàn trống còn lại
            </span>
            <span className="block text-base font-bold text-[#5B7065] mt-0.5">
              {sceneSummary.freeAreaM2} m²
            </span>
            <span className="block text-[10px] text-[#A8A196]">
              {sceneSummary.occupancyRatio > 40 ? "Lối đi hẹp" : "Thông thoáng"}
            </span>
          </div>
        </div>

        {/* Total Cost & Cart Button */}
        <div className="pt-3 border-t border-[#E7E0D6] space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-[#7A7265] uppercase">
              Tổng giá trị nội thất:
            </span>
            <span className="text-lg font-black text-[#29241E] font-mono">
              {formatVND(totalCostVnd)}
            </span>
          </div>

          <button
            onClick={onAddAllToCart}
            disabled={items.length === 0}
            className="w-full py-3 rounded-xl bg-[#5B7065] hover:bg-[#4A5D53] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-40"
          >
            {justAddedToCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã thêm toàn bộ {items.length} món vào giỏ!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm tất cả vào giỏ hàng ({items.length} món)</span>
              </>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onSaveScene}
              className="flex-1 py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#E7E0D6] text-xs font-semibold text-[#29241E] transition-colors flex items-center justify-center gap-1.5 border border-[#E7E0D6]"
            >
              <Save className="w-3.5 h-3.5 text-[#5B7065]" />
              <span>{savedSuccess ? "Đã lưu!" : "Lưu thiết kế"}</span>
            </button>

            <button
              onClick={onClearScene}
              disabled={items.length === 0}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#FDF2F2] text-xs font-semibold text-[#7A7265] hover:text-[#9E2A2B] transition-colors flex items-center justify-center gap-1 border border-[#E7E0D6] disabled:opacity-30"
              title="Xóa trắng phòng"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Catalog Furniture Picker Drawer / List */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#29241E] uppercase tracking-wider">
          Thêm Nội Thất Vào Phòng
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {catalogProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => onAddItem(p)}
              className="w-full p-2.5 rounded-xl border border-[#E7E0D6] hover:border-[#5B7065] hover:bg-[#FAF8F5] transition-all flex items-center justify-between text-left group"
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-[#29241E] group-hover:text-[#5B7065] truncate">
                  {p.title}
                </div>
                <div className="text-[10px] text-[#7A7265] font-mono mt-0.5">
                  {p.widthMm} × {p.depthMm} × {p.heightMm} mm
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-[#5B7065]">
                  {formatVND(p.priceVnd)}
                </span>
                <span className="w-6 h-6 rounded-lg bg-[#FAF7F2] group-hover:bg-[#5B7065] group-hover:text-white flex items-center justify-center text-[#5B7065] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
