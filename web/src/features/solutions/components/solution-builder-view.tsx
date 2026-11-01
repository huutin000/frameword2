"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SolutionBundle, SolutionItem } from "../types";
import { calculateBundlePricing } from "../data/solution-store";
import { useRoomProfile } from "@/features/room-profile/context/room-profile-context";
import { useCart } from "@/features/cart/context/cart-context";
import { formatVND } from "@/lib/formatters/currency";
import {
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Maximize2,
  ShieldAlert,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

export interface SolutionBuilderViewProps {
  bundle: SolutionBundle;
}

export function SolutionBuilderView({ bundle }: SolutionBuilderViewProps) {
  const { activeProfile } = useRoomProfile();
  const { addItem, applyPromoCode } = useCart();

  const [items, setItems] = useState<SolutionItem[]>(bundle.items);
  const [justAdded, setJustAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pricing = calculateBundlePricing(items, bundle.comboDiscountPercent);

  const toggleItem = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const nextQty = Math.max(1, Math.min(10, item.quantity + delta));
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleAddBundleToCart = () => {
    const selectedItems = items.filter((it) => it.selected);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 món để thêm vào giỏ hàng.");
      return;
    }

    // Add each selected item to cart
    selectedItems.forEach((it) => {
      addItem(
        {
          id: it.productId,
          slug: it.productId,
          title: it.title,
          category: bundle.roomType,
          roomType: "studio",
          roomTag: bundle.title,
          problem: "tight-space",
          problemTag: "Không gian nhỏ",
          dimensions: `${it.widthMm}x${it.depthMm}x${it.heightMm}mm`,
          widthMm: it.widthMm,
          heightMm: it.heightMm,
          depthMm: it.depthMm,
          noDrill: it.noDrill,
          priceVnd: it.priceVnd,
          imageUrl: it.imageUrl,
          fitScoreExplanation: `Phối chuẩn cho ${bundle.title}`,
          inStock: true,
        },
        it.quantity
      );
    });

    // Auto-apply combo promo code if >= 2 items
    if (selectedItems.length >= 2) {
      applyPromoCode("SMALL2026");
    }

    setJustAdded(true);
    setToastMessage(`Đã thêm ${selectedItems.length} món vào giỏ hàng với ưu đãi combo!`);
    setTimeout(() => {
      setJustAdded(false);
      setToastMessage(null);
    }, 3500);
  };

  // SpaceFit calculation for the combined bundle
  const bundleOccupancyPct = (
    (pricing.totalFloorAreaM2 /
      ((activeProfile.widthMm * activeProfile.depthMm) / 1_000_000)) *
    100
  ).toFixed(1);

  const hasDrillConflict =
    activeProfile.noDrillRequired && items.some((it) => it.selected && !it.noDrill);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29241E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#5A4033] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#85A392]" />
          <div>
            <div className="text-sm font-semibold">{toastMessage}</div>
            <Link href="/cart" className="text-xs text-[#85A392] underline mt-0.5 block">
              Mở giỏ hàng thanh toán ngay →
            </Link>
          </div>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/solutions"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7065] hover:text-[#29241E] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại tất cả giải pháp combo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Solution Info & Item Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs bg-[#29241E] text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Giải Pháp Phối Sẵn
              </span>
              <span className="text-xs bg-[#C1623C] text-white font-bold px-3 py-1 rounded-full">
                Tiết kiệm {bundle.comboDiscountPercent}% combo
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#29241E] leading-tight">
              {bundle.title}
            </h1>

            <p className="text-sm text-[#7A7265] mt-2 leading-relaxed">
              {bundle.description}
            </p>
          </div>

          {/* Solution Banner */}
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D6] shadow-xs">
            <Image
              src={bundle.imageUrl}
              alt={bundle.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* Items Configurator List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#29241E]">
                Các món trong combo ({pricing.selectedCount}/{items.length} món đã chọn)
              </h3>
              <span className="text-xs text-[#7A7265]">
                Bạn có thể bỏ bớt hoặc tăng số lượng từng món
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    item.selected
                      ? "bg-white border-[#5B7065] shadow-xs"
                      : "bg-[#FAF7F2] border-[#E7E0D6] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItem(item.productId)}
                      className="w-5 h-5 rounded text-[#5B7065] focus:ring-[#5B7065] cursor-pointer"
                    />

                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E7E0D6]">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/catalog/${item.productId}`}
                        className="text-xs sm:text-sm font-bold text-[#29241E] hover:text-[#5B7065] transition-colors truncate block"
                      >
                        {item.title}
                      </Link>
                      <div className="text-[11px] text-[#7A7265] mt-0.5">
                        Phiên bản: <strong>{item.variantName}</strong>
                      </div>
                      <div className="text-[11px] font-mono text-[#5A4033] mt-0.5">
                        {item.widthMm} × {item.depthMm} × {item.heightMm} mm
                        {item.noDrill && " • Không khoan"}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-sm font-bold text-[#29241E] font-mono">
                      {formatVND(item.priceVnd * item.quantity)}
                    </span>

                    {item.selected && (
                      <div className="flex items-center border border-[#DED7CC] rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-[#FAF7F2] text-[#7A7265] disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#29241E] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="p-1 hover:bg-[#FAF7F2] text-[#7A7265]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SpaceFit Combo Summary & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SpaceFit Multi-item Evaluation Card */}
          <div className="bg-[#FAF7F2] border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5B7065]" />
                <h3 className="text-sm font-bold text-[#29241E] uppercase tracking-wider">
                  SpaceFit™ Đánh Giá Combo
                </h3>
              </div>

              <Link
                href="/room-profile"
                className="text-xs font-semibold text-[#5B7065] hover:underline flex items-center gap-1"
              >
                <span>Đổi phòng</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="text-xs text-[#5A4033]">
              Phòng đang so khớp: <strong>{activeProfile.name}</strong>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-[#E7E0D6]">
                <span className="block text-[10px] text-[#7A7265] font-semibold uppercase">
                  Tổng diện tích đáy
                </span>
                <span className="block text-base font-bold text-[#29241E] mt-0.5">
                  ~{pricing.totalFloorAreaM2} m²
                </span>
                <span className="block text-[10px] text-[#A8A196]">
                  {bundleOccupancyPct}% sàn phòng
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E7E0D6]">
                <span className="block text-[10px] text-[#7A7265] font-semibold uppercase">
                  Quy chuẩn khoan
                </span>
                <span className="block text-base font-bold text-[#5B7065] mt-0.5">
                  {pricing.allNoDrill ? "Không đục lỗ" : "Có khoan"}
                </span>
                <span className="block text-[10px] text-[#A8A196]">
                  {pricing.allNoDrill ? "Chuẩn phòng trọ" : "Cần phép chủ nhà"}
                </span>
              </div>
            </div>

            {hasDrillConflict && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F2B8B8] rounded-xl flex items-start gap-2 text-xs text-[#9E2A2B]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Cảnh báo:</strong> Trong combo có món cần khoan tường, vi phạm quy định cấm khoan của phòng trọ hiện tại.
                </span>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/planner"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#29241E] border border-[#E7E0D6] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#5B7065]" />
                <span>Thử sắp xếp combo này trong 2D Planner</span>
              </Link>
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-white border-2 border-[#5B7065] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#29241E]">
              Tổng Chi Phí Dự Tính
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#7A7265]">
                <span>Giá gốc ({pricing.selectedCount} món):</span>
                <span className="font-mono">{formatVND(pricing.originalTotalVnd)}</span>
              </div>

              {pricing.discountVnd > 0 && (
                <div className="flex justify-between text-[#C1623C] font-semibold">
                  <span>Ưu đãi combo (-{bundle.comboDiscountPercent}%):</span>
                  <span className="font-mono">-{formatVND(pricing.discountVnd)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7A7265] text-xs">
                <span>Vận chuyển (Demo):</span>
                <span className="text-[#5B7065] font-semibold">Miễn phí</span>
              </div>

              <div className="pt-3 border-t border-[#E7E0D6] flex justify-between items-baseline">
                <div>
                  <span className="block text-xs font-bold text-[#29241E] uppercase tracking-wider">
                    Tổng thanh toán combo:
                  </span>
                  <span className="block text-[11px] text-[#7A7265]">
                    (Đã gồm VAT & hướng dẫn tự lắp ráp)
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#5B7065] font-mono">
                  {formatVND(pricing.finalTotalVnd)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddBundleToCart}
              disabled={pricing.selectedCount === 0}
              className="w-full py-3.5 rounded-xl bg-[#5B7065] hover:bg-[#4A5D53] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã thêm toàn bộ vào giỏ hàng!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm trọn bộ vào giỏ hàng ({pricing.selectedCount} món)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-[#A8A196] text-center italic">
              Đơn hàng demo sẽ được ghi nhận và có mã theo dõi thời gian thực.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
