import { describe, it, expect } from "vitest";
import { evaluateSpaceFit } from "./space-fit-engine";
import type { RoomProfile, PlacedFurniture } from "../types";

describe("SpaceFit Engine Deterministic Tests", () => {
  const sampleRoom: RoomProfile = {
    name: "Phòng trọ 12m2",
    widthMm: 4000,
    depthMm: 3000,
    heightMm: 2700,
    noDrillRequired: true,
  };

  it("should report FIT when furniture items fit inside comfortably without overlap", () => {
    const items: PlacedFurniture[] = [
      {
        id: "1",
        name: "Kệ đứng",
        widthMm: 600,
        depthMm: 300,
        heightMm: 2500,
        xMm: 100,
        yMm: 100,
        rotationDeg: 0,
        priceVnd: 500000,
        color: "#5B7065",
      },
      {
        id: "2",
        name: "Bàn gấp",
        widthMm: 800,
        depthMm: 500,
        heightMm: 750,
        xMm: 1000,
        yMm: 100,
        rotationDeg: 0,
        priceVnd: 800000,
        color: "#5A4033",
      },
    ];

    const result = evaluateSpaceFit(sampleRoom, items);
    expect(result.status).toBe("FIT");
    expect(result.hasBoundaryCollision).toBe(false);
    expect(result.hasObjectOverlap).toBe(false);
    expect(result.occupancyPercentage).toBeLessThan(10);
  });

  it("should report DOES_NOT_FIT when furniture exceeds boundary walls", () => {
    const items: PlacedFurniture[] = [
      {
        id: "1",
        name: "Kệ quá khổ",
        widthMm: 1200,
        depthMm: 400,
        heightMm: 2000,
        xMm: 3500, // 3500 + 1200 = 4700 > 4000
        yMm: 100,
        rotationDeg: 0,
        priceVnd: 500000,
        color: "#5B7065",
      },
    ];

    const result = evaluateSpaceFit(sampleRoom, items);
    expect(result.status).toBe("DOES_NOT_FIT");
    expect(result.hasBoundaryCollision).toBe(true);
  });

  it("should report DOES_NOT_FIT when furniture items overlap each other", () => {
    const items: PlacedFurniture[] = [
      {
        id: "1",
        name: "Món A",
        widthMm: 500,
        depthMm: 500,
        heightMm: 500,
        xMm: 200,
        yMm: 200,
        rotationDeg: 0,
        priceVnd: 100000,
        color: "#5B7065",
      },
      {
        id: "2",
        name: "Món B",
        widthMm: 500,
        depthMm: 500,
        heightMm: 500,
        xMm: 300, // Overlaps with Món A
        yMm: 300,
        rotationDeg: 0,
        priceVnd: 200000,
        color: "#5A4033",
      },
    ];

    const result = evaluateSpaceFit(sampleRoom, items);
    expect(result.status).toBe("DOES_NOT_FIT");
    expect(result.hasObjectOverlap).toBe(true);
  });
});

