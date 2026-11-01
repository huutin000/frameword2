import { describe, it, expect } from "vitest";
import {
  getAllPromotions,
  createPromotion,
  togglePromotionStatus,
  deletePromotion,
} from "./data/promotion-store";

describe("[A025] Admin Promotions & Coupon Policy", () => {
  it("lists all seeded promotions including SMALL2026", () => {
    const promos = getAllPromotions();
    expect(promos.length).toBeGreaterThanOrEqual(3);
    expect(promos.some((p) => p.code === "SMALL2026")).toBe(true);
  });

  it("prevents duplicate promotion code registration", () => {
    const res = createPromotion({
      code: "SMALL2026", // already exists
      discountPercent: 15,
      maxDiscountVnd: 100000,
      minOrderVnd: 0,
      usageLimit: 100,
      isActive: true,
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-12-31T23:59:59Z",
      description: "Thử trùng lặp",
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("đã tồn tại");
  });

  it("creates, toggles, and deletes a promotion", () => {
    const newCode = `TESTPROMO${Date.now().toString().slice(-4)}`;
    const createRes = createPromotion({
      code: newCode,
      discountPercent: 20,
      maxDiscountVnd: 300000,
      minOrderVnd: 500000,
      usageLimit: 50,
      isActive: true,
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-12-31T23:59:59Z",
      description: "Khuyến mãi test",
    });

    expect(createRes.success).toBe(true);
    const promoId = createRes.promotion!.id;

    // Toggle
    const toggleRes = togglePromotionStatus(promoId);
    expect(toggleRes.success).toBe(true);
    expect(toggleRes.isActive).toBe(false);

    // Delete
    const delRes = deletePromotion(promoId);
    expect(delRes).toBe(true);
  });
});

