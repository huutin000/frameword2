/**
 * Format numerical amount into Vietnamese Dong (VND) currency string.
 * Uses integer arithmetic to avoid floating-point display inaccuracies.
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

