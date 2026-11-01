import type { CatalogProduct } from "@/features/catalog/types";

export interface CompareProductItem extends CatalogProduct {
  weightCapacityKg?: number;
  material?: string;
}

export interface CompareContextValue {
  items: CompareProductItem[];
  isHydrated: boolean;
  isInCompare: (productId: string) => boolean;
  addToCompare: (product: CatalogProduct) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  compareCount: number;
  maxItems: number;
}

