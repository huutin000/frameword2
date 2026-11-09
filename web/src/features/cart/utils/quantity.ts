export const MAX_CART_ITEM_QUANTITY = 25;

/** Integer in [1, MAX_CART_ITEM_QUANTITY]. Non-numeric/NaN -> 1, fractions truncated, +Infinity -> MAX. */
export function clampCartQuantity(quantity: unknown): number {
  const value = Number(quantity);
  if (Number.isNaN(value)) return 1;
  return Math.min(MAX_CART_ITEM_QUANTITY, Math.max(1, Math.trunc(value)));
}
