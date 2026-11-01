"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { History, ArrowRight } from "lucide-react";
import { useRecentlyViewed } from "../data/recently-viewed";
import { formatVND } from "@/lib/utils";

interface Props {
  currentProductId?: string;
}

export function RecentlyViewedSection({ currentProductId }: Props) {
  const { recentlyViewed } = useRecentlyViewed();

  // Exclude current product if viewing PDP
  const items = recentlyViewed.filter((p) => p.id !== currentProductId);

  if (items.length === 0) return null;

  return (
    <section className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#5B7065]" />
          <h3 className="text-base font-bold text-[#29241E]">Sản phẩm bạn vừa xem gần đây (U016)</h3>
        </div>
        <Link href="/catalog" className="text-xs text-[#5B7065] hover:underline flex items-center gap-1 font-medium">
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((prod) => (
          <Link
            key={prod.id}
            href={`/catalog/${prod.id}`}
            className="group block p-2.5 rounded-xl border border-[#E7E0D6] hover:border-[#5B7065] hover:shadow-xs transition-all bg-[#FAF8F5]"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-2">
              <Image
                src={prod.imageUrl}
                alt={prod.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[#29241E] truncate group-hover:text-[#5B7065] transition-colors">
                {prod.title}
              </h4>
              <p className="font-mono text-[11px] text-[#786C5E] truncate">{prod.dimensions}</p>
              <div className="font-mono text-xs font-bold text-[#5B7065]">{formatVND(prod.priceVnd)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

