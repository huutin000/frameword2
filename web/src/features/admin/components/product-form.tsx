"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Ruler,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import type { RoomType, SpatialProblem } from "@/types/commerce";
import type { AdminProductRecord } from "../data/product-store";
import {
  createProductAction,
  updateProductAction,
} from "../actions/product-actions";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  initialProduct?: AdminProductRecord;
  isEdit?: boolean;
}

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [category, setCategory] = useState(initialProduct?.category || "Kệ & Tủ đứng");
  const [roomType, setRoomType] = useState(initialProduct?.roomType || "studio");
  const [roomTag, setRoomTag] = useState(initialProduct?.roomTag || "Phòng trọ / Studio");
  const [problem, setProblem] = useState(initialProduct?.problem || "no-drill");
  const [problemTag, setProblemTag] = useState(initialProduct?.problemTag || "Không khoan tường");
  const [widthMm, setWidthMm] = useState(initialProduct?.widthMm || 600);
  const [depthMm, setDepthMm] = useState(initialProduct?.depthMm || 300);
  const [heightMm, setHeightMm] = useState(initialProduct?.heightMm || 1800);
  const [priceVnd, setPriceVnd] = useState(initialProduct?.priceVnd || 650000);
  const [sku, setSku] = useState(initialProduct?.sku || "SL-PROD-NEW");
  const [stockBalance, setStockBalance] = useState(initialProduct?.stockBalance || 20);
  const [weightCapacityKg, setWeightCapacityKg] = useState(initialProduct?.weightCapacityKg || 30);
  const [material, setMaterial] = useState(initialProduct?.material || "Thép carbon sơn tĩnh điện");
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl ||
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=80"
  );
  const [fitScoreExplanation, setFitScoreExplanation] = useState(
    initialProduct?.fitScoreExplanation || "Phù hợp trần từ 2.2m đến 2.8m, chân đế cao su chống trượt"
  );
  const [noDrill, setNoDrill] = useState(initialProduct?.noDrill ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      // Auto generate slug
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = {
      title,
      slug,
      category,
      roomType,
      roomTag,
      problem,
      problemTag,
      widthMm: Number(widthMm),
      depthMm: Number(depthMm),
      heightMm: Number(heightMm),
      priceVnd: Number(priceVnd),
      sku,
      stockBalance: Number(stockBalance),
      weightCapacityKg: Number(weightCapacityKg),
      material,
      imageUrl,
      fitScoreExplanation,
      noDrill: Boolean(noDrill),
    };

    try {
      let res;
      if (isEdit && initialProduct) {
        res = await updateProductAction(initialProduct.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success) {
        router.push("/admin/products");
      } else {
        setErrorMessage(res.error || "Không thể lưu sản phẩm");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs text-[#5B7065] hover:text-[#4A5D53] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách sản phẩm</span>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="md"
          className="gap-1.5 shadow-xs font-bold"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Đang lưu..." : isEdit ? "Cập nhật sản phẩm" : "Lưu sản phẩm mới"}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl text-xs text-[#A05C52] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Basic Information */}
        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
            Thông tin cơ bản & Phân loại
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#5A4033] mb-1">
              Tên sản phẩm <span className="text-[#A05C52]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Kệ Đứng Tăng Giảm Đa Tầng 600mm"
              className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Mã SKU <span className="text-[#A05C52]">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SL-KE-01"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Slug đường dẫn
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ke-tang-giam-600mm"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              >
                <option value="Kệ & Tủ đứng">Kệ & Tủ đứng</option>
                <option value="Bàn làm việc">Bàn làm việc</option>
                <option value="Kệ nhà bếp">Kệ nhà bếp</option>
                <option value="Hộp & Khay chứa">Hộp & Khay chứa</option>
                <option value="Giá & Cây treo">Giá & Cây treo</option>
                <option value="Phụ kiện giặt phơi">Phụ kiện giặt phơi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Không gian phòng</label>
              <select
                value={roomType}
                onChange={(e) => {
                  setRoomType(e.target.value as RoomType);
                  const tagMap: Record<string, string> = {
                    studio: "Phòng trọ / Studio",
                    bedroom: "Phòng ngủ",
                    workspace: "Góc làm việc mini",
                    kitchen: "Nhà bếp nhỏ",
                    balcony: "Ban công & Giặt phơi",
                  };
                  setRoomTag(tagMap[e.target.value] || e.target.value);
                }}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              >
                <option value="studio">Phòng trọ / Studio</option>
                <option value="bedroom">Phòng ngủ</option>
                <option value="workspace">Góc làm việc mini</option>
                <option value="kitchen">Nhà bếp nhỏ</option>
                <option value="balcony">Ban công & Giặt phơi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A4033] mb-1">Giải pháp không gian</label>
            <select
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value as SpatialProblem);
                const probMap: Record<string, string> = {
                  "no-drill": "Không khoan tường",
                  "tight-space": "Phòng hẹp dưới 15m²",
                  "dead-corner": "Góc chết & khe hẹp",
                  foldable: "Gấp gọn đa năng",
                };
                setProblemTag(probMap[e.target.value] || e.target.value);
              }}
              className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
            >
              <option value="no-drill">Không khoan tường</option>
              <option value="tight-space">Phòng hẹp dưới 15m²</option>
              <option value="dead-corner">Góc chết & khe hẹp</option>
              <option value="foldable">Gấp gọn đa năng</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Giá niêm yết (VND) <span className="text-[#A05C52]">*</span>
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={priceVnd}
                onChange={(e) => setPriceVnd(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Số lượng tồn kho ban đầu <span className="text-[#A05C52]">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={stockBalance}
                onChange={(e) => setStockBalance(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: SpaceFit Specifications & Media */}
        <div className="space-y-6">
          {/* SpaceFit Card */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6] flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#5B7065]" />
              <span>Kích thước chính xác SpaceFit™ (mm)</span>
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#786C5E] mb-1">Rộng (W)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={widthMm}
                  onChange={(e) => setWidthMm(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-xs font-mono text-center font-bold text-[#29241E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#786C5E] mb-1">Sâu (D)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={depthMm}
                  onChange={(e) => setDepthMm(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-xs font-mono text-center font-bold text-[#29241E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#786C5E] mb-1">Cao (H)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={heightMm}
                  onChange={(e) => setHeightMm(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-xs font-mono text-center font-bold text-[#29241E]"
                />
              </div>
            </div>

            {/* No drill toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] cursor-pointer">
              <input
                type="checkbox"
                checked={noDrill}
                onChange={(e) => setNoDrill(e.target.checked)}
                className="w-4 h-4 text-[#5B7065] rounded focus:ring-[#5B7065]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#29241E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5B7065]" />
                  <span>Cơ chế Không Khoan Tường (No-drill)</span>
                </span>
                <span className="text-[#786C5E] text-[11px] block mt-0.5">
                  Phù hợp hợp đồng thuê trọ nghiêm ngặt cấm khoan đục bê tông
                </span>
              </div>
            </label>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Lời khuyên tương thích không gian SpaceFit™
              </label>
              <textarea
                rows={2}
                value={fitScoreExplanation}
                onChange={(e) => setFitScoreExplanation(e.target.value)}
                placeholder="VD: Phù hợp trần cao 2.2m – 2.8m, chiếm diện tích 0.18m² sàn..."
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
          </div>

          {/* Media & Details Card */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Hình ảnh & Chất liệu
            </h2>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                URL Hình ảnh sản phẩm (Chụp thật có bản quyền)
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D6]">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="300px" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Tải trọng tối đa (kg)</label>
                <input
                  type="number"
                  value={weightCapacityKg}
                  onChange={(e) => setWeightCapacityKg(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Chất liệu chính</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Thép carbon, Gỗ sồi..."
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
