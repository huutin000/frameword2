import { describe, it, expect } from "vitest";
import {
  getAllCategories,
  wouldCreateCycle,
  updateCategory,
  deleteCategory,
} from "./data/category-store";

describe("[A005] Admin Category Hierarchy & Cyclic Prevention", () => {
  it("lists all seeded categories with valid parent-child relationships", () => {
    const cats = getAllCategories();
    expect(cats.length).toBeGreaterThanOrEqual(5);
    const subCat = cats.find((c) => c.parentId !== null);
    expect(subCat).toBeDefined();
  });

  it("detects and prevents direct self-cycle: category cannot be its own parent", () => {
    expect(wouldCreateCycle("cat-1", "cat-1")).toBe(true);
  });

  it("detects and blocks indirect cyclic hierarchy: A -> B -> A", () => {
    // cat-3 has parentId: 'cat-1'
    // Trying to make cat-1 have parentId: 'cat-3' would create a cycle cat-1 -> cat-3 -> cat-1
    expect(wouldCreateCycle("cat-1", "cat-3")).toBe(true);

    const updateRes = updateCategory("cat-1", { parentId: "cat-3" });
    expect(updateRes.success).toBe(false);
    expect(updateRes.error).toContain("vòng lặp vô hạn");
  });

  it("allows setting a valid non-cyclic parent", () => {
    // cat-2 has parentId: null. Setting cat-2 parentId to cat-1 is non-cyclic
    expect(wouldCreateCycle("cat-2", "cat-1")).toBe(false);

    const res = updateCategory("cat-2", { parentId: "cat-1" });
    expect(res.success).toBe(true);
    expect(res.category?.parentId).toBe("cat-1");

    // Reset back
    updateCategory("cat-2", { parentId: null });
  });

  it("prevents deleting a parent category that still has active children", () => {
    // cat-1 has child cat-3
    const res = deleteCategory("cat-1");
    expect(res.success).toBe(false);
    expect(res.error).toContain("đang chứa các danh mục con");
  });
});
