"use client";

import React, { useState } from "react";
import type { SolutionBundle } from "../types";
import { SolutionCard } from "./solution-card";
import { Sparkles, Maximize2 } from "lucide-react";
import Link from "next/link";

export interface SolutionsListViewProps {
  initialSolutions: SolutionBundle[];
}

export function SolutionsListView({ initialSolutions }: SolutionsListViewProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "Tất cả giải pháp" },
    { id: "phong_thue_khong_khoan", label: "Phòng Trọ Không Khoan" },
    { id: "goc_lam_viec", label: "Góc Làm Việc Mini" },
    { id: "bep_gon", label: "Bếp Gọn Gàng" },
    { id: "luu_tru", label: "Lưu Trữ Dưới Giường" },
  ];

  const filtered =
    selectedGoal === "all"
      ? initialSolutions
      : initialSolutions.filter((s) => s.goal === selectedGoal);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto pb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#5B7065] border border-[#E7E0D6] uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C1623C]" />
          <span>Small Living™ Solution Builder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29241E] tracking-tight">
          Giải Pháp Nội Thất Phối Sẵn
        </h1>
        <p className="text-sm sm:text-base text-[#7A7265] mt-3 leading-relaxed">
          Được nghiên cứu và thiết kế chuyên sâu cho phòng diện tích dưới 20m². Tiết kiệm ngay 10% khi mua trọn bộ combo và đảm bảo chuẩn SpaceFit không khoan đục tường.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGoal(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedGoal === tab.id
                ? "bg-[#5B7065] text-white shadow-xs"
                : "bg-white text-[#7A7265] hover:text-[#29241E] border border-[#E7E0D6] hover:border-[#A8A196]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((bundle) => (
          <SolutionCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* Custom Planner CTA */}
      <div className="mt-16 bg-gradient-to-r from-[#29241E] to-[#3D352E] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="max-w-xl text-center md:text-left">
          <span className="text-xs font-bold text-[#85A392] uppercase tracking-widest block mb-1">
            Không tìm thấy combo đúng ý?
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Tự Thiết Kế Không Gian 2D Theo Kích Thước Phòng Riêng
          </h2>
          <p className="text-xs sm:text-sm text-[#D3C7B7] mt-2 leading-relaxed">
            Nhập số đo phòng của bạn, kéo thả từng món đồ từ danh mục và thuật toán SpaceFit™ sẽ cảnh báo ngay nếu va chạm hoặc chạm trần.
          </p>
        </div>

        <Link
          href="/planner"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#5B7065] hover:bg-[#4A5D53] text-white font-bold text-sm transition-all shadow-md shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Mở 2D Room Planner</span>
        </Link>
      </div>
    </div>
  );
}
