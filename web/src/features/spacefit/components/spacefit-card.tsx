"use client";

import React from "react";
import Link from "next/link";
import { useRoomProfile } from "../../room-profile/context/room-profile-context";
import { evaluateProductSpaceFit } from "../engine/spacefit-engine";
import { SpaceFitBadge } from "./spacefit-badge";
import type { ProductDimensions } from "../types";
import { Sparkles, Maximize2, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";

export interface SpaceFitCardProps {
  product: ProductDimensions;
  productName: string;
}

export function SpaceFitCard({ product, productName }: SpaceFitCardProps) {
  const { activeProfile } = useRoomProfile();
  const result = evaluateProductSpaceFit(product, activeProfile);

  return (
    <div className="bg-[#FAF7F2] border border-[#E7E0D6] rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E7E0D6]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5B7065] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#29241E] uppercase tracking-wider">
                Đánh giá SpaceFit™
              </h4>
              <SpaceFitBadge status={result.status} score={result.compatibilityScore} />
            </div>
            <p className="text-xs text-[#7A7265] mt-0.5">
              So khớp với: <strong className="text-[#29241E]">{activeProfile.name}</strong>
            </p>
          </div>
        </div>

        <Link
          href="/room-profile"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B7065] hover:text-[#29241E] transition-colors"
        >
          <span>Đổi phòng</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-semibold text-[#7A7265] uppercase tracking-wider">
            Chiếm sàn phòng
          </span>
          <span className="block text-base font-bold text-[#29241E] mt-0.5">
            {result.occupancyPercentage}%
          </span>
          <span className="block text-[10px] text-[#A8A196]">
            ~{((product.widthMm * product.depthMm) / 1_000_000).toFixed(2)} m²
          </span>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-semibold text-[#7A7265] uppercase tracking-wider">
            Lối đi còn lại
          </span>
          <span className="block text-base font-bold text-[#29241E] mt-0.5">
            {Math.min(result.clearanceMm.remainingWidthMm, result.clearanceMm.remainingDepthMm)} mm
          </span>
          <span className="block text-[10px] text-[#A8A196]">
            Chuẩn &gt; 600mm
          </span>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5 text-center">
          <span className="block text-[10px] font-semibold text-[#7A7265] uppercase tracking-wider">
            Khoảng hở trần
          </span>
          <span className="block text-base font-bold text-[#29241E] mt-0.5">
            {Math.max(0, result.clearanceMm.remainingHeightMm)} mm
          </span>
          <span className="block text-[10px] text-[#A8A196]">
            Trần {activeProfile.freeHeightMm} mm
          </span>
        </div>
      </div>

      {/* Rationale Checklist */}
      <div className="space-y-2 mb-4">
        {result.reasons.map((reason, idx) => {
          let Icon = CheckCircle2;
          let iconColor = "text-[#2D5A43]";

          if (result.status === "DOES_NOT_FIT" && (reason.includes("khoan") || reason.includes("vượt"))) {
            Icon = XCircle;
            iconColor = "text-[#9E2A2B]";
          } else if (reason.includes("dưới 600mm") || reason.includes("xoay")) {
            Icon = AlertTriangle;
            iconColor = "text-[#8C6D1F]";
          }

          return (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#4A4237]">
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
              <span className="leading-relaxed">{reason}</span>
            </div>
          );
        })}
      </div>

      {/* Planner Action Button */}
      <div className="pt-3 border-t border-[#E7E0D6] flex items-center justify-between gap-3">
        <Link
          href={`/planner?add=${encodeURIComponent(productName)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B7065] hover:underline"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Thử ướm vào 2D Room Planner</span>
        </Link>

        {activeProfile.noDrillRequired && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#7A7265]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#8C6D1F]" />
            <span>Phòng cấm khoan tường</span>
          </span>
        )}
      </div>

      {/* Disclosed Disclaimer */}
      <p className="text-[10px] text-[#A8A196] italic mt-3 pt-2 border-t border-[#E7E0D6]/60 leading-normal">
        {result.disclaimer}
      </p>
    </div>
  );
}

