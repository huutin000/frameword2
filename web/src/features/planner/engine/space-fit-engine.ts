import type { RoomProfile, PlacedFurniture, SpaceFitEvaluation } from "../types";

/**
 * Deterministic SpaceFit calculation engine.
 * Evaluates whether placed furniture items fit inside a given room boundary
 * without overlapping each other or exceeding ceiling height.
 */
export function evaluateSpaceFit(
  room: RoomProfile,
  items: PlacedFurniture[]
): SpaceFitEvaluation {
  const notes: string[] = [];
  let hasBoundaryCollision = false;
  let hasObjectOverlap = false;

  const roomAreaMm2 = room.widthMm * room.depthMm;
  const totalFurnitureAreaMm2 = items.reduce(
    (sum, item) => sum + item.widthMm * item.depthMm,
    0
  );

  const occupancyPercentage = Number(
    ((totalFurnitureAreaMm2 / roomAreaMm2) * 100).toFixed(1)
  );

  // 1. Boundary & Height Checks
  for (const item of items) {
    if (item.xMm + item.widthMm > room.widthMm || item.yMm + item.depthMm > room.depthMm) {
      hasBoundaryCollision = true;
      notes.push(`Món "${item.name}" vượt quá phạm vi tường phòng.`);
    }

    if (item.heightMm > room.heightMm) {
      hasBoundaryCollision = true;
      notes.push(`Chiều cao "${item.name}" (${item.heightMm}mm) chạm trần (${room.heightMm}mm).`);
    }
  }

  // 2. Overlap Checks between items (AABB 2D Collision)
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      const overlapX = a.xMm < b.xMm + b.widthMm && a.xMm + a.widthMm > b.xMm;
      const overlapY = a.yMm < b.yMm + b.depthMm && a.yMm + a.depthMm > b.yMm;

      if (overlapX && overlapY) {
        hasObjectOverlap = true;
        notes.push(`Phát hiện va chạm đè nhau giữa "${a.name}" và "${b.name}".`);
      }
    }
  }

  // 3. Occupancy Guidance
  if (occupancyPercentage > 45) {
    notes.push("Mặt sàn bị chiếm dụng trên 45%, có thể cản trở lối đi lưu thông.");
  }

  // Determine overall status
  if (hasBoundaryCollision || hasObjectOverlap) {
    return {
      status: "DOES_NOT_FIT",
      statusLabel: "KHÔNG ĐỦ DIỆN TÍCH / VA CHẠM",
      occupancyPercentage,
      hasBoundaryCollision,
      hasObjectOverlap,
      notes,
    };
  }

  if (occupancyPercentage > 40) {
    return {
      status: "MAY_FIT",
      statusLabel: "CẦN CHÚ Ý LỐI ĐI",
      occupancyPercentage,
      hasBoundaryCollision: false,
      hasObjectOverlap: false,
      notes,
    };
  }

  return {
    status: "FIT",
    statusLabel: "VỪA VẶN HOÀN TOÀN",
    occupancyPercentage,
    hasBoundaryCollision: false,
    hasObjectOverlap: false,
    notes: ["Không gian bố trí thông thoáng, chuẩn lưu thông."],
  };
}

