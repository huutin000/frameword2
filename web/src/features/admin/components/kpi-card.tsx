import React from "react";
import type { KpiMetric } from "../types";

export interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const Icon = metric.icon;

  return (
    <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#786C5E]">{metric.title}</span>
        <div className={`p-2 rounded-lg ${metric.colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-[#29241E]">{metric.value}</div>
        <div className="text-xs text-[#786C5E] mt-0.5">{metric.subtext}</div>
      </div>
    </div>
  );
}

