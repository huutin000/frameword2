"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowRight, Ruler, ShieldCheck } from "lucide-react";
import { useWishlist } from "../context/wishlist-context";
import { useCart } from "@/features/cart/context/cart-context";
import { formatVND } from "@/lib/formatters/currency";
import { Button } from "@/components/ui/button";

export function WishlistView() {
  const { items, isHydrated, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E7E0D6] rounded w-1/3 mx-auto"></div>
          <div className="h-48 bg-[#E7E0D6] rounded max-w-xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E0D6] text-[#A05C52] flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
            Danh sách yêu thích đang trống
          </h1>
          <p className="text-sm text-[#786C5E] max-w-md mx-auto leading-relaxed">
            Bạn chưa lưu sản phẩm nào. Hãy bấm biểu tượng trái tim trên các sản phẩm phù hợp không gian để dễ dàng xem lại sau.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/catalog">
            <Button variant="primary" size="md">
              <span>Khám phá sản phẩm SpaceFit™</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E7E0D6] gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
            Sản phẩm đã lưu ({items.length})
          </h1>
          <p className="text-sm text-[#786C5E] mt-1">
            Các món đồ nội thất tinh gọn bạn đã đánh dấu để nghiên cứu bài trí cho phòng nhỏ.
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-[#A05C52] hover:text-[#7A362D] font-medium self-start sm:self-auto"
        >
          Xóa toàn bộ danh sách lưu
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ product }) => (
          <div
            key={product.id}
            className="group bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs hover:border-[#D3C7B7] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-4/3 bg-[#FAF8F5] overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#A05C52] hover:bg-white shadow-xs transition-colors"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {product.noDrill && (
                  <span className="absolute top-2.5 left-2.5 bg-[#5B7065] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Không khoan</span>
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="text-[11px] text-[#786C5E] font-medium">{product.roomTag}</div>
                <Link
                  href={`/catalog/${product.id}`}
                  className="text-sm font-semibold text-[#29241E] hover:text-[#5B7065] transition-colors line-clamp-2 leading-snug"
                >
                  {product.title}
                </Link>

                <div className="text-xs font-mono text-[#5A4033] flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-[#5B7065]" />
                  <span>{product.dimensions}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-0">
              <div className="pt-3 border-t border-[#F3EFEA] flex items-center justify-between">
                <span className="text-base font-bold text-[#29241E]">
                  {formatVND(product.priceVnd)}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addItem(product, 1)}
                  className="gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Mua</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

