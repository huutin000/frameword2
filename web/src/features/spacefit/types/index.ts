export type SpaceFitStatus = "FIT" | "MAY_FIT" | "DOES_NOT_FIT" | "INSUFFICIENT_DATA";

export interface ProductDimensions {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  requiresDrilling?: boolean;
  weightCapacityKg?: number;
}

export interface SpaceFitClearance {
  remainingWidthMm: number;
  remainingDepthMm: number;
  remainingHeightMm: number;
}

export interface ProductSpaceFitResult {
  status: SpaceFitStatus;
  statusLabel: string;
  badgeVariant: "success" | "warning" | "destructive" | "neutral";
  compatibilityScore: number; // 0-100 calculated deterministically
  reasons: string[];
  clearanceMm: SpaceFitClearance;
  occupancyPercentage: number; // % of total room floor
  freeOccupancyPercentage: number; // % of usable free floor
  isRotated: boolean; // Needs 90° rotation to fit
  noDrillConflict: boolean;
  disclaimer: string;
}

