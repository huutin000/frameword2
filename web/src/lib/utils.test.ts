import { describe, it, expect } from "vitest";
import { formatVND, formatDimensions, cn } from "./utils";

describe("Utils & Formatter Suite", () => {
  it("should format currency in VND correctly", () => {
    const formatted = formatVND(680000);
    expect(formatted).toContain("680.000");
  });

  it("should format dimensions string in mm", () => {
    const formatted = formatDimensions(2600, 600, 280);
    expect(formatted).toBe("600 × 280 × 2600 mm");
  });

  it("should handle missing dimensions gracefully", () => {
    const formatted = formatDimensions(null, null, null);
    expect(formatted).toBe("Chưa có kích thước");
  });

  it("should merge tailwind classes properly using cn", () => {
    const result = cn("p-4 text-sm", "p-6 font-bold");
    expect(result).toBe("text-sm p-6 font-bold");
  });
});

