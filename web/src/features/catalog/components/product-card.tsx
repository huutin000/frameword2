"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, ShoppingBag, Check, Heart, Scale, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { useCompare } from "@/features/compare/context/compare-context";
import { useRoomProfile } from "@/features/room-profile/context/room-profile-context";
import { evaluateProductSpaceFit } from "@/features/spacefit/engine/spacefit-engine";
import { SpaceFitBadge } from "@/features/spacefit/components/spacefit-badge";
import type { CatalogProduct } from "../types";

export interface ProductCardProps {
  product: CatalogProduct;
  onAddToCart?: (product: CatalogProduct) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { activeProfile } = useRoomProfile();
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isInWishlist(product.id);
  const isComp = isInCompare(product.id);

  const fitResult = evaluateProductSpaceFit(
    {
      widthMm: product.widthMm,
      depthMm: product.depthMm,
      heightMm: product.heightMm,
      requiresDrilling: !product.noDrill,
    },
    activeProfile
  );

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Media Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5]">
          <Link href={`/catalog/${product.id}`} className="block w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
            {product.noDrill && <Badge variant="nodrill">Không khoan</Badge>}
            <Badge variant="dimensions">{product.dimensions}</Badge>
          </div>

          {product.videoUrl && (
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Video demo</span>
              </span>
            </div>
          )}

          {/* Quick Action Badges: Wishlist & Compare */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
                isFav
                  ? "bg-[#A05C52] text-white"
                  : "bg-white/90 text-[#786C5E] hover:text-[#A05C52] hover:bg-white"
              }`}
              title={isFav ? "Xóa khỏi đã lưu" : "Lưu sản phẩm"}
              aria-label="Lưu sản phẩm"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => {
                if (isComp) {
                  removeFromCompare(product.id);
                } else {
                  addToCompare(product);
                }
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
                isComp
                  ? "bg-[#5B7065] text-white"
                  : "bg-white/90 text-[#786C5E] hover:text-[#5B7065] hover:bg-white"
              }`}
              title={isComp ? "Đang trong bảng so sánh" : "Thêm vào so sánh"}
              aria-label="So sánh"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#786C5E]">
            <span>{product.roomTag}</span>
            <span className="font-semibold text-[#5A4033]">{product.category}</span>
          </div>

          <h3 className="text-sm font-bold text-[#29241E] line-clamp-2 leading-snug group-hover:text-[#5B7065] transition-colors">
            <Link href={`/catalog/${product.id}`}>{product.title}</Link>
          </h3>

          <div className="flex items-center justify-between gap-1 pt-0.5">
            <SpaceFitBadge status={fitResult.status} score={fitResult.compatibilityScore} />
            <span className="text-[10px] text-[#786C5E] truncate max-w-[120px]" title={activeProfile.name}>
              {activeProfile.name}
            </span>
          </div>

          <div className="text-[11px] text-[#5B7065] flex items-center gap-1 font-medium">
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{product.fitScoreExplanation}</span>
          </div>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-[#F3EFEA] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#786C5E] block">Giá mô phỏng:</span>
            <span className="text-base font-bold text-[#29241E]">{formatVND(product.priceVnd)}</span>
          </div>

          <Button
            variant={justAdded ? "secondary" : "primary"}
            size="sm"
            className="gap-1 transition-all"
            onClick={handleAdd}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5B7065]" />
                <span className="text-[#5B7065]">Đã thêm</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
