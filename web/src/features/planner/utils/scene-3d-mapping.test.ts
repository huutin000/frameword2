import { describe, it, expect } from "vitest";
import {
  mmToM,
  mToMm,
  degToRad,
  mapItemTo3D,
  map3DToItemCoordinates,
} from "./scene-3d-mapping";
import type { PlannerItem } from "./collision";

describe("3D Scene Mapping & Canonical Synchronization (S013, S017)", () => {
  const sampleTable: PlannerItem = {
    id: "table-1",
    productId: "p1",
    name: "Bàn gấp",
    widthMm: 1000,
    depthMm: 600,
    heightMm: 750,
    xMm: 500,
    zMm: 400,
    rotationDeg: 0,
    color: "#5B7065",
    priceVnd: 1000000,
    category: "Bàn",
  };

  it("should convert units accurately between mm and meters", () => {
    expect(mmToM(1000)).toBe(1.0);
    expect(mmToM(2600)).toBe(2.6);
    expect(mmToM(150)).toBe(0.15);
    expect(mToMm(1.5)).toBe(1500);
    expect(degToRad(180)).toBeCloseTo(Math.PI);
  });

  it("should map 2D coordinates to centered 3D box coordinates resting on floor", () => {
    const pos3D = mapItemTo3D(sampleTable, 2600);

    // Size: 1.0m width, 0.6m depth, 0.75m height
    expect(pos3D.sizeX).toBe(1.0);
    expect(pos3D.sizeZ).toBe(0.6);
    expect(pos3D.sizeY).toBe(0.75);

    // Center X: 0.5m (xMm) + 1.0 / 2 = 1.0m
    expect(pos3D.centerX).toBe(1.0);

    // Center Y: rests on floor, so center is at height / 2 = 0.375m
    expect(pos3D.centerY).toBe(0.375);

    // Center Z: 0.4m (zMm) + 0.6 / 2 = 0.7m
    expect(pos3D.centerZ).toBe(0.7);

    // Rotation: 0 rad
    expect(pos3D.rotationRadY).toBe(0);
  });

  it("should swap 3D footprint dimensions when item is rotated 90 degrees", () => {
    const rotatedTable: PlannerItem = {
      ...sampleTable,
      rotationDeg: 90,
    };

    const pos3D = mapItemTo3D(rotatedTable, 2600);

    // Effective width is depth (0.6m), effective depth is width (1.0m)
    expect(pos3D.sizeX).toBe(0.6);
    expect(pos3D.sizeZ).toBe(1.0);
    expect(pos3D.rotationRadY).toBeCloseTo(Math.PI / 2);

    // Center X: 0.5m + 0.6 / 2 = 0.8m
    expect(pos3D.centerX).toBe(0.8);
    // Center Z: 0.4m + 1.0 / 2 = 0.9m
    expect(pos3D.centerZ).toBe(0.9);
  });

  it("should roundtrip 2D -> 3D -> 2D coordinates without drift (S017)", () => {
    const pos3D = mapItemTo3D(sampleTable, 2600);
    const backTo2D = map3DToItemCoordinates(
      pos3D.centerX,
      pos3D.centerZ,
      pos3D.sizeX,
      pos3D.sizeZ
    );

    expect(backTo2D.xMm).toBe(sampleTable.xMm);
    expect(backTo2D.zMm).toBe(sampleTable.zMm);
  });
});

