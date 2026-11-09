import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "@/features/catalog/types";
import type { CartItem } from "./types";
import { addCartLine, sanitizeCartItems } from "./utils/cart-lines";

const V = {
  id: "cart-p1",
  productId: "p1",
  sku: "SKU-1",
  title: "T",
  category: "shelf",
  dimensions: "600x300",
  widthMm: 600,
  heightMm: 300,
  depthMm: 200,
  noDrill: true,
  priceVnd: 680000,
  imageUrl: "/a.jpg",
  quantity: 3,
  maxStock: 25,
};

const without = (key: string): Record<string, unknown> => {
  const copy: Record<string, unknown> = { ...V };
  delete copy[key];
  return copy;
};
const withField = (key: string, value: unknown) => ({ ...V, [key]: value });

const P = {
  id: "p1",
  slug: "kệ-tường",
  title: "Kệ tường",
  category: "shelf",
  dimensions: "600x300",
  widthMm: 600,
  heightMm: 300,
  depthMm: 200,
  noDrill: false,
  priceVnd: 680000,
  imageUrl: "/p1.jpg",
} as CatalogProduct;

const line = (productId: string, quantity: number, id = `cart-${productId}`): CartItem => ({
  ...V,
  id,
  productId,
  quantity,
});

describe("sanitizeCartItems", () => {
  it.each<[string, unknown]>([
    ["undefined", undefined],
    ["null", null],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["-Infinity", -Infinity],
    ["negative", -1],
    ["zero", 0],
    ["fraction", 1.5],
    ["numeric string", "7"],
    ["non-numeric string", "abc"],
    ["json-looking string", "[]"],
    ["empty object", {}],
    ["array-like object", { 0: V }],
    ["boolean", true],
    ["empty array", []],
  ])("non-array input %s -> []", (_name, raw) => {
    expect(sanitizeCartItems(raw)).toEqual([]);
  });

  it("drops null, undefined, primitive and array entries (no phantom line)", () => {
    expect(sanitizeCartItems([null, undefined, 1, "x", true, NaN, [], [V]])).toEqual([]);
  });

  it("keeps a valid entry unchanged, a valid entry among nulls survives", () => {
    expect(sanitizeCartItems([V])).toEqual([V]);
    expect(sanitizeCartItems([null, V, null])).toEqual([V]);
  });

  it.each<[string, unknown]>([
    ["id missing", without("id")],
    ["id empty", withField("id", "")],
    ["id number", withField("id", 123)],
    ["productId missing", without("productId")],
    ["productId empty", withField("productId", "")],
    ["title missing", without("title")],
    ["title number", withField("title", 5)],
    ["imageUrl missing", without("imageUrl")],
    ["imageUrl empty", withField("imageUrl", "")],
    ["price missing", without("priceVnd")],
    ["price string", withField("priceVnd", "680000")],
    ["price negative", withField("priceVnd", -1)],
    ["price NaN", withField("priceVnd", NaN)],
    ["price Infinity", withField("priceVnd", Infinity)],
    ["price null", withField("priceVnd", null)],
    ["only quantity", { quantity: 2 }],
  ])("drops entry: %s", (_name, entry) => {
    expect(sanitizeCartItems([entry])).toEqual([]);
  });

  it.each([0, 1.5])("keeps price %s", (price) => {
    expect(sanitizeCartItems([withField("priceVnd", price)])[0].priceVnd).toBe(price);
  });

  it("keeps entries that only lack optional fields", () => {
    const [item] = sanitizeCartItems([{ id: "a", productId: "p", title: "", imageUrl: "/x", priceVnd: 5 }]);
    expect(item).toMatchObject({ sku: "", category: "", widthMm: 0, noDrill: false, quantity: 1, maxStock: 25 });
    expect(item).not.toHaveProperty("variantId");
  });

  it.each<[string, unknown, number]>([
    ["undefined", undefined, 1],
    ["null", null, 1],
    ["NaN", NaN, 1],
    ["-Infinity", -Infinity, 1],
    ["-3", -3, 1],
    ["0", 0, 1],
    ["0.4", 0.4, 1],
    ["abc", "abc", 1],
    ["object", {}, 1],
    ["array", [], 1],
    ["2.9", 2.9, 2],
    ["'7'", "7", 7],
    ["24", 24, 24],
    ["25", 25, 25],
    ["26", 26, 25],
    ["1000", 1000, 25],
    ["Infinity", Infinity, 25],
  ])("quantity %s -> %d", (_name, quantity, expected) => {
    expect(sanitizeCartItems([withField("quantity", quantity)])[0].quantity).toBe(expected);
  });

  it("does not copy unknown keys, including an own __proto__ key", () => {
    const parsed = JSON.parse(
      JSON.stringify({ ...V }).replace("{", '{"isAdmin":true,"__proto__":{"polluted":1},')
    );
    expect(Object.keys(parsed)).toContain("__proto__");
    const [item] = sanitizeCartItems([parsed]);
    expect(Object.keys(item)).not.toContain("isAdmin");
    expect(Object.keys(item)).not.toContain("__proto__");
    expect(item).toEqual(V);
  });

  it("falls back to defaults for wrongly typed optional fields", () => {
    const [item] = sanitizeCartItems([
      { ...V, widthMm: "600", noDrill: "yes", sku: 9, maxStock: 999, variantId: 5 },
    ]);
    expect(item).toMatchObject({ widthMm: 0, noDrill: false, sku: "", maxStock: 25 });
    expect(item).not.toHaveProperty("variantId");
  });

  it("keeps a string variantId", () => {
    expect(sanitizeCartItems([withField("variantId", "v1")])[0].variantId).toBe("v1");
  });

  it("drops later entries repeating a line id, keeps duplicate productIds with distinct ids", () => {
    expect(sanitizeCartItems([{ ...V, quantity: 3 }, { ...V, quantity: 5 }])).toEqual([V]);
    const both = sanitizeCartItems([line("p1", 25, "a"), line("p1", 25, "b")]);
    expect(both.map((i) => i.id)).toEqual(["a", "b"]);
  });

  it("handles large arrays (length only)", () => {
    const valid = Array.from({ length: 100000 }, (_, i) => ({ ...V, id: `c${i}` }));
    expect(sanitizeCartItems(valid)).toHaveLength(100000);
    expect(sanitizeCartItems(new Array(100000).fill(null))).toEqual([]);
  });

  it("does not mutate input and is idempotent", () => {
    const input = [{ ...V, quantity: "99", extra: 1 }, null, { ...V }];
    const snapshot = JSON.parse(JSON.stringify(input));
    const once = sanitizeCartItems(input);
    expect(input).toEqual(snapshot);
    expect(sanitizeCartItems(once)).toEqual(once);
  });
});

