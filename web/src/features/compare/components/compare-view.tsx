"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { useCompare } from "../context/compare-context";
import { useCart } from "@/features/cart/context/cart-context";
import { formatVND } from "@/lib/formatters/currency";
import { calculateAreaM2 } from "@/lib/formatters/dimensions";
import { Button } from "@/components/ui/button";

export function CompareView() {
  const { items, isHydrated, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E7E0D6] rounded w-1/3 mx-auto"></div>
          <div className="h-48 bg-[#E7E0D6] rounded max-w-xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E0D6] text-[#5B7065] flex items-center justify-center mx-auto shadow-inner">
          <Scale className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
            Chưa có sản phẩm nào trong bảng so sánh
          </h1>
          <p className="text-sm text-[#786C5E] max-w-md mx-auto leading-relaxed">
            Chọn từ 2 đến 4 sản phẩm từ danh mục để so sánh trực tiếp kích thước milimét, diện tích chiếm sàn và cơ chế không khoan tường.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/catalog">
            <Button variant="primary" size="md">
              <span>Xem danh mục sản phẩm</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E7E0D6] gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
            So sánh thông số không gian ({items.length}/4 sản phẩm)
          </h1>
          <p className="text-sm text-[#786C5E] mt-1">
            Đối chiếu kích thước chi tiết để chọn đồ nội thất vừa vặn nhất cho căn phòng của bạn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs text-[#A05C52] hover:text-[#7A362D] font-medium"
          >
            Xóa toàn bộ bảng
          </button>
          {items.length < 4 && (
            <Link href="/catalog">
              <Button variant="secondary" size="sm" className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm sản phẩm</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6]">
                <th className="py-4 px-4 w-44 font-bold text-[#5A4033] uppercase tracking-wider">
                  Tiêu chí so sánh
                </th>
                {items.map((item) => (
                  <th key={item.id} className="py-4 px-4 min-w-56 align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F3EFEA] border border-[#E7E0D6]">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="200px" />
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                          title="Xóa sản phẩm này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link
                        href={`/catalog/${item.id}`}
                        className="font-bold text-[#29241E] hover:text-[#5B7065] transition-colors line-clamp-2 text-sm leading-snug block"
                      >
                        {item.title}
                      </Link>
                      <div className="text-base font-black text-[#5B7065]">
                        {formatVND(item.priceVnd)}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => addItem(item, 1)}
                        className="w-full justify-center gap-1.5 text-xs font-bold"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Thêm vào giỏ</span>
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFEA]">
              {/* Row 1: Dimensions */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Kích thước (WxDxH)
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-mono font-bold text-[#29241E]">
                    {item.dimensions}
                  </td>
                ))}
              </tr>

              {/* Row 2: Floor Footprint */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Diện tích chiếm sàn
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-mono font-bold text-[#5B7065]">
                    {calculateAreaM2(item.widthMm, item.depthMm)} m²
                  </td>
                ))}
              </tr>

              {/* Row 3: No-drill mechanism */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Không khoan tường
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4">
                    {item.noDrill ? (
                      <span className="inline-flex items-center gap-1 text-[#5B7065] font-semibold bg-[#EBF0ED] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Có (Hít chân không/chống trần)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#786C5E] bg-[#F3EFEA] px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cần bắt vít cố định</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 4: Room Type */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Không gian tối ưu
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-[#29241E]">
                    {item.roomTag}
                  </td>
                ))}
              </tr>

              {/* Row 5: Spatial Problem Solved */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Giải quyết bài toán
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-medium text-[#5A4033]">
                    {item.problemTag}
                  </td>
                ))}
              </tr>

              {/* Row 6: Spatial Advice */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Khuyến nghị bài trí
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-[#786C5E] text-[11px] leading-relaxed">
                    {item.fitScoreExplanation}
                  </td>
                ))}
              </tr>

              {/* Row 7: Material */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Chất liệu
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 text-[#29241E]">
                    {item.material || "Thép carbon sơn tĩnh điện"}
                  </td>
                ))}
              </tr>

              {/* Row 8: Weight Capacity */}
              <tr className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#5A4033] bg-[#FAF8F5]/40">
                  Tải trọng tối đa
                </td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-4 font-bold text-[#29241E]">
                    {item.weightCapacityKg || 25} kg
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
