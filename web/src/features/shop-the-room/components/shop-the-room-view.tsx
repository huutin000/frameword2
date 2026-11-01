"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SHOP_THE_ROOM_SCENES } from "../data/shop-the-room-data";
import type { RoomHotspot } from "../types";
import { getAdminProductById } from "@/features/admin/data/product-store";
import type { CatalogProduct } from "@/features/catalog/types";
import { useCart } from "@/features/cart/context/cart-context";
import { useRoomProfile } from "@/features/room-profile/context/room-profile-context";
import { evaluateProductSpaceFit } from "@/features/spacefit/engine/spacefit-engine";
import { SpaceFitBadge } from "@/features/spacefit/components/spacefit-badge";
import { formatVND } from "@/lib/formatters/currency";
import {
  Sparkles,
  ShoppingBag,
  Check,
  Maximize2,
  X,
} from "lucide-react";

export function ShopTheRoomView() {
  const [activeSceneId, setActiveSceneId] = useState<string>(
    SHOP_THE_ROOM_SCENES[0].id
  );
  const [activeHotspot, setActiveHotspot] = useState<RoomHotspot | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const { addItem } = useCart();
  const { activeProfile } = useRoomProfile();

  const currentScene =
    SHOP_THE_ROOM_SCENES.find((s) => s.id === activeSceneId) ||
    SHOP_THE_ROOM_SCENES[0];

  const handleAddToCart = (product: CatalogProduct) => {
    addItem(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  const activeProduct = activeHotspot
    ? getAdminProductById(activeHotspot.productId)
    : null;

  const activeFit = activeProduct
    ? evaluateProductSpaceFit(
        {
          widthMm: activeProduct.widthMm,
          depthMm: activeProduct.depthMm,
          heightMm: activeProduct.heightMm,
          requiresDrilling: !activeProduct.noDrill,
        },
        activeProfile
      )
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#5B7065] border border-[#E7E0D6] uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C1623C]" />
          <span>Shop The Room Hotspots (S008, U020)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29241E] tracking-tight">
          Tham Quan Phòng Thực Tế & Chọn Đồ
        </h1>
        <p className="text-sm sm:text-base text-[#7A7265] mt-2 leading-relaxed">
          Chạm vào các điểm đánh dấu (+) trên hình để xem chi tiết kích thước, giá và độ vừa vặn SpaceFit™ với phòng của bạn.
        </p>
      </div>

      {/* Scene Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {SHOP_THE_ROOM_SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => {
              setActiveSceneId(scene.id);
              setActiveHotspot(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSceneId === scene.id
                ? "bg-[#5B7065] text-white shadow-xs"
                : "bg-white text-[#7A7265] hover:text-[#29241E] border border-[#E7E0D6]"
            }`}
          >
            {scene.title.split(" — ")[0] || scene.title}
          </button>
        ))}
      </div>

      {/* Main Interactive Photo Display */}
      <div className="relative rounded-3xl overflow-hidden bg-[#29241E] border border-[#E7E0D6] shadow-xl aspect-16/10">
        <Image
          src={currentScene.imageUrl}
          alt={currentScene.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Scene Info Chip (Top Left) */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/60 shadow-md">
          <div className="text-xs font-bold text-[#29241E]">{currentScene.title}</div>
          <div className="text-[11px] text-[#7A7265]">
            Phong cách: <strong>{currentScene.roomStyle}</strong> • Diện tích: <strong>{currentScene.areaM2} m²</strong>
          </div>
        </div>

        {/* Interactive Coordinate Hotspots */}
        {currentScene.hotspots.map((hs) => {
          const isSelected = activeHotspot?.id === hs.id;
          return (
            <div
              key={hs.id}
              className="absolute z-20"
              style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
            >
              {/* Radar Ping Animation */}
              <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping pointer-events-none" />

              {/* Pin Button */}
              <button
                type="button"
                onClick={() => setActiveHotspot(isSelected ? null : hs)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg font-bold text-xs transition-transform hover:scale-125 focus:outline-hidden ${
                  isSelected
                    ? "bg-[#C1623C] text-white ring-4 ring-white"
                    : "bg-white/95 text-[#29241E] hover:bg-white ring-2 ring-[#29241E]/20"
                }`}
                title={hs.label}
              >
                +
              </button>
            </div>
          );
        })}

        {/* Active Hotspot Popover Card (Docked or Absolute) */}
        {activeHotspot && activeProduct && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 z-30 sm:max-w-xs w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#E7E0D6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C1623C]">
                  {activeHotspot.note || "Sản phẩm được đánh dấu"}
                </span>
                <h4 className="text-sm font-bold text-[#29241E] line-clamp-1">
                  {activeProduct.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="p-1 rounded-full text-[#7A7265] hover:text-[#29241E] hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-3 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E7E0D6]">
                <Image
                  src={activeProduct.imageUrl}
                  alt={activeProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#5B7065] font-mono">
                  {formatVND(activeProduct.priceVnd)}
                </div>
                <div className="text-[11px] text-[#7A7265] font-mono">
                  {activeProduct.dimensions}
                </div>
                {activeFit && (
                  <div className="mt-1">
                    <SpaceFitBadge status={activeFit.status} score={activeFit.compatibilityScore} />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={`/catalog/${activeProduct.id}`}
                className="py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#E7E0D6] text-[#29241E] text-xs font-bold text-center transition-colors border border-[#E7E0D6]"
              >
                Chi tiết
              </Link>
              <button
                onClick={() => handleAddToCart(activeProduct)}
                className="py-2 px-3 rounded-xl bg-[#5B7065] hover:bg-[#4A5D53] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                {justAddedId === activeProduct.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã thêm</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Thêm giỏ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tagged Products in this Room Scene */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#29241E]">
              Sản Phẩm Trong Không Gian Này ({currentScene.hotspots.length})
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Tất cả món đồ đều đồng bộ kích thước và vật liệu, sẵn sàng đặt mua
            </p>
          </div>

          <Link
            href="/planner"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B7065] hover:underline"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mở trong 2D Planner</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentScene.hotspots.map((hs) => {
            const product = getAdminProductById(hs.productId);
            if (!product) return null;

            const fit = evaluateProductSpaceFit(
              {
                widthMm: product.widthMm,
                depthMm: product.depthMm,
                heightMm: product.heightMm,
                requiresDrilling: !product.noDrill,
              },
              activeProfile
            );

            return (
              <div
                key={hs.id}
                className="bg-white rounded-2xl border border-[#E7E0D6] p-4 flex items-center justify-between gap-3 shadow-xs hover:border-[#5B7065] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E7E0D6]">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/catalog/${product.id}`}
                      className="text-xs font-bold text-[#29241E] hover:text-[#5B7065] transition-colors truncate block"
                    >
                      {product.title}
                    </Link>
                    <div className="text-xs font-bold text-[#5B7065] font-mono mt-0.5">
                      {formatVND(product.priceVnd)}
                    </div>
                    <div className="mt-1">
                      <SpaceFitBadge status={fit.status} score={fit.compatibilityScore} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#5B7065] hover:text-white text-[#29241E] transition-colors shrink-0 border border-[#E7E0D6]"
                  title="Thêm vào giỏ hàng"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
