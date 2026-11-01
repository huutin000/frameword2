import { describe, it, expect } from "vitest";
import { evaluateProductSpaceFit } from "./spacefit-engine";
import type { RoomProfile } from "../../room-profile/types";
import type { ProductDimensions } from "../types";

describe("SpaceFit Deterministic Engine Tests (S003, S004)", () => {
  const sampleRoom: RoomProfile = {
    id: "test-room-1",
    name: "Phòng Trọ 12m² Test",
    roomType: "studio",
    widthMm: 3500,
    depthMm: 3420,
    heightMm: 2600,
    freeWidthMm: 2000,
    freeDepthMm: 1500,
    freeHeightMm: 2600,
    isRented: true,
    noDrillRequired: true,
    targetBudgetVnd: 15000000,
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
  };

  it("should evaluate FIT when product fits comfortably with walkway clearance >= 600mm", () => {
    const product: ProductDimensions = {
      widthMm: 800,
      depthMm: 500,
      heightMm: 750,
      requiresDrilling: false,
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.status).toBe("FIT");
    expect(res.statusLabel).toBe("VỪA VẶN HOÀN HẢO");
    expect(res.isRotated).toBe(false);
    expect(res.noDrillConflict).toBe(false);
    expect(res.clearanceMm.remainingWidthMm).toBe(1200);
    expect(res.clearanceMm.remainingDepthMm).toBe(1000);
    expect(res.compatibilityScore).toBeGreaterThanOrEqual(85);
  });

  it("should evaluate DOES_NOT_FIT when product requires drilling and room forbids drilling (S002, S003)", () => {
    const product: ProductDimensions = {
      widthMm: 600,
      depthMm: 200,
      heightMm: 400,
      requiresDrilling: true, // Conflict with noDrillRequired
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.status).toBe("DOES_NOT_FIT");
    expect(res.noDrillConflict).toBe(true);
    expect(res.reasons.some((r) => r.includes("khoan đục tường"))).toBe(true);
  });

  it("should evaluate DOES_NOT_FIT when product height exceeds room ceiling height", () => {
    const product: ProductDimensions = {
      widthMm: 800,
      depthMm: 500,
      heightMm: 2800, // Exceeds 2600mm
      requiresDrilling: false,
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.status).toBe("DOES_NOT_FIT");
    expect(res.clearanceMm.remainingHeightMm).toBeLessThan(0);
    expect(res.reasons.some((r) => r.includes("vượt trần"))).toBe(true);
  });

  it("should evaluate MAY_FIT and recommend 90-degree rotation when rotated footprint fits", () => {
    // Room free width is 2000, free depth is 1500
    // Product width is 1600 (fits W), but depth is 1800 (exceeds D 1500)
    // If rotated: width becomes 1800 (fits W 2000), depth becomes 1600 (exceeds D 1500) -> Wait
    // Let's test a case where direct fails but rotated succeeds:
    // Product: width 1800, depth 1200.
    // Room free: freeWidth 1400, freeDepth 2000.
    const customRoom: RoomProfile = {
      ...sampleRoom,
      freeWidthMm: 1400,
      freeDepthMm: 2000,
    };
    const product: ProductDimensions = {
      widthMm: 1800, // > 1400 direct
      depthMm: 1200, // <= 2000 direct, BUT 1800 > 1400 so direct fails
      heightMm: 1000,
      requiresDrilling: false,
    };
    // Rotated: effectiveWidth is 1200 (<= 1400), effectiveDepth is 1800 (<= 2000) -> Fits!
    const res = evaluateProductSpaceFit(product, customRoom);
    expect(res.status).toBe("MAY_FIT");
    expect(res.isRotated).toBe(true);
    expect(res.reasons.some((r) => r.includes("xoay ngang 90°"))).toBe(true);
  });

  it("should evaluate MAY_FIT when walkway clearance is tight (< 600mm)", () => {
    const product: ProductDimensions = {
      widthMm: 1600, // Remaining width: 2000 - 1600 = 400mm (< 600mm)
      depthMm: 600,
      heightMm: 750,
      requiresDrilling: false,
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.status).toBe("MAY_FIT");
    expect(res.reasons.some((r) => r.includes("dưới 600mm"))).toBe(true);
  });

  it("should evaluate INSUFFICIENT_DATA when dimensions are missing or zero", () => {
    const product: ProductDimensions = {
      widthMm: 0,
      depthMm: 500,
      heightMm: 800,
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.status).toBe("INSUFFICIENT_DATA");
    expect(res.statusLabel).toBe("THIẾU SỐ ĐO");
  });

  it("should calculate correct floor occupancy percentage", () => {
    // Room: 3.5m x 3.42m = 11.97 m²
    // Product: 1.0m x 0.5m = 0.5 m²
    // Occupancy: (0.5 / 11.97) * 100 = 4.17... -> 4.2%
    const product: ProductDimensions = {
      widthMm: 1000,
      depthMm: 500,
      heightMm: 750,
      requiresDrilling: false,
    };

    const res = evaluateProductSpaceFit(product, sampleRoom);
    expect(res.occupancyPercentage).toBe(4.2);
    expect(res.disclaimer).toBeTruthy();
  });
});