describe("addCartLine", () => {
  it.each<[string, unknown, number]>([
    ["undefined", undefined, 1],
    ["null", null, 1],
    ["NaN", NaN, 1],
    ["-Infinity", -Infinity, 1],
    ["-3", -3, 1],
    ["0", 0, 1],
    ["0.4", 0.4, 1],
    ["abc", "abc", 1],
    ["object", {}, 1],
    ["empty array", [], 1],
    ["2.7", 2.7, 2],
    ["'7'", "7", 7],
    ["[5] (Number quirk)", [5], 5],
    ["1", 1, 1],
    ["25", 25, 25],
    ["26", 26, 25],
    ["Infinity", Infinity, 25],
  ])("empty cart, quantity %s -> added %d and line quantity equal", (_name, quantity, expected) => {
    const result = addCartLine([], P, quantity);
    expect(result.added).toBe(expected);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(expected);
  });

  it("builds the new line shape", () => {
    const [created] = addCartLine([], P, 2).items;
    expect(created).toEqual({
      id: "cart-p1",
      productId: "p1",
      sku: "KỆ-TƯỜNG",
      title: "Kệ tường",
      category: "shelf",
      dimensions: "600x300",
      widthMm: 600,
      heightMm: 300,
      depthMm: 200,
      noDrill: false,
      priceVnd: 680000,
      imageUrl: "/p1.jpg",
      quantity: 2,
      maxStock: 25,
    });
  });

  it.each<[number, unknown, number, number]>([
    [20, 10, 5, 25], // defect A: toast must say 5, not 10
    [24, 1, 1, 25],
    [25, 1, 0, 25],
    [1, Infinity, 24, 25],
    [25, 25, 0, 25],
    [3, 4, 4, 7],
    [30, 1, 0, 25], // tampered line (bypassed sanitizer): never negative
  ])("existing %d + %s -> added %d, line %d", (existing, quantity, added, lineQty) => {
    const result = addCartLine([line("p1", existing)], P, quantity);
    expect(result.added).toBe(added);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(lineQty);
  });

  it("appends next to other products and keeps their references", () => {
    const other = line("p2", 4);
    const result = addCartLine([other], P, 3);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toBe(other);
    expect(result.items[1]).toMatchObject({ productId: "p1", quantity: 3 });
    expect(result.added).toBe(3);
  });

  it("increments only the first line of a duplicated productId", () => {
    const a = line("p1", 10, "A");
    const b = line("p1", 20, "B");
    const other = line("p2", 2);
    const result = addCartLine([a, b, other], P, 10);
    expect(result.added).toBe(10);
    expect(result.items.map((i) => i.quantity)).toEqual([20, 20, 2]);
    expect(result.items[1]).toBe(b);
    expect(result.items[2]).toBe(other);
  });

  it("does not mutate the input", () => {
    const input = [line("p1", 20)];
    const snapshot = JSON.parse(JSON.stringify(input));
    addCartLine(input, P, 10);
    expect(input).toEqual(snapshot);
  });

  it("added always equals the real change of total units (seeded random)", () => {
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const adds = [undefined, NaN, 0, -3, 0.5, 1, 7, 24, 25, 26, 1000, Infinity, "abc", "9"];
    for (let n = 0; n < 300; n++) {
      const items = ["p1", "p2", "p3"]
        .filter(() => rnd() < 0.6)
        .map((pid) => line(pid, 1 + Math.floor(rnd() * 25)));
      const before = items.reduce((s, i) => s + i.quantity, 0);
      const { items: after, added } = addCartLine(items, P, adds[Math.floor(rnd() * adds.length)]);
      expect(after.reduce((s, i) => s + i.quantity, 0) - before).toBe(added);
      expect(after.every((i) => i.quantity >= 1 && i.quantity <= 25)).toBe(true);
    }
  });
});
