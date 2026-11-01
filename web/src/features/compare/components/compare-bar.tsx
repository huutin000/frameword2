"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Scale } from "lucide-react";
import { useCompare } from "../context/compare-context";

export function CompareBar() {
  const { items, isHydrated, removeFromCompare, clearCompare } = useCompare();

  if (!isHydrated || items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#29241E]/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-[#5B7065]/40 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#5B7065] flex items-center justify-center shrink-0">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 group bg-[#FAF8F5]"
            >
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="40px" />
              <button
                onClick={() => removeFromCompare(item.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                title="Xóa khỏi so sánh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {Array.from({ length: 4 - items.length }).map((_, idx) => (
            <div
              key={idx}
              className="w-10 h-10 rounded-lg border border-dashed border-white/30 shrink-0 flex items-center justify-center text-[10px] text-white/50"
            >
              +
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearCompare}
          className="text-[11px] text-[#D3C7B7] hover:text-white transition-colors underline"
        >
          Xóa hết
        </button>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B7065] hover:bg-[#4A5D53] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <span>So sánh ({items.length}/4)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

