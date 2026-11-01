"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CURATED_TEMPLATES, calculateBundlePricing } from "@/features/solutions/data/solution-store";
import type { SolutionBundle } from "@/features/solutions/types";
import { formatVND } from "@/lib/formatters/currency";
import {
  Layers,
  Eye,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";

export default function AdminSolutionsPage() {
  const [bundles, setBundles] = useState<SolutionBundle[]>(CURATED_TEMPLATES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const togglePublish = (id: string) => {
    setBundles((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextState = !b.isPublished;
          setToastMessage(
            `Đã ${nextState ? "xuất bản" : "ẩn"} mẫu combo "${b.title}"!`
          );
          setTimeout(() => setToastMessage(null), 3000);
          return { ...b, isPublished: nextState };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29241E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#5A4033] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#85A392]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D6]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B7065] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Curated Solutions & Room Templates (S018)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#29241E] mt-1">
            Quản Lý Giải Pháp & Mẫu Không Gian Phối Sẵn
          </h1>
          <p className="text-xs text-[#7A7265] mt-1">
            Biên tập các combo nội thất mẫu, chiết khấu phần trăm combo và kiểm soát trạng thái hiển thị trên Storefront.
          </p>
        </div>

        <button
          onClick={() => alert("Tính năng thêm mẫu mới đang ở chế độ demo.")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B7065] text-white text-xs font-bold hover:bg-[#4A5D53] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Combo Mẫu Mới</span>
        </button>
      </div>

      {/* Table / List of Templates */}
      <div className="bg-white rounded-2xl border border-[#E7E0D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#7A7265] font-bold uppercase tracking-wider border-b border-[#E7E0D6]">
              <tr>
                <th className="py-3.5 px-4">Hình ảnh & Tên Combo</th>
                <th className="py-3.5 px-4">Mục tiêu</th>
                <th className="py-3.5 px-4">Số món</th>
                <th className="py-3.5 px-4">Giá gốc / Ưu đãi</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D6] text-[#29241E]">
              {bundles.map((bundle) => {
                const pricing = calculateBundlePricing(
                  bundle.items,
                  bundle.comboDiscountPercent
                );

                return (
                  <tr key={bundle.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E7E0D6]">
                          <Image
                            src={bundle.imageUrl}
                            alt={bundle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#29241E]">
                            {bundle.title}
                          </div>
                          <div className="text-[11px] text-[#7A7265] line-clamp-1 mt-0.5">
                            {bundle.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#5B7065] border border-[#E7E0D6] font-semibold text-[11px]">
                        {bundle.goal}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold">{bundle.items.length} sản phẩm</div>
                      <div className="text-[10px] text-[#7A7265]">
                        ~{pricing.totalFloorAreaM2} m² sàn
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="line-through text-[#A8A196] text-[11px] font-mono">
                        {formatVND(pricing.originalTotalVnd)}
                      </div>
                      <div className="font-bold text-[#5B7065] font-mono text-sm">
                        {formatVND(pricing.finalTotalVnd)}
                      </div>
                      <div className="text-[10px] text-[#C1623C] font-semibold">
                        Giảm {bundle.comboDiscountPercent}%
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {bundle.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EEF4F0] text-[#2D5A43] border border-[#B7D5C4]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã xuất bản</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF7F2] text-[#7A7265] border border-[#E7E0D6]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Bản nháp</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/solutions/${bundle.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#7A7265] hover:text-[#5B7065] hover:bg-[#FAF7F2] transition-colors"
                          title="Xem trên Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => togglePublish(bundle.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            bundle.isPublished
                              ? "bg-[#FAF7F2] text-[#7A7265] hover:bg-[#FDF2F2] hover:text-[#9E2A2B]"
                              : "bg-[#5B7065] text-white hover:bg-[#4A5D53]"
                          }`}
                        >
                          {bundle.isPublished ? "Ẩn mẫu" : "Xuất bản"}
                        </button>
                      </div>
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
