export interface PlacedFurniture {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  xMm: number;
  yMm: number;
  rotationDeg: number;
  priceVnd: number;
  color: string;
}

export interface RoomProfile {
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  noDrillRequired: boolean;
}

export type FitStatus = "FIT" | "MAY_FIT" | "DOES_NOT_FIT" | "INSUFFICIENT_DATA";

export interface SpaceFitEvaluation {
  status: FitStatus;
  statusLabel: string;
  occupancyPercentage: number;
  hasBoundaryCollision: boolean;
  hasObjectOverlap: boolean;
  notes: string[];
}

