export const MAX_ORDER_CODE_ATTEMPTS = 5;

const defaultSuffix = (): string => crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

/**
 * Builds a unique order code (`SL-2026-` + 8 uppercase hex) and its id (`ord-` + lowercase code).
 * `isTaken` is probed with each candidate; after MAX_ORDER_CODE_ATTEMPTS taken candidates it throws.
 */
export function createOrderIdentifiers(
  isTaken: (orderCode: string, orderId: string) => boolean,
  nextSuffix: () => string = defaultSuffix
): { orderCode: string; orderId: string } {
  for (let attempt = 0; attempt < MAX_ORDER_CODE_ATTEMPTS; attempt++) {
    const orderCode = `SL-2026-${nextSuffix()}`;
    const orderId = `ord-${orderCode.toLowerCase()}`;
    if (!isTaken(orderCode, orderId)) return { orderCode, orderId };
  }
  throw new Error("order code space exhausted");
}
