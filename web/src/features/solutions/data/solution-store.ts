import type { SolutionBundle, SolutionItem, BundlePricingSummary } from "../types";

export const CURATED_TEMPLATES: SolutionBundle[] = [
  {
    id: "bundle-phong-tro-12m",
    slug: "combo-phong-tro-12m",
    title: "Combo Phòng Trọ 12m² Tinh Gọn Không Khoan",
    subtitle: "Trọn bộ 3 món nội thất gấp gọn tối ưu hóa lối đi cho căn hộ mini và phòng trọ.",
    goal: "phong_thue_khong_khoan",
    roomType: "studio",
    description:
      "Thiết kế đặc quyền dành riêng cho khách thuê nhà: Bàn gấp gọn gắn bản lề không đục tường, Kệ 5 tầng khung thép chịu lực 80kg và Giường có ngăn kéo ngầm. Tiết kiệm ngay 10% khi mua nguyên combo.",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    comboDiscountPercent: 10,
    isTemplate: true,
    isPublished: true,
    authorRole: "admin",
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    items: [
      {
        productId: "p1",
        title: "Bàn Làm Việc Gấp Gọn Treo Tường",
        variantSku: "P1-WHITE",
        variantName: "Trắng Bắc Âu",
        priceVnd: 890000,
        imageUrl:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
        widthMm: 600,
        depthMm: 400,
        heightMm: 150,
        noDrill: true,
        quantity: 1,
        isRequired: true,
        selected: true,
      },
      {
        productId: "p2",
        title: "Kệ Sách Đa Năng 5 Tầng Khung Thép",
        variantSku: "P2-OAK",
        variantName: "Gỗ Sồi Tự Nhiên",
        priceVnd: 1250000,
        imageUrl:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        widthMm: 600,
        depthMm: 280,
        heightMm: 1500,
        noDrill: true,
        quantity: 1,
        isRequired: false,
        selected: true,
      },
      {
        productId: "p3",
        title: "Giường Đơn Có Ngăn Kéo Thông Minh",
        variantSku: "P3-STD",
        variantName: "Gỗ Công Nghiệp An Cường",
        priceVnd: 3450000,
        imageUrl:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        widthMm: 1200,
        depthMm: 2000,
        heightMm: 800,
        noDrill: true,
        quantity: 1,
        isRequired: false,
        selected: true,
      },
    ],
  },
  {
    id: "bundle-goc-lam-viec-mini",
    slug: "combo-goc-lam-viec-mini",
    title: "Combo Góc Làm Việc 0.8m² Tối Giản",
    subtitle: "Biến khoảng tường hẹp 90cm thành không gian làm việc công thái học tập trung cao độ.",
    goal: "goc_lam_viec",
    roomType: "workspace_corner",
    description:
      "Tận dụng tối đa khoảng trống góc phòng với bàn làm việc gấp áp tường và kệ đứng tầng cao. Giải phóng hoàn toàn mặt sàn khi kết thúc giờ làm việc.",
    imageUrl:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    comboDiscountPercent: 10,
    isTemplate: true,
    isPublished: true,
    authorRole: "admin",
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    items: [
      {
        productId: "p1",
        title: "Bàn Làm Việc Gấp Gọn Treo Tường",
        variantSku: "P1-WHITE",
        variantName: "Trắng Bắc Âu",
        priceVnd: 890000,
        imageUrl:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
        widthMm: 600,
        depthMm: 400,
        heightMm: 150,
        noDrill: true,
        quantity: 1,
        isRequired: true,
        selected: true,
      },
      {
        productId: "p2",
        title: "Kệ Sách Đa Năng 5 Tầng Khung Thép",
        variantSku: "P2-OAK",
        variantName: "Gỗ Sồi Tự Nhiên",
        priceVnd: 1250000,
        imageUrl:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        widthMm: 600,
        depthMm: 280,
        heightMm: 1500,
        noDrill: true,
        quantity: 1,
        isRequired: false,
        selected: true,
      },
    ],
  },
  {
    id: "bundle-bep-gon-khong-khoan",
    slug: "combo-bep-gon-khong-khoan",
    title: "Combo Bếp Gọn Gàng Hít Tủ Lạnh & Bàn Ăn Gấp",
    subtitle: "Giải pháp lưu trữ gia vị và khu vực ăn uống thông minh cho căn hộ studio.",
    goal: "bep_gon",
    roomType: "kitchen_corner",
    description:
      "Tối ưu hóa không gian phòng ăn và bếp nấu: Kệ gia vị hít nam châm gắn mặt bên tủ lạnh chịu lực 5kg kết hợp cùng Bàn ăn thông minh kéo dài 4-6 người khi có khách.",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    comboDiscountPercent: 10,
    isTemplate: true,
    isPublished: true,
    authorRole: "admin",
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    items: [
      {
        productId: "p6",
        title: "Kệ Gia Vị Bếp Hít Nam Châm Cực Mạnh",
        variantSku: "P6-BLACK",
        variantName: "Đen Nhám Thép Carbon",
        priceVnd: 240000,
        imageUrl:
          "https://images.unsplash.com/photo-1584990347449-399c68097d62?auto=format&fit=crop&w=800&q=80",
        widthMm: 300,
        depthMm: 120,
        heightMm: 100,
        noDrill: true,
        quantity: 2,
        isRequired: false,
        selected: true,
      },
      {
        productId: "p5",
        title: "Bàn Ăn Thông Minh Mở Rộng 4-6 Người",
        variantSku: "P5-NATURAL",
        variantName: "Gỗ Tự Nhiên Chống Nước",
        priceVnd: 1950000,
        imageUrl:
          "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
        widthMm: 800,
        depthMm: 800,
        heightMm: 750,
        noDrill: true,
        quantity: 1,
        isRequired: true,
        selected: true,
      },
    ],
  },
  {
    id: "bundle-luu-tru-thong-minh",
    slug: "combo-luu-tru-phong-ngu",
    title: "Combo Lưu Trữ Phòng Ngủ Dưới 10m²",
    subtitle: "Kết hợp tủ áo cánh lùa và giường thông minh giải phóng 60% mặt sàn phòng ngủ.",
    goal: "luu_tru",
    roomType: "bedroom",
    description:
      "Tủ quần áo cánh lùa mặt gương soi giúp nhân đôi cảm giác không gian mà không cản trở lối đi, kết hợp cùng giường đơn có ngăn kéo lưu trữ chăn ga gối đệm ngầm.",
    imageUrl:
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80",
    comboDiscountPercent: 10,
    isTemplate: true,
    isPublished: true,
    authorRole: "admin",
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    items: [
      {
        productId: "p4",
        title: "Tủ Quần Áo Cánh Lùa Gương Soi",
        variantSku: "P4-MIRROR",
        variantName: "Trắng Gương Tráng Bạc",
        priceVnd: 2890000,
        imageUrl:
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        widthMm: 1000,
        depthMm: 550,
        heightMm: 2000,
        noDrill: true,
        quantity: 1,
        isRequired: true,
        selected: true,
      },
      {
        productId: "p3",
        title: "Giường Đơn Có Ngăn Kéo Thông Minh",
        variantSku: "P3-STD",
        variantName: "Gỗ Công Nghiệp An Cường",
        priceVnd: 3450000,
        imageUrl:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        widthMm: 1200,
        depthMm: 2000,
        heightMm: 800,
        noDrill: true,
        quantity: 1,
        isRequired: false,
        selected: true,
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "small_living_custom_solutions_v1";

export function calculateBundlePricing(
  items: SolutionItem[],
  comboDiscountPercent: number
): BundlePricingSummary {
  const selectedItems = items.filter((it) => it.selected);

  const originalTotalVnd = selectedItems.reduce(
    (sum, item) => sum + item.priceVnd * item.quantity,
    0
  );

  // Discount applies if 2 or more distinct products are selected
  const discountApplies = selectedItems.length >= 2;
  const discountVnd = discountApplies
    ? Math.round(originalTotalVnd * (comboDiscountPercent / 100))
    : 0;

  const finalTotalVnd = originalTotalVnd - discountVnd;

  const totalFloorAreaM2 = selectedItems.reduce(
    (sum, item) => sum + ((item.widthMm * item.depthMm) / 1_000_000) * item.quantity,
    0
  );

  const allNoDrill = selectedItems.every((item) => item.noDrill);

  return {
    originalTotalVnd,
    discountVnd,
    finalTotalVnd,
    selectedCount: selectedItems.length,
    totalFloorAreaM2: Number(totalFloorAreaM2.toFixed(2)),
    allNoDrill,
  };
}

export function getAllCuratedTemplates(): SolutionBundle[] {
  return CURATED_TEMPLATES;
}

export function getTemplateBySlug(slug: string): SolutionBundle | undefined {
  return CURATED_TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplateById(id: string): SolutionBundle | undefined {
  return CURATED_TEMPLATES.find((t) => t.id === id);
}

export function getSavedSolutions(): SolutionBundle[] {
  if (typeof window === "undefined") return CURATED_TEMPLATES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return CURATED_TEMPLATES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return [...CURATED_TEMPLATES, ...parsed];
    }
  } catch {
    // fallback
  }
  return CURATED_TEMPLATES;
}

export function saveUserCustomSolution(solution: SolutionBundle): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: SolutionBundle[] = raw ? JSON.parse(raw) : [];
    const updated = [solution, ...existing.filter((s) => s.id !== solution.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
}
