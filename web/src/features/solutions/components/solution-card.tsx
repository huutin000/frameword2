import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SolutionBundle } from "../types";
import { calculateBundlePricing } from "../data/solution-store";
import { formatVND } from "@/lib/formatters/currency";
import { ArrowRight, ShieldCheck, Layers } from "lucide-react";

export interface SolutionCardProps {
  bundle: SolutionBundle;
}

export function SolutionCard({ bundle }: SolutionCardProps) {
  const pricing = calculateBundlePricing(bundle.items, bundle.comboDiscountPercent);

  const goalLabels: Record<string, string> = {
    phong_thue_khong_khoan: "Phòng Trọ Không Khoan",
    goc_lam_viec: "Góc Làm Việc Mini",
    bep_gon: "Bếp Gọn Gàng",
    luu_tru: "Lưu Trữ Dưới Giường",
    giat_phoi: "Giặt Phơi Tinh Gọn",
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E0D6] overflow-hidden hover:border-[#5B7065] hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        {/* Image Banner */}
        <div className="relative aspect-16/10 overflow-hidden bg-[#FAF8F5]">
          <Link href={`/solutions/${bundle.slug}`} className="block w-full h-full">
            <Image
              src={bundle.imageUrl}
              alt={bundle.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Goal & Discount Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#29241E]/80 backdrop-blur-md text-white">
              {goalLabels[bundle.goal] || bundle.goal}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#C1623C] text-white">
              Tiết kiệm {bundle.comboDiscountPercent}%
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-[#5B7065] flex items-center gap-1 shadow-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>{bundle.items.length} món phối sẵn</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 space-y-2.5">
          <h3 className="text-base sm:text-lg font-bold text-[#29241E] group-hover:text-[#5B7065] transition-colors leading-snug">
            <Link href={`/solutions/${bundle.slug}`}>{bundle.title}</Link>
          </h3>

          <p className="text-xs text-[#7A7265] line-clamp-2 leading-relaxed">
            {bundle.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[#5A4033]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B7065]" />
              <span>{pricing.allNoDrill ? "100% Không khoan tường" : "Có món cần gắn"}</span>
            </span>
            <span>•</span>
            <span>Chiếm ~{pricing.totalFloorAreaM2} m² sàn</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-[#E7E0D6] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[#A8A196] line-through font-mono">
                {formatVND(pricing.originalTotalVnd)}
              </span>
              <span className="text-base font-bold text-[#29241E]">
                {formatVND(pricing.finalTotalVnd)}
              </span>
            </div>
            <span className="text-[10px] text-[#5B7065] font-semibold block">
              Tiết kiệm {formatVND(pricing.discountVnd)} khi mua combo
            </span>
          </div>

          <Link
            href={`/solutions/${bundle.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#5B7065] hover:text-white text-xs font-bold text-[#29241E] transition-colors border border-[#E7E0D6]"
          >
            <span>Tùy chỉnh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
