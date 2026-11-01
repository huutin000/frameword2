import { describe, it, expect, beforeEach } from "vitest";
import {
  getApprovedReviews,
  getProductRatingSummary,
  submitProductReview,
  moderateReview,
  sanitizeReviewText,
  resetReviewStoreToSeed,
} from "./data/review-store";

describe("Product Reviews & Moderation Suite (U039, A032, E003)", () => {
  beforeEach(() => {
    resetReviewStoreToSeed();
  });

  it("[U039] lists seeded approved reviews for product p1", () => {
    const list = getApprovedReviews("p1");
    expect(list.length).toBeGreaterThanOrEqual(2);
    expect(list.every((r) => r.productId === "p1" && r.status === "approved")).toBe(true);
  });

  it("[U039] calculates accurate rating summary", () => {
    const summary = getProductRatingSummary("p1");
    expect(summary.count).toBeGreaterThanOrEqual(2);
    expect(summary.average).toBeGreaterThanOrEqual(4);
    expect(summary.average).toBeLessThanOrEqual(5);
  });

  it("[E003] sanitizes malicious XSS scripts in reviews", () => {
    const maliciousPayload = "<script>alert('xss')</script>";
    const sanitized = sanitizeReviewText(maliciousPayload);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).toContain("&lt;script&gt;");
  });

  it("[U039 / A032] submits a new review with space fit context and supports moderation", () => {
    const res = submitProductReview({
      productId: "p2",
      userName: "Khách hàng Test",
      rating: 5,
      spaceType: "Phòng trọ 12m2",
      title: "Kê vừa khít gầm giường",
      comment: "Rất ưng ý, không trầy xước.",
    });

    expect(res.success).toBe(true);
    expect(res.review.id).toBeDefined();

    // Reject it
    const rej = moderateReview(res.review.id, "reject");
    expect(rej).toBe(true);

    const approvedList = getApprovedReviews("p2");
    expect(approvedList.some((r) => r.id === res.review.id)).toBe(false);

    // Re-approve it
    const app = moderateReview(res.review.id, "approve");
    expect(app).toBe(true);

    const approvedListAfter = getApprovedReviews("p2");
    expect(approvedListAfter.some((r) => r.id === res.review.id)).toBe(true);
  });
});
