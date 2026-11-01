/**
 * Standard spatial measurement formatters for Small Living.
 * Source of truth dimensions are always in millimeters (mm).
 */

export function formatDimensions(
  heightMm?: number | null,
  widthMm?: number | null,
  depthMm?: number | null
): string {
  if (!heightMm && !widthMm && !depthMm) return "Chưa có kích thước";
  return `${widthMm ?? "?"} × ${depthMm ?? "?"} × ${heightMm ?? "?"} mm`;
}

export function mmToMeters(mm: number): number {
  return Number((mm / 1000).toFixed(2));
}

export function calculateAreaM2(widthMm: number, depthMm: number): number {
  return Number(((widthMm * depthMm) / 1_000_000).toFixed(2));
}

