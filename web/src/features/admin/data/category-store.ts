export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  roomType: string;
  displayOrder: number;
  productCount: number;
  createdAt: string;
}

let CATEGORIES_REGISTRY: CategoryRecord[] = [
  {
    id: "cat-1",
    name: "Kệ & Tủ đứng",
    slug: "ke-tu-dung",
    parentId: null,
    description: "Các hệ kệ chống trần, kệ nhiều tầng tối ưu chiều cao căn hộ",
    roomType: "studio",
    displayOrder: 1,
    productCount: 14,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Bàn làm việc gấp gọn",
    slug: "ban-lam-viec",
    parentId: null,
    description: "Bàn piston thủy lực gấp sát tường, bàn góc chữ L nhỏ gọn",
    roomType: "workspace",
    displayOrder: 2,
    productCount: 8,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Kệ khe hẹp & Góc chết",
    slug: "ke-khe-hep",
    parentId: "cat-1", // Subcategory of Kệ & Tủ đứng
    description: "Tận dụng khe tủ lạnh, máy giặt từ 15cm",
    roomType: "kitchen",
    displayOrder: 3,
    productCount: 6,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Hộp & Khay lưu trữ gầm giường",
    slug: "hop-luu-tru",
    parentId: null,
    description: "Hộp có bánh xe trượt gầm giường, gầm sofa",
    roomType: "bedroom",
    displayOrder: 4,
    productCount: 11,
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Phụ kiện giặt phơi ban công",
    slug: "phu-kien-giat-phoi",
    parentId: null,
    description: "Giàn phơi xếp kẹp lan can không cần bắt vít",
    roomType: "balcony",
    displayOrder: 5,
    productCount: 5,
    createdAt: "2026-10-01T00:00:00Z",
  },
];

/**
 * Checks if setting `newParentId` for category `categoryId` would introduce a cycle.
 * Traverses up from `newParentId` towards root. If `categoryId` is encountered, it's a cycle!
 */
export function wouldCreateCycle(categoryId: string, newParentId: string | null): boolean {
  if (!newParentId) return false;
  if (categoryId === newParentId) return true;

  let currentParentId: string | null = newParentId;
  const visited = new Set<string>();

  while (currentParentId) {
    if (visited.has(currentParentId)) return true; // pre-existing cycle
    visited.add(currentParentId);

    if (currentParentId === categoryId) return true; // Cycle detected!

    const parentCat = CATEGORIES_REGISTRY.find((c) => c.id === currentParentId);
    currentParentId = parentCat ? parentCat.parentId : null;
  }

  return false;
}

export function getAllCategories(): CategoryRecord[] {
  return [...CATEGORIES_REGISTRY].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryById(id: string): CategoryRecord | undefined {
  return CATEGORIES_REGISTRY.find((c) => c.id === id || c.slug === id);
}

export function createCategory(
  data: Omit<CategoryRecord, "id" | "createdAt" | "productCount">
): { success: boolean; category?: CategoryRecord; error?: string } {
  if (data.parentId && wouldCreateCycle(`cat-${Date.now()}`, data.parentId)) {
    return { success: false, error: "Danh mục cha không hợp lệ (tạo vòng lặp đệ quy)" };
  }

  const newCat: CategoryRecord = {
    ...data,
    id: `cat-${CATEGORIES_REGISTRY.length + 1}`,
    productCount: 0,
    createdAt: new Date().toISOString(),
  };

  CATEGORIES_REGISTRY.push(newCat);
  return { success: true, category: newCat };
}

export function updateCategory(
  id: string,
  data: Partial<Omit<CategoryRecord, "id" | "createdAt">>
): { success: boolean; category?: CategoryRecord; error?: string } {
  const cat = CATEGORIES_REGISTRY.find((c) => c.id === id);
  if (!cat) return { success: false, error: "Không tìm thấy danh mục" };

  if (data.parentId !== undefined && data.parentId !== null) {
    if (wouldCreateCycle(id, data.parentId)) {
      return {
        success: false,
        error: "Không thể chọn danh mục này làm danh mục cha vì sẽ tạo vòng lặp vô hạn (Cyclic Hierarchy)",
      };
    }
  }

  Object.assign(cat, data);
  return { success: true, category: cat };
}

export function deleteCategory(id: string): { success: boolean; error?: string } {
  const hasChildren = CATEGORIES_REGISTRY.some((c) => c.parentId === id);
  if (hasChildren) {
    return {
      success: false,
      error: "Không thể xóa danh mục đang chứa các danh mục con. Hãy chuyển danh mục con trước.",
    };
  }

  CATEGORIES_REGISTRY = CATEGORIES_REGISTRY.filter((c) => c.id !== id);
  return { success: true };
}

