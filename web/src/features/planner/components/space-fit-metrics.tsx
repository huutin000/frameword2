"use client";

import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { SpaceFitEvaluation } from "../types";

export interface SpaceFitMetricsProps {
  evaluation: SpaceFitEvaluation;
}

export function SpaceFitMetrics({ evaluation }: SpaceFitMetricsProps) {
  const isHealthy = evaluation.status === "FIT";

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E7E0D6] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#29241E]">Đánh giá độ vừa vặn SpaceFit</h3>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            isHealthy
              ? "bg-[#EBF0ED] text-[#2E6F40]"
              : "bg-[#FFF8E6] text-[#B87A1E]"
          }`}
        >
          {evaluation.statusLabel}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#786C5E]">
          <span>Tỷ lệ chiếm mặt sàn:</span>
          <span className="font-mono font-bold text-[#5B7065]">{evaluation.occupancyPercentage}%</span>
        </div>
        <div className="w-full bg-[#F3EFEA] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              evaluation.occupancyPercentage > 45 ? "bg-[#B85D43]" : "bg-[#5B7065]"
            }`}
            style={{ width: `${Math.min(100, evaluation.occupancyPercentage * 2)}%` }}
          />
        </div>
      </div>

      {/* Actionable Notes */}
      <div className="space-y-1.5 pt-1">
        {evaluation.notes.map((note) => (
          <div
            key={note}
            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
              isHealthy
                ? "bg-[#EBF0ED] border-[#C5D3CC] text-[#2E6F40]"
                : "bg-[#FFF8E6] border-[#FDE0A2] text-[#B87A1E]"
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

