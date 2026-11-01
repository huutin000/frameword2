import type { CatalogProduct } from "@/features/catalog/types";

export interface WishlistItem {
  productId: string;
  product: CatalogProduct;
  addedAt: string;
}

export interface WishlistContextValue {
  items: WishlistItem[];
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: CatalogProduct) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

