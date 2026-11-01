import { describe, it, expect } from "vitest";
import { paginateItems, getPageNumbers } from "./utils/pagination";

describe("U009: Pagination and Load-More Integrity", () => {
  const dummyItems = Array.from({ length: 25 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
  }));

  it("paginates without duplicates or skipped items across all pages", () => {
    const pageSize = 6;
    const collectedItems: typeof dummyItems = [];
    const totalPages = Math.ceil(dummyItems.length / pageSize);

    for (let p = 1; p <= totalPages; p++) {
      const result = paginateItems(dummyItems, p, pageSize);
      expect(result.currentPage).toBe(p);
      expect(result.items.length).toBeLessThanOrEqual(pageSize);

      // Verify no item on current page has already been collected
      for (const item of result.items) {
        expect(collectedItems.some((c) => c.id === item.id)).toBe(false);
        collectedItems.push(item);
      }
    }

    // Verify all 25 items collected with zero omissions
    expect(collectedItems.length).toBe(dummyItems.length);
    expect(collectedItems.map((x) => x.id)).toEqual(dummyItems.map((x) => x.id));
  });

  it("handles out-of-bound pages gracefully", () => {
    // Page 0 should normalize to page 1
    const pZero = paginateItems(dummyItems, 0, 10);
    expect(pZero.currentPage).toBe(1);
    expect(pZero.items[0].id).toBe("item-1");

    // Negative page should normalize to page 1
    const pNeg = paginateItems(dummyItems, -5, 10);
    expect(pNeg.currentPage).toBe(1);

    // Page > totalPages should normalize to the last page
    const pOverflow = paginateItems(dummyItems, 999, 10);
    expect(pOverflow.currentPage).toBe(3);
    expect(pOverflow.items.length).toBe(5);
  });

  it("handles empty arrays without crashing", () => {
    const result = paginateItems([], 1, 10);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([]);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(false);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(0);
  });

  it("correctly computes navigation state flags", () => {
    const page1 = paginateItems(dummyItems, 1, 10);
    expect(page1.hasPrevPage).toBe(false);
    expect(page1.hasNextPage).toBe(true);

    const page2 = paginateItems(dummyItems, 2, 10);
    expect(page2.hasPrevPage).toBe(true);
    expect(page2.hasNextPage).toBe(true);

    const page3 = paginateItems(dummyItems, 3, 10);
    expect(page3.hasPrevPage).toBe(true);
    expect(page3.hasNextPage).toBe(false);
  });

  it("generates clean responsive page numbers with ellipsis for large datasets", () => {
    // 5 pages or fewer -> no ellipsis
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);

    // 42 pages (250 products / 6 per page):
    // Near start (page 1)
    const p1 = getPageNumbers(1, 42);
    expect(p1[0]).toBe(1);
    expect(p1.includes("ellipsis")).toBe(true);
    expect(p1[p1.length - 1]).toBe(42);

    // In middle (page 20)
    const p20 = getPageNumbers(20, 42);
    expect(p20[0]).toBe(1);
    expect(p20[1]).toBe("ellipsis");
    expect(p20.includes(20)).toBe(true);
    expect(p20[p20.length - 2]).toBe("ellipsis");
    expect(p20[p20.length - 1]).toBe(42);

    // Near end (page 42)
    const p42 = getPageNumbers(42, 42);
    expect(p42[0]).toBe(1);
    expect(p42.includes("ellipsis")).toBe(true);
    expect(p42[p42.length - 1]).toBe(42);
  });
});

