"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { CatalogProduct } from "@/features/catalog/types";
import type { CompareProductItem, CompareContextValue } from "../types";

const COMPARE_STORAGE_KEY = "small_living_compare_v1";
const MAX_COMPARE_ITEMS = 4;
const emptySubscribe = () => () => {};

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [items, setItems] = useState<CompareProductItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, isHydrated]);

  const isInCompare = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const addToCompare = (product: CatalogProduct): boolean => {
    if (items.some((item) => item.id === product.id)) return true;
    if (items.length >= MAX_COMPARE_ITEMS) {
      alert(`Bạn chỉ có thể so sánh tối đa ${MAX_COMPARE_ITEMS} sản phẩm cùng lúc`);
      return false;
    }
    setItems((prev) => [
      ...prev,
      {
        ...product,
        weightCapacityKg: product.noDrill ? 25 : 50,
        material: product.noDrill
          ? "Thép sơn tĩnh điện + Cao su hít"
          : "Gỗ tự nhiên tiêu chuẩn E1",
      },
    ]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        isHydrated,
        isInCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        compareCount: items.length,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

