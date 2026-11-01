"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartItem, CartSummary, PromoCodeDiscount } from "../types";
import type { CatalogProduct } from "@/features/catalog/types";

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  summary: CartSummary;
  promoCode: PromoCodeDiscount | null;
  promoError: string | null;
  addItem: (product: CatalogProduct, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CART_STORAGE_KEY = "small_living_cart_v1";
const emptySubscribe = () => () => {};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Safe hydration check via useSyncExternalStore (React 19 compliant)
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [promoCode, setPromoCode] = useState<PromoCodeDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Persist to LocalStorage on updates (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // LocalStorage write fail protection
    }
  }, [items, isHydrated]);

  // 3. Computed Cart Summary
  const summary: CartSummary = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalVnd = items.reduce(
      (sum, item) => sum + item.priceVnd * item.quantity,
      0
    );

    let discountVnd = 0;
    if (promoCode && subtotalVnd > 0) {
      discountVnd = Math.min(
        Math.floor((subtotalVnd * promoCode.percent) / 100),
        promoCode.maxDiscountVnd
      );
    }

    // Shipping demo policy: Free >= 1,000,000 VND, else 35,000 VND. 0 VND when cart is empty.
    const shippingVnd = subtotalVnd === 0 ? 0 : subtotalVnd >= 1000000 ? 0 : 35000;
    const totalVnd = Math.max(0, subtotalVnd - discountVnd + shippingVnd);

    return {
      itemCount,
      subtotalVnd,
      discountVnd,
      shippingVnd,
      totalVnd,
      promoCode: promoCode ? { ...promoCode, appliedDiscountVnd: discountVnd } : null,
    };
  }, [items, promoCode]);

  // 4. Cart Operations
  const addItem = (product: CatalogProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      const newItem: CartItem = {
        id: `cart-${product.id}`,
        productId: product.id,
        sku: product.slug.toUpperCase(),
        title: product.title,
        category: product.category,
        dimensions: product.dimensions,
        widthMm: product.widthMm,
        heightMm: product.heightMm,
        depthMm: product.depthMm,
        noDrill: product.noDrill,
        priceVnd: product.priceVnd,
        imageUrl: product.imageUrl,
        quantity,
        maxStock: 25,
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setPromoError(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "SMALL2026") {
      setPromoCode({
        code: "SMALL2026",
        percent: 10,
        maxDiscountVnd: 500000,
        appliedDiscountVnd: 0,
      });
      setPromoError(null);
      return true;
    } else {
      setPromoError("Mã giảm giá không hợp lệ hoặc đã hết hạn (Thử: SMALL2026)");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setPromoError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        summary,
        promoCode,
        promoError,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
