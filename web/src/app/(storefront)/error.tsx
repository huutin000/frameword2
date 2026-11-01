"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console
    console.error("Storefront Client Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FDF2F0] border border-[#F5C2BC] text-[#A05C52] flex items-center justify-center mx-auto shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#29241E]">Đã có lỗi xảy ra</h1>
        <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">
          Hệ thống gặp sự cố trong quá trình tải dữ liệu. Vui lòng bấm thử lại hoặc quay về trang chủ.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="secondary" size="md" onClick={() => reset()}>
          <RotateCcw className="w-4 h-4 mr-1.5" />
          <span>Thử tải lại trang</span>
        </Button>
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Về trang chủ</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

