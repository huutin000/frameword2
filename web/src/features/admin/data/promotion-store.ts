export interface PromotionRecord {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscountVnd: number;
  minOrderVnd: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  description: string;
}

let PROMOTIONS_REGISTRY: PromotionRecord[] = [
  {
    id: "promo-1",
    code: "SMALL2026",
    discountPercent: 10,
    maxDiscountVnd: 500000,
    minOrderVnd: 0,
    usageLimit: 1000,
    usedCount: 42,
    isActive: true,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    description: "Mã ra mắt nền tảng Small Living 2026 — Giảm 10% tối đa 500.000đ",
  },
  {
    id: "promo-2",
    code: "STUDIO50K",
    discountPercent: 5,
    maxDiscountVnd: 200000,
    minOrderVnd: 1000000,
    usageLimit: 500,
    usedCount: 18,
    isActive: true,
    startDate: "2026-10-01T00:00:00Z",
    endDate: "2026-11-30T23:59:59Z",
    description: "Ưu đãi cho đơn hàng nội thất phòng trọ / studio từ 1.000.000đ",
  },
  {
    id: "promo-3",
    code: "FREESHIP26",
    discountPercent: 100, // covers shipping
    maxDiscountVnd: 35000,
    minOrderVnd: 500000,
    usageLimit: 200,
    usedCount: 200, // Exhausted!
    isActive: false,
    startDate: "2026-10-15T00:00:00Z",
    endDate: "2026-10-31T23:59:59Z",
    description: "Miễn phí vận chuyển toàn quốc cho các đơn hàng từ 500.000đ (Đã hết lượt)",
  },
];

export function getAllPromotions(): PromotionRecord[] {
  return [...PROMOTIONS_REGISTRY];
}

export function createPromotion(
  data: Omit<PromotionRecord, "id" | "usedCount">
): { success: boolean; promotion?: PromotionRecord; error?: string } {
  const cleanCode = data.code.trim().toUpperCase();
  if (PROMOTIONS_REGISTRY.some((p) => p.code === cleanCode)) {
    return { success: false, error: `Mã khuyến mãi "${cleanCode}" đã tồn tại` };
  }

  const newPromo: PromotionRecord = {
    ...data,
    code: cleanCode,
    id: `promo-${Date.now()}`,
    usedCount: 0,
  };

  PROMOTIONS_REGISTRY.unshift(newPromo);
  return { success: true, promotion: newPromo };
}

export function togglePromotionStatus(id: string): { success: boolean; isActive?: boolean } {
  const promo = PROMOTIONS_REGISTRY.find((p) => p.id === id);
  if (!promo) return { success: false };
  promo.isActive = !promo.isActive;
  return { success: true, isActive: promo.isActive };
}

export function deletePromotion(id: string): boolean {
  const initialLen = PROMOTIONS_REGISTRY.length;
  PROMOTIONS_REGISTRY = PROMOTIONS_REGISTRY.filter((p) => p.id !== id);
  return PROMOTIONS_REGISTRY.length < initialLen;
}

