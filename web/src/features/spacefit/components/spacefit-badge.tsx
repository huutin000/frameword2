import React from "react";
import type { SpaceFitStatus } from "../types";

export interface SpaceFitBadgeProps {
  status: SpaceFitStatus;
  score?: number;
  showScore?: boolean;
  className?: string;
}

export function SpaceFitBadge({
  status,
  score,
  showScore = true,
  className = "",
}: SpaceFitBadgeProps) {
  let badgeStyle = "bg-[#EEF4F0] text-[#2D5A43] border-[#B7D5C4]";
  let icon = "✓";
  let label = "Vừa vặn";

  if (status === "MAY_FIT") {
    badgeStyle = "bg-[#FFF9EB] text-[#8C6D1F] border-[#E8D4A2]";
    icon = "⚠";
    label = "Cần lưu ý";
  } else if (status === "DOES_NOT_FIT") {
    badgeStyle = "bg-[#FDF2F2] text-[#9E2A2B] border-[#F2B8B8]";
    icon = "✕";
    label = "Không vừa";
  } else if (status === "INSUFFICIENT_DATA") {
    badgeStyle = "bg-[#F5F2EB] text-[#7A7265] border-[#DED7CC]";
    icon = "?";
    label = "Thiếu số đo";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-colors ${badgeStyle} ${className}`}
      title={`SpaceFit: ${label}${score !== undefined ? ` (${score}/100)` : ""}`}
    >
      <span className="font-bold text-[11px]">{icon}</span>
      <span>{label}</span>
      {showScore && score !== undefined && status !== "INSUFFICIENT_DATA" && (
        <span className="opacity-80 font-mono text-[10px] ml-0.5">{score}%</span>
      )}
    </span>
  );
}

