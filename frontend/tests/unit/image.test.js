import { describe, it, expect } from "vitest";
import { getImageUrl } from "../../lib/image";

describe("Image URL Helper (getImageUrl)", () => {
  it("should return fallback logo when image is null or empty", () => {
    expect(getImageUrl("")).toBe("/asset/image/logo-menu.png");
    expect(getImageUrl(null)).toBe("/asset/image/logo-menu.png");
    expect(getImageUrl(undefined)).toBe("/asset/image/logo-menu.png");
  });

  it("should return unchanged URL when image starts with http or https", () => {
    const url = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
    expect(getImageUrl(url)).toBe(url);

    const httpUrl = "http://example.com/phone.png";
    expect(getImageUrl(httpUrl)).toBe(httpUrl);
  });

  it("should construct Supabase storage URL or fallback for filename", () => {
    const filename = "phone1.png";
    const result = getImageUrl(filename);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

