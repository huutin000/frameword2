import React from "react";
import Link from "next/link";
import { Compass, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E0D6] text-[#A05C52] flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#29241E]">404 — Không tìm thấy trang</h1>
        <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">
          Sản phẩm hoặc đường dẫn bạn đang tìm kiếm có thể đã thay đổi hoặc không tồn tại trong hệ thống.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="secondary" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Về trang chủ</span>
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="primary" size="md">
            <span>Xem danh mục</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

