import type { PlannerItem } from "./collision";
import { getEffectiveDimensions } from "./collision";

export interface Item3DPosition {
  centerX: number; // in meters
  centerY: number; // in meters (half height above floor)
  centerZ: number; // in meters
  rotationRadY: number; // in radians
  sizeX: number; // in meters
  sizeY: number; // in meters
  sizeZ: number; // in meters
}

/**
 * Converts millimeters to meters.
 */
export function mmToM(mm: number): number {
  return Number((mm / 1000).toFixed(4));
}

/**
 * Converts meters to millimeters.
 */
export function mToMm(m: number): number {
  return Math.round(m * 1000);
}

/**
 * Converts degrees to radians.
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Maps a canonical 2D PlannerItem into exact Three.js 3D world space coordinates.
 * Room origin (0, 0, 0) is at top-left corner on the floor:
 * - X: 0 to width (meters)
 * - Y: 0 (floor) to height (meters, ceiling)
 * - Z: 0 to depth (meters)
 */
export function mapItemTo3D(
  item: PlannerItem,
  roomHeightMm: number = 2600
): Item3DPosition {
  const { effectiveWidthMm, effectiveDepthMm } = getEffectiveDimensions(item);

  const sizeX = mmToM(effectiveWidthMm);
  const sizeY = mmToM(Math.min(item.heightMm, roomHeightMm));
  const sizeZ = mmToM(effectiveDepthMm);

  // BoxGeometry origin is at its center, so we offset by half dimensions
  const centerX = mmToM(item.xMm) + sizeX / 2;
  const centerY = sizeY / 2;
  const centerZ = mmToM(item.zMm) + sizeZ / 2;

  // Rotation around vertical Y-axis
  const rotationRadY = degToRad(item.rotationDeg);

  return {
    centerX: Number(centerX.toFixed(4)),
    centerY: Number(centerY.toFixed(4)),
    centerZ: Number(centerZ.toFixed(4)),
    rotationRadY,
    sizeX,
    sizeY,
    sizeZ,
  };
}

/**
 * Maps 3D center coordinates back to 2D top-left mm coordinates.
 */
export function map3DToItemCoordinates(
  centerX: number,
  centerZ: number,
  sizeX: number,
  sizeZ: number
): { xMm: number; zMm: number } {
  const xMm = mToMm(centerX - sizeX / 2);
  const zMm = mToMm(centerZ - sizeZ / 2);
  return {
    xMm: Math.max(0, xMm),
    zMm: Math.max(0, zMm),
  };
}

