"use client";

import React, { useState } from "react";
import { Tag, Plus, Trash2, Power, CheckCircle2, AlertCircle } from "lucide-react";
import type { PromotionRecord } from "../data/promotion-store";
import {
  createPromotionAction,
  togglePromotionStatusAction,
  deletePromotionAction,
} from "../actions/promotion-actions";
import { formatVND } from "@/lib/formatters/currency";
import { Button } from "@/components/ui/button";

interface PromotionManagementViewProps {
  initialPromotions: PromotionRecord[];
}

export function PromotionManagementView({ initialPromotions }: PromotionManagementViewProps) {
  const [promotions, setPromotions] = useState<PromotionRecord[]>(initialPromotions);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [maxDiscountVnd, setMaxDiscountVnd] = useState(500000);
  const [minOrderVnd, setMinOrderVnd] = useState(0);
  const [usageLimit, setUsageLimit] = useState(500);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleToggle = async (id: string) => {
    const res = await togglePromotionStatusAction(id);
    if (res.success && "isActive" in res && typeof res.isActive === "boolean") {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: res.isActive! } : p))
      );
    }
  };

  const handleDelete = async (id: string, promoCode: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã ưu đãi "${promoCode}"?`)) return;
    const res = await deletePromotionAction(id);
    if (res.success) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: `Đã xóa mã "${promoCode}" thành công!` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const res = await createPromotionAction({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      maxDiscountVnd: Number(maxDiscountVnd),
      minOrderVnd: Number(minOrderVnd),
      usageLimit: Number(usageLimit),
      isActive: true,
      startDate: `${startDate}T00:00:00Z`,
      endDate: `${endDate}T23:59:59Z`,
      description: description.trim(),
    });

    if (res.success && res.promotion) {
      setPromotions((prev) => [res.promotion!, ...prev]);
      setMessage({ type: "success", text: `Đã tạo mã ưu đãi "${res.promotion.code}" thành công!` });
      setIsAdding(false);
      setCode("");
      setDescription("");
    } else {
      setMessage({ type: "error", text: res.error || "Không thể tạo mã khuyến mãi" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
            Quản trị khuyến mãi & Chiến dịch giảm giá (A025)
          </h1>
          <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
            Cấu hình mã giảm giá, giới hạn ngân sách và điều kiện áp dụng cho đơn hàng không gian nhỏ.
          </p>
        </div>

        {!isAdding && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="gap-1.5 shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Tạo mã ưu đãi mới</span>
          </Button>
        )}
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

      {/* Add Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#5B7065] rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
            <h2 className="text-sm font-bold text-[#29241E] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#5B7065]" />
              <span>Tạo mã khuyến mãi mới</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#786C5E] hover:text-[#29241E]"
            >
              Hủy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Mã code (Viết hoa) *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: XUAN2026"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Phần trăm giảm (%) *</label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Giảm tối đa (VND) *</label>
              <input
                type="number"
                required
                min={0}
                step={10000}
                value={maxDiscountVnd}
                onChange={(e) => setMaxDiscountVnd(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Đơn tối thiểu (VND)</label>
              <input
                type="number"
                min={0}
                step={50000}
                value={minOrderVnd}
                onChange={(e) => setMinOrderVnd(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Mô tả chương trình</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Giảm 10% tối đa 500k cho khách hàng đặt bàn gấp"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Số lượt sử dụng tối đa</label>
              <input
                type="number"
                min={1}
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Ngày kết thúc</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E0D6]">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              Lưu mã khuyến mãi
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                <th className="py-3 px-4">Mã khuyến mãi</th>
                <th className="py-3 px-4">Mức giảm</th>
                <th className="py-3 px-4">Giảm tối đa</th>
                <th className="py-3 px-4">Đơn tối thiểu</th>
                <th className="py-3 px-4 text-center">Đã dùng / Giới hạn</th>
                <th className="py-3 px-4">Thời gian hiệu lực</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFEA]">
              {promotions.map((p) => {
                const isExhausted = p.usedCount >= p.usageLimit;
                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sm text-[#5B7065] whitespace-nowrap">
                      {p.code}
                      <div className="text-[10px] text-[#786C5E] font-normal font-sans line-clamp-1">
                        {p.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#29241E] whitespace-nowrap">
                      {p.discountPercent}%
                    </td>
                    <td className="py-3 px-4 font-medium text-[#29241E] whitespace-nowrap">
                      {formatVND(p.maxDiscountVnd)}
                    </td>
                    <td className="py-3 px-4 text-[#786C5E] whitespace-nowrap">
                      {p.minOrderVnd === 0 ? "Không yêu cầu" : formatVND(p.minOrderVnd)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono whitespace-nowrap">
                      <span className={isExhausted ? "text-[#A05C52] font-bold" : "text-[#29241E]"}>
                        {p.usedCount}
                      </span>{" "}
                      / {p.usageLimit}
                    </td>
                    <td className="py-3 px-4 text-[#786C5E] text-[11px] whitespace-nowrap font-mono">
                      {new Date(p.startDate).toLocaleDateString("vi-VN")} &rarr;{" "}
                      {new Date(p.endDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(p.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          p.isActive && !isExhausted
                            ? "bg-[#EBF0ED] text-[#3E5247] hover:bg-[#DCE5E0]"
                            : "bg-[#F3EFEA] text-[#786C5E] hover:bg-[#E7E0D6]"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{p.isActive && !isExhausted ? "Kích hoạt" : "Tạm dừng"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(p.id, p.code)}
                        className="p-1.5 text-[#A05C52] hover:text-[#7A362D] hover:bg-[#FDF2F0] rounded transition-colors"
                        title="Xóa mã này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
