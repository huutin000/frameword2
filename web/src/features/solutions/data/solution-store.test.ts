import { describe, it, expect } from "vitest";
import {
  calculateBundlePricing,
  getTemplateBySlug,
  getTemplateById,
} from "./solution-store";
import type { SolutionItem } from "../types";

describe("Solution Bundle Builder Tests (S006, S007, S018)", () => {
  const sampleItems: SolutionItem[] = [
    {
      productId: "p1",
      title: "Bàn gấp",
      variantSku: "P1-WHITE",
      variantName: "Trắng",
      priceVnd: 1000000,
      imageUrl: "/test.jpg",
      widthMm: 1000,
      depthMm: 500,
      heightMm: 750,
      noDrill: true,
      quantity: 1,
      selected: true,
    },
    {
      productId: "p2",
      title: "Kệ đứng",
      variantSku: "P2-OAK",
      variantName: "Gỗ sồi",
      priceVnd: 2000000,
      imageUrl: "/test2.jpg",
      widthMm: 600,
      depthMm: 300,
      heightMm: 1500,
      noDrill: true,
      quantity: 1,
      selected: true,
    },
  ];

  it("should calculate correct 10% combo discount when multiple items are selected", () => {
    const pricing = calculateBundlePricing(sampleItems, 10);
    expect(pricing.originalTotalVnd).toBe(3000000);
    expect(pricing.discountVnd).toBe(300000);
    expect(pricing.finalTotalVnd).toBe(2700000);
    expect(pricing.selectedCount).toBe(2);
    expect(pricing.allNoDrill).toBe(true);
  });

  it("should not apply combo discount when only 1 item is selected", () => {
    const singleItem = [
      { ...sampleItems[0], selected: true },
      { ...sampleItems[1], selected: false },
    ];
    const pricing = calculateBundlePricing(singleItem, 10);
    expect(pricing.originalTotalVnd).toBe(1000000);
    expect(pricing.discountVnd).toBe(0);
    expect(pricing.finalTotalVnd).toBe(1000000);
    expect(pricing.selectedCount).toBe(1);
  });

  it("should aggregate total floor footprint in square meters", () => {
    // Item 1: 1.0m x 0.5m = 0.5 m²
    // Item 2: 0.6m x 0.3m = 0.18 m²
    // Total: 0.68 m²
    const pricing = calculateBundlePricing(sampleItems, 10);
    expect(pricing.totalFloorAreaM2).toBe(0.68);
  });

  it("should correctly find templates by slug and id", () => {
    const template = getTemplateBySlug("combo-phong-tro-12m");
    expect(template).toBeDefined();
    expect(template?.title).toContain("Combo Phòng Trọ 12m²");

    const byId = getTemplateById("bundle-phong-tro-12m");
    expect(byId).toBeDefined();
    expect(byId?.items.length).toBe(3);
  });
});
