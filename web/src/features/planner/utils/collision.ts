export interface PlannerItem {
  id: string;
  productId: string;
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  xMm: number; // x position in mm
  zMm: number; // z position (depth) in mm
  rotationDeg: 0 | 90 | 180 | 270;
  color: string;
  priceVnd: number;
  category: string;
  noDrill?: boolean;
  collidingWith?: string[];
  isOutOfBounds?: boolean;
}

export interface RoomScene {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  items: PlannerItem[];
  updatedAt: string;
}

export interface SceneEvaluation {
  hasCollisions: boolean;
  hasOutOfBounds: boolean;
  collidingPairs: [string, string][];
  totalAreaM2: number;
  occupiedAreaM2: number;
  freeAreaM2: number;
  occupancyRatio: number; // percentage (0-100)
}

/**
 * Returns effective 2D bounding footprint dimensions accounting for 90° rotation.
 */
export function getEffectiveDimensions(item: {
  widthMm: number;
  depthMm: number;
  rotationDeg: number;
}): { effectiveWidthMm: number; effectiveDepthMm: number } {
  const isRotatedQuarter = item.rotationDeg === 90 || item.rotationDeg === 270;
  return {
    effectiveWidthMm: isRotatedQuarter ? item.depthMm : item.widthMm,
    effectiveDepthMm: isRotatedQuarter ? item.widthMm : item.depthMm,
  };
}

/**
 * Evaluates collisions between items and against room wall boundaries.
 */
export function evaluateSceneCollisions(
  items: PlannerItem[],
  room: { widthMm: number; depthMm: number; heightMm: number }
): { evaluatedItems: PlannerItem[]; summary: SceneEvaluation } {
  const evaluatedItems: PlannerItem[] = items.map((item) => ({
    ...item,
    collidingWith: [],
    isOutOfBounds: false,
  }));

  const collidingPairs: [string, string][] = [];

  // 1. Boundary Checks
  for (const item of evaluatedItems) {
    const { effectiveWidthMm, effectiveDepthMm } = getEffectiveDimensions(item);

    const outX = item.xMm < 0 || item.xMm + effectiveWidthMm > room.widthMm;
    const outZ = item.zMm < 0 || item.zMm + effectiveDepthMm > room.depthMm;
    const outHeight = item.heightMm > room.heightMm;

    if (outX || outZ || outHeight) {
      item.isOutOfBounds = true;
    }
  }

  // 2. Pairwise AABB Collision Checks
  for (let i = 0; i < evaluatedItems.length; i++) {
    for (let j = i + 1; j < evaluatedItems.length; j++) {
      const a = evaluatedItems[i];
      const b = evaluatedItems[j];

      const dimA = getEffectiveDimensions(a);
      const dimB = getEffectiveDimensions(b);

      const overlapX =
        a.xMm < b.xMm + dimB.effectiveWidthMm &&
        a.xMm + dimA.effectiveWidthMm > b.xMm;
      const overlapZ =
        a.zMm < b.zMm + dimB.effectiveDepthMm &&
        a.zMm + dimA.effectiveDepthMm > b.zMm;

      if (overlapX && overlapZ) {
        a.collidingWith?.push(b.id);
        b.collidingWith?.push(a.id);
        collidingPairs.push([a.id, b.id]);
      }
    }
  }

  // 3. Metric Calculations
  const totalAreaM2 = Number(
    ((room.widthMm * room.depthMm) / 1_000_000).toFixed(2)
  );
  const occupiedAreaM2 = Number(
    items
      .reduce((sum, item) => sum + (item.widthMm * item.depthMm) / 1_000_000, 0)
      .toFixed(2)
  );
  const freeAreaM2 = Number(Math.max(0, totalAreaM2 - occupiedAreaM2).toFixed(2));
  const occupancyRatio =
    totalAreaM2 > 0 ? Number(((occupiedAreaM2 / totalAreaM2) * 100).toFixed(1)) : 0;

  return {
    evaluatedItems,
    summary: {
      hasCollisions: collidingPairs.length > 0,
      hasOutOfBounds: evaluatedItems.some((it) => it.isOutOfBounds),
      collidingPairs,
      totalAreaM2,
      occupiedAreaM2,
      freeAreaM2,
      occupancyRatio,
    },
  };
}

/**
 * Serializes room scene to JSON.
 */
export function serializeScene(scene: RoomScene): string {
  return JSON.stringify(scene);
}

/**
 * Deserializes JSON string to validated RoomScene.
 */
export function deserializeScene(json: string): RoomScene {
  const parsed = JSON.parse(json);
  if (
    !parsed ||
    typeof parsed.widthMm !== "number" ||
    typeof parsed.depthMm !== "number" ||
    !Array.isArray(parsed.items)
  ) {
    throw new Error("Invalid RoomScene JSON format");
  }
  return parsed as RoomScene;
}

