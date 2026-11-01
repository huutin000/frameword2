"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Ruler,
  ShieldCheck,
  Check,
  ShoppingBag,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Plus,
  Minus,
  Heart,
  Scale,
  Play,
} from "lucide-react";
import type { CatalogProduct } from "../types";
import { formatVND } from "@/lib/formatters/currency";
import { calculateAreaM2 } from "@/lib/formatters/dimensions";
import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { useCompare } from "@/features/compare/context/compare-context";
import { SpaceFitCard } from "@/features/spacefit/components/spacefit-card";
import { PDPModelPreview3D } from "./pdp-model-preview-3d";
import { ProductReviewsSection } from "./product-reviews-section";
import { RecentlyViewedSection } from "./recently-viewed-section";
import { recordRecentlyViewed } from "../data/recently-viewed";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

interface ProductDetailViewProps {
  product: CatalogProduct;
}

const DEFAULT_VARIANTS = [
  { id: "var-white", name: "Trắng Bắc Âu (Sơn tĩnh điện)", priceOffset: 0, inStock: true },
  { id: "var-oak", name: "Gỗ Sồi Tự Nhiên (Vân mờ)", priceOffset: 60000, inStock: true },
  { id: "var-black", name: "Thép Đen Nhám (Matte)", priceOffset: 40000, inStock: true },
];

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [selectedVariant, setSelectedVariant] = useState(DEFAULT_VARIANTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [selectedImageOverride, setSelectedImageOverride] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [prevProductId, setPrevProductId] = useState(product.id);

  if (prevProductId !== product.id) {
    setPrevProductId(product.id);
    setSelectedImageOverride(null);
    setIsPlayingVideo(false);
  }

  const selectedImage = selectedImageOverride ?? product.imageUrl;

  const isFav = isInWishlist(product.id);
  const isComp = isInCompare(product.id);

  const floorAreaM2 = calculateAreaM2(product.widthMm, product.depthMm);
  const finalUnitPrice = product.priceVnd + selectedVariant.priceOffset;

  React.useEffect(() => {
    recordRecentlyViewed(product.id);
  }, [product.id]);

  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        priceVnd: finalUnitPrice,
        title: `${product.title} - ${selectedVariant.name}`,
      },
      quantity
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(
      {
        ...product,
        priceVnd: finalUnitPrice,
        title: `${product.title} - ${selectedVariant.name}`,
      },
      quantity
    );
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#786C5E] mb-6">
        <Link href="/" className="hover:text-[#29241E] transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/catalog" className="hover:text-[#29241E] transition-colors">
          Danh mục sản phẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#29241E] font-medium truncate max-w-xs sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Media Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E7E0D6] shadow-xs">
            {isPlayingVideo && product.videoUrl ? (
              product.videoUrl.includes("youtube.com") || product.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={product.videoUrl}
                  title={`Video demo ${product.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover bg-black"
                  poster={selectedImage}
                >
                  Trình duyệt không hỗ trợ xem video trực tiếp.
                </video>
              )
            ) : (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}

            {product.noDrill && !isPlayingVideo && (
              <div className="absolute top-4 left-4 bg-[#5B7065] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Không khoan tường</span>
              </div>
            )}
          </div>

          {/* Media Switcher: Gallery Thumbnails & Video Button */}
          {((product.galleryImages && product.galleryImages.length > 0) || product.videoUrl) && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedImageOverride(null);
                  setIsPlayingVideo(false);
                }}
                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  !isPlayingVideo && selectedImage === product.imageUrl
                    ? "border-[#5B7065] ring-2 ring-[#5B7065]/20"
                    : "border-[#E7E0D6] hover:border-[#D3C7B7]"
                }`}
                aria-label="Hình ảnh 1"
              >
                <Image src={product.imageUrl} alt="Thumbnail 1" fill className="object-cover" />
              </button>

              {product.galleryImages?.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImageOverride(img);
                    setIsPlayingVideo(false);
                  }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    !isPlayingVideo && selectedImage === img
                      ? "border-[#5B7065] ring-2 ring-[#5B7065]/20"
                      : "border-[#E7E0D6] hover:border-[#D3C7B7]"
                  }`}
                  aria-label={`Hình ảnh ${idx + 2}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 2}`} fill className="object-cover" />
                </button>
              ))}

              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    isPlayingVideo
                      ? "border-[#5B7065] bg-[#EBF0ED] ring-2 ring-[#5B7065]/20 text-[#5B7065]"
                      : "border-[#E7E0D6] bg-[#FAF8F5] text-[#5A4033] hover:border-[#D3C7B7]"
                  }`}
                  title="Xem video demo thực tế"
                  aria-label="Xem video demo thực tế"
                >
                  <Play className="w-5 h-5 fill-current text-[#5B7065]" />
                  <span className="text-[10px] font-bold">Video</span>
                </button>
              )}
            </div>
          )}

          {/* 3D Interactive Model Preview Button */}
          <button
            type="button"
            onClick={() => setIs3DModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#5B7065] text-xs font-bold border border-[#C5D3CC] transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            <Box className="w-4 h-4 text-[#5B7065] group-hover:rotate-12 transition-transform" />
            <span>Xem Mô Hình 3D Xoay 360° (WebGL Tỷ Lệ Thật)</span>
          </button>

          {/* Provenance and Photography details */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E0D6] rounded-xl text-[11px] text-[#786C5E] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#5B7065] shrink-0 mt-0.5" />
            <div>
              <strong>Hình ảnh bản quyền miễn phí thực tế:</strong> Chụp thật không gian nội thất từ Unsplash/Pexels License, phản ánh trung thực kích thước và kết cấu chất liệu.
            </div>
          </div>
        </div>

        {/* 3D Inspection Modal */}
        <PDPModelPreview3D
          product={product}
          isOpen={is3DModalOpen}
          onClose={() => setIs3DModalOpen(false)}
        />

        {/* Right: Specifications, SpaceFit, Purchase (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tags & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs bg-[#EBF0ED] text-[#5B7065] font-semibold px-2.5 py-0.5 rounded-full">
                {product.roomTag}
              </span>
              <span className="text-xs bg-[#FAF8F5] border border-[#E7E0D6] text-[#5A4033] px-2.5 py-0.5 rounded-full">
                {product.problemTag}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E] leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#5B7065]">
                {formatVND(finalUnitPrice)}
              </span>
              <span className="text-xs text-[#786C5E] font-medium">
                (Đã gồm VAT & Hướng dẫn lắp đặt tự làm)
              </span>
            </div>
          </div>

          {/* SpaceFit Spatial Specification Card */}
          <div className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#29241E]">
                <Ruler className="w-4 h-4 text-[#5B7065]" />
                <span>Thông số không gian SpaceFit™</span>
              </div>
              <span className="text-xs font-semibold text-[#5B7065] bg-[#EBF0ED] px-2.5 py-0.5 rounded">
                Chuẩn milimét
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5">
                <div className="text-[10px] text-[#786C5E] uppercase font-bold tracking-wider">Chiều rộng</div>
                <div className="text-sm font-bold text-[#29241E] font-mono mt-0.5">{product.widthMm} mm</div>
              </div>
              <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5">
                <div className="text-[10px] text-[#786C5E] uppercase font-bold tracking-wider">Chiều sâu</div>
                <div className="text-sm font-bold text-[#29241E] font-mono mt-0.5">{product.depthMm} mm</div>
              </div>
              <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5">
                <div className="text-[10px] text-[#786C5E] uppercase font-bold tracking-wider">Chiều cao</div>
                <div className="text-sm font-bold text-[#29241E] font-mono mt-0.5">{product.heightMm} mm</div>
              </div>
              <div className="bg-white border border-[#E7E0D6] rounded-xl p-2.5">
                <div className="text-[10px] text-[#786C5E] uppercase font-bold tracking-wider">Diện tích sàn</div>
                <div className="text-sm font-bold text-[#5B7065] font-mono mt-0.5">{floorAreaM2} m²</div>
              </div>
            </div>

            {/* Spatial Suitability Description */}
            <div className="text-xs text-[#5A4033] bg-[#FFFFFF] border border-[#E7E0D6] rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C48C00] shrink-0 mt-0.5" />
              <div>
                <strong>Lời khuyên bài trí:</strong> {product.fitScoreExplanation}. Phù hợp căn hộ mini, phòng trọ cho thuê dưới 20m² không được phép đóng đinh.
              </div>
            </div>

            {/* SpaceFit Dynamic Evaluation Card */}
            <div className="pt-2">
              <SpaceFitCard
                product={{
                  widthMm: product.widthMm,
                  depthMm: product.depthMm,
                  heightMm: product.heightMm,
                  requiresDrilling: !product.noDrill,
                }}
                productName={product.title}
              />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#5A4033]">
              Chọn phiên bản hoàn thiện / Màu sắc:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEFAULT_VARIANTS.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVariant.id === variant.id
                      ? "border-[#5B7065] bg-[#FAF8F5] ring-1 ring-[#5B7065]"
                      : "border-[#E7E0D6] bg-white hover:border-[#D3C7B7]"
                  }`}
                >
                  <div className="text-xs font-semibold text-[#29241E] line-clamp-1">{variant.name}</div>
                  <div className="text-[11px] text-[#786C5E] mt-0.5">
                    {variant.priceOffset === 0 ? "Tiêu chuẩn" : `+${formatVND(variant.priceOffset)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#D3C7B7] rounded-xl overflow-hidden bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-[#E7E0D6] text-[#5A4033] transition-colors"
                  aria-label="Giảm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#29241E] min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 hover:bg-[#E7E0D6] text-[#5A4033] transition-colors"
                  aria-label="Tăng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  variant="secondary"
                  size="lg"
                  className="flex-1 justify-center text-xs sm:text-sm font-bold"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>Thêm vào giỏ</span>
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="lg"
                  className="flex-1 justify-center text-xs sm:text-sm font-bold shadow-md"
                >
                  <span>Mua ngay</span>
                </Button>
              </div>
            </div>

            {/* Wishlist & Compare Quick Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                  isFav
                    ? "bg-[#FDF2F0] border-[#F5C2BC] text-[#A05C52]"
                    : "bg-[#FAF8F5] border-[#E7E0D6] text-[#5A4033] hover:border-[#D3C7B7]"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                <span>{isFav ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isComp) {
                    removeFromCompare(product.id);
                  } else {
                    addToCompare(product);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                  isComp
                    ? "bg-[#EBF0ED] border-[#C5D3CC] text-[#5B7065]"
                    : "bg-[#FAF8F5] border-[#E7E0D6] text-[#5A4033] hover:border-[#D3C7B7]"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isComp ? "Đang so sánh" : "So sánh thông số"}</span>
              </button>
            </div>

            {/* Added Toast */}
            {addedToast && (
              <div className="p-3 bg-[#EBF0ED] border border-[#C5D3CC] rounded-xl text-xs text-[#3E5247] flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5B7065]" />
                  <span>Đã thêm <strong>{quantity} sản phẩm</strong> vào giỏ hàng!</span>
                </div>
                <Link href="/cart" className="font-bold underline text-[#5B7065] hover:text-[#4A5D53]">
                  Xem giỏ
                </Link>
              </div>
            )}
          </div>

          {/* Service Promises */}
          <div className="border-t border-[#E7E0D6] pt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-[#786C5E]">
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E7E0D6]">
              <Truck className="w-4 h-4 mx-auto mb-1 text-[#5B7065]" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E7E0D6]">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#5B7065]" />
              <span>Đổi trả 30 ngày</span>
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E7E0D6]">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#5B7065]" />
              <span>Bảo hành 12 tháng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews & Real-Space Feedback (U039) */}
      <ProductReviewsSection productId={product.id} />

      {/* Recently Viewed Products (U016) */}
      <RecentlyViewedSection currentProductId={product.id} />
    </div>
  );
}

