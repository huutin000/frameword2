"use client";

import React from "react";
import { Filter, Check } from "lucide-react";
import type { CatalogFilterState } from "../types";

export interface CatalogFiltersProps {
  filters: CatalogFilterState;
  onChange: (filters: CatalogFilterState) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ROOM_OPTIONS = [
  { id: "all", name: "Tất cả các phòng" },
  { id: "studio", name: "Phòng trọ / Studio" },
  { id: "bedroom", name: "Phòng ngủ nhỏ" },
  { id: "workspace", name: "Góc làm việc mini" },
  { id: "kitchen", name: "Nhà bếp nhỏ" },
  { id: "balcony", name: "Ban công & Giặt phơi" },
];

const PROBLEM_OPTIONS = [
  { id: "all", name: "Tất cả vấn đề" },
  { id: "no-drill", name: "Không khoan tường" },
  { id: "tight-space", name: "Phòng hẹp dưới 15m²" },
  { id: "dead-corner", name: "Góc chết & khe hẹp" },
  { id: "foldable", name: "Gấp gọn đa năng" },
];

export function CatalogFilters({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
}: CatalogFiltersProps) {
  return (
    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E7E0D6] space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#29241E]">
          <Filter className="w-4 h-4 text-[#5B7065]" />
          <span>Bộ lọc không gian</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#B85D43] font-semibold hover:underline cursor-pointer"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* No-Drill Checkbox */}
      <div
        className="p-3 bg-[#EBF0ED]/60 rounded-xl border border-[#C5D3CC] flex items-center justify-between cursor-pointer"
        onClick={() => onChange({ ...filters, onlyNoDrill: !filters.onlyNoDrill })}
      >
        <span className="text-xs font-bold text-[#2E6F40]">Chỉ xem đồ không khoan tường</span>
        <input
          type="checkbox"
          checked={filters.onlyNoDrill}
          onChange={(e) => onChange({ ...filters, onlyNoDrill: e.target.checked })}
          className="rounded accent-[#5B7065] w-4 h-4 cursor-pointer"
        />
      </div>

      {/* Room Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#786C5E]">Loại phòng</label>
        <div className="space-y-1 text-xs">
          {ROOM_OPTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => onChange({ ...filters, room: r.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                filters.room === r.id
                  ? "bg-[#5B7065] text-white font-semibold"
                  : "text-[#29241E] hover:bg-[#F3EFEA]"
              }`}
            >
              <span>{r.name}</span>
              {filters.room === r.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#786C5E]">
          Vấn đề cần giải quyết
        </label>
        <div className="space-y-1 text-xs">
          {PROBLEM_OPTIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange({ ...filters, problem: p.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                filters.problem === p.id
                  ? "bg-[#5A4033] text-white font-semibold"
                  : "text-[#29241E] hover:bg-[#F3EFEA]"
              }`}
            >
              <span>{p.name}</span>
              {filters.problem === p.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Max Width Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-[#786C5E]">Chiều rộng tối đa:</span>
          <span className="font-bold text-[#5B7065] font-mono">{filters.maxWidthMm} mm</span>
        </div>
        <input
          type="range"
          min="150"
          max="2000"
          step="50"
          value={filters.maxWidthMm}
          onChange={(e) => onChange({ ...filters, maxWidthMm: Number(e.target.value) })}
          className="w-full accent-[#5B7065] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#786C5E]">
          <span>150mm (khe hẹp)</span>
          <span>2000mm (tối đa)</span>
        </div>
      </div>
    </div>
  );
}

