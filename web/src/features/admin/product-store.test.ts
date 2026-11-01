import { describe, it, expect } from "vitest";
import {
  getAllAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  toggleAdminProductPublish,
  deleteAdminProduct,
} from "./data/product-store";

describe("Admin Product Inventory Store", () => {
  it("[A003] lists all products with accurate initial inventory count", () => {
    const list = getAllAdminProducts();
    expect(list.length).toBeGreaterThanOrEqual(6);
    expect(list[0].widthMm).toBeGreaterThan(0);
    expect(list[0].depthMm).toBeGreaterThan(0);
  });

  it("[A004] creates a new product with mm dimensions and initial stock", () => {
    const newProduct = createAdminProduct({
      slug: "ke-treo-tuong-mini-300",
      title: "Kệ Treo Tường Mini Nhôm Đúc 300mm",
      category: "Kệ & Tủ đứng",
      roomType: "bedroom",
      roomTag: "Phòng ngủ",
      problem: "tight-space",
      problemTag: "Phòng hẹp dưới 15m²",
      dimensions: "300 × 150 × 200 mm",
      widthMm: 300,
      heightMm: 200,
      depthMm: 150,
      noDrill: true,
      priceVnd: 280000,
      imageUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800",
      fitScoreExplanation: "Dày 15cm tiết kiệm không gian",
      inStock: true,
      sku: "SL-TEST-300",
      stockBalance: 30,
      isPublished: true,
      weightCapacityKg: 10,
      material: "Nhôm đúc",
    });

    expect(newProduct.id).toBeDefined();
    expect(getAdminProductById(newProduct.id)).toBeDefined();
  });

  it("[A005] updates an existing product and toggles publish status", () => {
    const p1 = getAdminProductById("p1");
    expect(p1).toBeDefined();

    updateAdminProduct("p1", { priceVnd: 720000 });
    expect(getAdminProductById("p1")?.priceVnd).toBe(720000);

    const toggled = toggleAdminProductPublish("p1");
    expect(toggled?.isPublished).toBe(false);

    // Toggle back
    toggleAdminProductPublish("p1");
    expect(getAdminProductById("p1")?.isPublished).toBe(true);
  });

  it("deletes a product cleanly", () => {
    const toDelete = createAdminProduct({
      slug: "temp-delete-product",
      title: "Sản phẩm thử nghiệm xóa",
      category: "Bàn làm việc",
      roomType: "workspace",
      roomTag: "Góc làm việc",
      problem: "foldable",
      problemTag: "Gấp gọn",
      dimensions: "400 × 400 × 400 mm",
      widthMm: 400,
      heightMm: 400,
      depthMm: 400,
      noDrill: false,
      priceVnd: 100000,
      imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
      fitScoreExplanation: "Tạm",
      inStock: true,
      sku: "SL-DEL-01",
      stockBalance: 5,
      isPublished: true,
    });

    const deleted = deleteAdminProduct(toDelete.id);
    expect(deleted).toBe(true);
    expect(getAdminProductById(toDelete.id)).toBeUndefined();
  });
});

