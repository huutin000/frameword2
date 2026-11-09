import type { CatalogProduct } from "@/features/catalog/types";
import type { CartItem } from "../types";
import { MAX_CART_ITEM_QUANTITY, clampCartQuantity } from "./quantity";

type Row = Record<string, unknown>;

const isRow = (value: unknown): value is Row =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value !== "";

const stringOr = (value: unknown, fallback: string) =>
  typeof value === "string" ? value : fallback;

const finiteOr = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

/**
 * Validates untrusted cart data (e.g. parsed localStorage). Never throws.
 * Non-array -> []. Entries without usable id/productId/title/imageUrl/price are dropped,
 * known fields are copied explicitly, quantity is clamped, repeated line ids keep the first.
 */
export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const seenIds = new Set<string>();
  const result: CartItem[] = [];
  for (const entry of raw) {
    if (!isRow(entry)) continue;
    const { id, productId, title, imageUrl, priceVnd } = entry;
    if (
      !nonEmptyString(id) ||
      !nonEmptyString(productId) ||
      typeof title !== "string" ||
      !nonEmptyString(imageUrl) ||
      typeof priceVnd !== "number" ||
      !Number.isFinite(priceVnd) ||
      priceVnd < 0 ||
      seenIds.has(id)
    ) {
      continue;
    }
    seenIds.add(id);
    const item: CartItem = {
      id,
      productId,
      sku: stringOr(entry.sku, ""),
      title,
      category: stringOr(entry.category, ""),
      dimensions: stringOr(entry.dimensions, ""),
      widthMm: finiteOr(entry.widthMm, 0),
      heightMm: finiteOr(entry.heightMm, 0),
      depthMm: finiteOr(entry.depthMm, 0),
      noDrill: entry.noDrill === true,
      priceVnd,
      imageUrl,
      quantity: clampCartQuantity(entry.quantity),
      maxStock: MAX_CART_ITEM_QUANTITY,
    };
    if (typeof entry.variantId === "string") item.variantId = entry.variantId;
    result.push(item);
  }
  return result;
}

/**
 * Adds a product to the lines without mutating them. `added` is the number of units
 * really added after the per-line cap (0 when the line is already at the cap).
 * Only the first line with a matching productId is incremented.
 */
export function addCartLine(
  items: CartItem[],
  product: CatalogProduct,
  quantity: unknown
): { items: CartItem[]; added: number } {
  const addQty = clampCartQuantity(quantity);
  const index = items.findIndex((i) => i.productId === product.id);
  if (index >= 0) {
    const line = items[index];
    const next = clampCartQuantity(line.quantity + addQty);
    const nextItems = items.slice();
    nextItems[index] = { ...line, quantity: next };
    return { items: nextItems, added: Math.max(0, next - line.quantity) };
  }
  const newItem: CartItem = {
    id: `cart-${product.id}`,
    productId: product.id,
    sku: product.slug.toUpperCase(),
    title: product.title,
    category: product.category,
    dimensions: product.dimensions,
    widthMm: product.widthMm,
    heightMm: product.heightMm,
    depthMm: product.depthMm,
    noDrill: product.noDrill,
    priceVnd: product.priceVnd,
    imageUrl: product.imageUrl,
    quantity: addQty,
    maxStock: MAX_CART_ITEM_QUANTITY,
  };
  return { items: [...items, newItem], added: addQty };
}
