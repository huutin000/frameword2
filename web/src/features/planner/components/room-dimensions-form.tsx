"use client";

import React from "react";
import { Compass } from "lucide-react";
import { calculateAreaM2 } from "@/lib/utils";
import type { RoomProfile } from "../types";

export interface RoomDimensionsFormProps {
  room: RoomProfile;
  onChange: (updated: RoomProfile) => void;
}

export function RoomDimensionsForm({ room, onChange }: RoomDimensionsFormProps) {
  const areaM2 = calculateAreaM2(room.widthMm, room.depthMm);

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E7E0D6] space-y-4 shadow-xs">
      <h3 className="text-sm font-bold text-[#29241E] flex items-center gap-2">
        <Compass className="w-4 h-4 text-[#5B7065]" />
        <span>Thông số kích thước phòng</span>
      </h3>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#786C5E]">Rộng (mm)</label>
          <input
            type="number"
            value={room.widthMm}
            onChange={(e) => onChange({ ...room, widthMm: Number(e.target.value) })}
            step="100"
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg p-2 font-mono font-bold text-[#29241E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#786C5E]">Dài (mm)</label>
          <input
            type="number"
            value={room.depthMm}
            onChange={(e) => onChange({ ...room, depthMm: Number(e.target.value) })}
            step="100"
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg p-2 font-mono font-bold text-[#29241E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#786C5E]">Trần (mm)</label>
          <input
            type="number"
            value={room.heightMm}
            onChange={(e) => onChange({ ...room, heightMm: Number(e.target.value) })}
            step="100"
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg p-2 font-mono font-bold text-[#29241E]"
          />
        </div>
      </div>

      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0D6] flex items-center justify-between text-xs">
        <span className="text-[#786C5E]">Diện tích sàn tính toán:</span>
        <span className="font-bold text-[#29241E] font-mono text-sm">{areaM2} m²</span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          id="no-drill-checkbox"
          checked={room.noDrillRequired}
          onChange={(e) => onChange({ ...room, noDrillRequired: e.target.checked })}
          className="rounded accent-[#5B7065] w-4 h-4 cursor-pointer"
        />
        <label htmlFor="no-drill-checkbox" className="text-[#29241E] font-medium cursor-pointer">
          Ràng buộc: Không được khoan đục tường
        </label>
      </div>
    </div>
  );
}

