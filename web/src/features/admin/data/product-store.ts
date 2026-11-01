import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";
import type { CatalogProduct } from "@/features/catalog/types";

export interface AdminProductRecord extends CatalogProduct {
  sku: string;
  weightCapacityKg?: number;
  material?: string;
  stockBalance: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory persistent admin product store
let ADMIN_PRODUCTS: AdminProductRecord[] = SAMPLE_PRODUCTS.map((p, idx) => ({
  ...p,
  sku: `SL-${p.id.toUpperCase()}-${idx + 101}`,
  weightCapacityKg: p.noDrill ? 25 : 60,
  material: p.noDrill ? "Thép carbon sơn tĩnh điện + Cao su hít chân không" : "Gỗ tự nhiên tiêu chuẩn E1",
  stockBalance: 15 + idx * 4,
  isPublished: true,
  createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - idx * 3600000).toISOString(),
}));

export function getAllAdminProducts(search?: string, category?: string): AdminProductRecord[] {
  let list = [...ADMIN_PRODUCTS];
  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.dimensions.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getAdminProductById(id: string): AdminProductRecord | undefined {
  return ADMIN_PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function createAdminProduct(data: Omit<AdminProductRecord, "id" | "createdAt" | "updatedAt">): AdminProductRecord {
  const newId = `p${ADMIN_PRODUCTS.length + 1}`;
  const now = new Date().toISOString();
  const newProduct: AdminProductRecord = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };
  ADMIN_PRODUCTS.unshift(newProduct);
  return newProduct;
}

export function updateAdminProduct(
  id: string,
  data: Partial<AdminProductRecord>
): AdminProductRecord | undefined {
  const idx = ADMIN_PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;

  ADMIN_PRODUCTS[idx] = {
    ...ADMIN_PRODUCTS[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return ADMIN_PRODUCTS[idx];
}

export function toggleAdminProductPublish(id: string): AdminProductRecord | undefined {
  const p = ADMIN_PRODUCTS.find((item) => item.id === id);
  if (!p) return undefined;
  p.isPublished = !p.isPublished;
  p.updatedAt = new Date().toISOString();
  return p;
}

export function deleteAdminProduct(id: string): boolean {
  const initialLen = ADMIN_PRODUCTS.length;
  ADMIN_PRODUCTS = ADMIN_PRODUCTS.filter((p) => p.id !== id);
  return ADMIN_PRODUCTS.length < initialLen;
}

