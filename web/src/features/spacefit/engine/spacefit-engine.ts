import type { ProductDimensions, ProductSpaceFitResult, SpaceFitStatus } from "../types";
import type { RoomProfile } from "../../room-profile/types";

const DISCLAIMER_TEXT =
  "Kết quả SpaceFit dựa trên số đo hình học tĩnh và khoảng cách ước tính; không thay thế việc kiểm tra thực địa góc vát, phào chỉ và vị trí ổ cắm thực tế.";

/**
 * Pure deterministic SpaceFit evaluation function.
 * Evaluates a single product/variant dimensions against an active RoomProfile.
 */
export function evaluateProductSpaceFit(
  product: ProductDimensions,
  room: RoomProfile
): ProductSpaceFitResult {
  const reasons: string[] = [];

  // 1. Check for missing or zero dimensions
  if (
    !product.widthMm ||
    product.widthMm <= 0 ||
    !product.depthMm ||
    product.depthMm <= 0 ||
    !product.heightMm ||
    product.heightMm <= 0
  ) {
    return {
      status: "INSUFFICIENT_DATA",
      statusLabel: "THIẾU SỐ ĐO",
      badgeVariant: "neutral",
      compatibilityScore: 0,
      reasons: ["Sản phẩm chưa cập nhật đầy đủ kích thước 3 chiều (Dài x Rộng x Cao)."],
      clearanceMm: {
        remainingWidthMm: 0,
        remainingDepthMm: 0,
        remainingHeightMm: 0,
      },
      occupancyPercentage: 0,
      freeOccupancyPercentage: 0,
      isRotated: false,
      noDrillConflict: false,
      disclaimer: DISCLAIMER_TEXT,
    };
  }

  // 2. Check no-drill restriction
  let noDrillConflict = false;
  if (room.noDrillRequired && product.requiresDrilling) {
    noDrillConflict = true;
    reasons.push(
      "Sản phẩm yêu cầu khoan đục tường, vi phạm quy định cấm khoan của phòng thuê."
    );
  }

  // 3. Check ceiling height clearance
  const remainingHeightMm = room.freeHeightMm - product.heightMm;
  let heightExceeded = false;
  if (remainingHeightMm < 0) {
    heightExceeded = true;
    reasons.push(
      `Chiều cao sản phẩm (${product.heightMm}mm) chạm hoặc vượt trần khả dụng (${room.freeHeightMm}mm).`
    );
  } else if (remainingHeightMm < 100) {
    reasons.push(
      `Khoảng hở đỉnh đầu đến trần rất hẹp (${remainingHeightMm}mm), cần cẩn thận khi thao tác lắp ráp.`
    );
  }

  // 4. Check floor footprint & orientation (direct vs rotated 90°)
  const fitsDirect =
    product.widthMm <= room.freeWidthMm && product.depthMm <= room.freeDepthMm;
  const fitsRotated =
    product.depthMm <= room.freeWidthMm && product.widthMm <= room.freeDepthMm;

  let isRotated = false;
  let effectiveWidth = product.widthMm;
  let effectiveDepth = product.depthMm;
  let floorExceeded = false;

  if (fitsDirect) {
    effectiveWidth = product.widthMm;
    effectiveDepth = product.depthMm;
  } else if (fitsRotated) {
    isRotated = true;
    effectiveWidth = product.depthMm;
    effectiveDepth = product.widthMm;
    reasons.push(
      `Cần xoay ngang 90° để vừa với khoảng trống bề ngang (${room.freeWidthMm}mm khả dụng).`
    );
  } else {
    floorExceeded = true;
    reasons.push(
      `Kích thước đáy (${product.widthMm} x ${product.depthMm}mm) vượt quá khoảng trống sàn khả dụng (${room.freeWidthMm} x ${room.freeDepthMm}mm) kể cả khi xoay ngang.`
    );
  }

  const remainingWidthMm = Math.max(0, room.freeWidthMm - effectiveWidth);
  const remainingDepthMm = Math.max(0, room.freeDepthMm - effectiveDepth);
  const minClearanceWalkway = Math.min(remainingWidthMm, remainingDepthMm);

  // 5. Walkway clearance check (Standard small living guideline: >= 600mm)
  let tightWalkway = false;
  if (!floorExceeded) {
    if (minClearanceWalkway < 600) {
      tightWalkway = true;
      reasons.push(
        `Vừa vặn nhưng khoảng lưu thông lối đi còn lại dưới 600mm (${minClearanceWalkway}mm). Lưu ý cánh cửa mở hoặc di chuyển.`
      );
    } else {
      reasons.push(
        `Lối đi thông thoáng, khoảng trống còn lại tối thiểu ${minClearanceWalkway}mm (đạt chuẩn lưu thông >600mm).`
      );
    }
  }

  // 6. Floor occupancy %
  const productAreaM2 = (product.widthMm * product.depthMm) / 1_000_000;
  const totalRoomAreaM2 = (room.widthMm * room.depthMm) / 1_000_000;
  const freeAreaM2 = (room.freeWidthMm * room.freeDepthMm) / 1_000_000;

  const occupancyPercentage = Number(
    ((productAreaM2 / totalRoomAreaM2) * 100).toFixed(1)
  );
  const freeOccupancyPercentage = Number(
    ((productAreaM2 / freeAreaM2) * 100).toFixed(1)
  );

  // 7. Determine overall Status & Deterministic Score
  let status: SpaceFitStatus = "FIT";
  let statusLabel = "VỪA VẶN HOÀN TOÀN";
  let badgeVariant: "success" | "warning" | "destructive" | "neutral" = "success";
  let score = 95;

  if (noDrillConflict || heightExceeded || floorExceeded) {
    status = "DOES_NOT_FIT";
    statusLabel = "KHÔNG PHÙ HỢP";
    badgeVariant = "destructive";
    score = Math.max(0, 40 - (floorExceeded ? 20 : 0) - (heightExceeded ? 15 : 0) - (noDrillConflict ? 30 : 0));
  } else if (tightWalkway || isRotated) {
    status = "MAY_FIT";
    statusLabel = "CẦN LƯU Ý KÍCH THƯỚC";
    badgeVariant = "warning";
    score = 80 - (tightWalkway ? 15 : 0) - (isRotated ? 10 : 0);
  } else {
    status = "FIT";
    statusLabel = "VỪA VẶN HOÀN HẢO";
    badgeVariant = "success";
    score = Math.min(100, Math.max(85, Math.round(98 - occupancyPercentage * 0.5)));
  }

  return {
    status,
    statusLabel,
    badgeVariant,
    compatibilityScore: score,
    reasons,
    clearanceMm: {
      remainingWidthMm,
      remainingDepthMm,
      remainingHeightMm,
    },
    occupancyPercentage,
    freeOccupancyPercentage,
    isRotated,
    noDrillConflict,
    disclaimer: DISCLAIMER_TEXT,
  };
}

