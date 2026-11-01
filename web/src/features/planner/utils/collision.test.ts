import { describe, it, expect } from "vitest";
import {
  getEffectiveDimensions,
  evaluateSceneCollisions,
  serializeScene,
  deserializeScene,
  type PlannerItem,
  type RoomScene,
} from "./collision";

describe("2D Room Planner Geometry & Collision Engine (S009, S010, S012)", () => {
  const sampleRoom = {
    widthMm: 4000,
    depthMm: 3000,
    heightMm: 2600,
  };

  it("should correctly swap effective dimensions when rotated 90 or 270 degrees", () => {
    const item = {
      widthMm: 1200,
      depthMm: 600,
      rotationDeg: 0,
    };
    expect(getEffectiveDimensions(item)).toEqual({
      effectiveWidthMm: 1200,
      effectiveDepthMm: 600,
    });

    const rotated90 = { ...item, rotationDeg: 90 };
    expect(getEffectiveDimensions(rotated90)).toEqual({
      effectiveWidthMm: 600,
      effectiveDepthMm: 1200,
    });

    const rotated270 = { ...item, rotationDeg: 270 };
    expect(getEffectiveDimensions(rotated270)).toEqual({
      effectiveWidthMm: 600,
      effectiveDepthMm: 1200,
    });
  });

  it("should detect overlapping collision between two items", () => {
    const items: PlannerItem[] = [
      {
        id: "item-1",
        productId: "p1",
        name: "Bàn làm việc",
        widthMm: 1000,
        depthMm: 600,
        heightMm: 750,
        xMm: 200,
        zMm: 200,
        rotationDeg: 0,
        color: "#5B7065",
        priceVnd: 1000000,
        category: "Bàn",
      },
      {
        id: "item-2",
        productId: "p2",
        name: "Ghế",
        widthMm: 500,
        depthMm: 500,
        heightMm: 800,
        xMm: 500, // Overlaps horizontally (200..1200)
        zMm: 400, // Overlaps vertically (200..800)
        rotationDeg: 0,
        color: "#29241E",
        priceVnd: 500000,
        category: "Ghế",
      },
    ];

    const result = evaluateSceneCollisions(items, sampleRoom);
    expect(result.summary.hasCollisions).toBe(true);
    expect(result.summary.collidingPairs.length).toBe(1);
    expect(result.evaluatedItems[0].collidingWith).toContain("item-2");
    expect(result.evaluatedItems[1].collidingWith).toContain("item-1");
  });

  it("should detect out-of-bounds when item exceeds room boundary walls", () => {
    const items: PlannerItem[] = [
      {
        id: "item-out",
        productId: "p1",
        name: "Tủ quá tường",
        widthMm: 1000,
        depthMm: 600,
        heightMm: 2000,
        xMm: 3500, // 3500 + 1000 = 4500 > 4000
        zMm: 500,
        rotationDeg: 0,
        color: "#5B7065",
        priceVnd: 1000000,
        category: "Tủ",
      },
    ];

    const result = evaluateSceneCollisions(items, sampleRoom);
    expect(result.summary.hasOutOfBounds).toBe(true);
    expect(result.evaluatedItems[0].isOutOfBounds).toBe(true);
  });

  it("should preserve exact scene data in serialize and deserialize roundtrip (S012)", () => {
    const originalScene: RoomScene = {
      id: "scene-123",
      name: "Phòng Trọ 12m2 Tinh Gọn",
      widthMm: 3500,
      depthMm: 3420,
      heightMm: 2600,
      updatedAt: "2026-11-01T12:00:00Z",
      items: [
        {
          id: "it-1",
          productId: "p1",
          name: "Bàn gấp",
          widthMm: 800,
          depthMm: 400,
          heightMm: 750,
          xMm: 100,
          zMm: 100,
          rotationDeg: 90,
          color: "#5B7065",
          priceVnd: 890000,
          category: "Bàn",
        },
      ],
    };

    const serialized = serializeScene(originalScene);
    const restored = deserializeScene(serialized);

    expect(restored.id).toBe(originalScene.id);
    expect(restored.widthMm).toBe(originalScene.widthMm);
    expect(restored.items.length).toBe(1);
    expect(restored.items[0].rotationDeg).toBe(90);
    expect(restored.items[0].xMm).toBe(100);
  });
});

