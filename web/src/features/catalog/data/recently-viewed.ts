import { useSyncExternalStore } from "react";
import { SAMPLE_PRODUCTS } from "./mock-products";
import type { CatalogProduct } from "../types";

const RECENTLY_VIEWED_KEY = "small_living_recently_viewed_v1";
const MAX_RECENT_ITEMS = 6;

let recentIds: string[] = [];
let cachedProducts: CatalogProduct[] = [];
const EMPTY_SNAPSHOT: CatalogProduct[] = [];
const listeners = new Set<() => void>();

function updateCachedProducts() {
  cachedProducts = recentIds
    .map((id) => SAMPLE_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is CatalogProduct => Boolean(p));
}

function notify() {
  updateCachedProducts();
  listeners.forEach((l) => l());
}

function initRecent() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (raw) {
      recentIds = JSON.parse(raw);
    }
  } catch {
    recentIds = [];
  }
  updateCachedProducts();
}

if (typeof window !== "undefined") {
  initRecent();
}

export function recordRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") return;
  // Deduplicate and move to front
  recentIds = [productId, ...recentIds.filter((id) => id !== productId)].slice(0, MAX_RECENT_ITEMS);
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentIds));
  } catch {
    // Ignore storage quota
  }
  notify();
}

export function getRecentlyViewedProducts(): CatalogProduct[] {
  return cachedProducts;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useRecentlyViewed() {
  const products = useSyncExternalStore(
    subscribe,
    getRecentlyViewedProducts,
    () => EMPTY_SNAPSHOT // Stable server snapshot
  );

  return {
    recentlyViewed: products,
    recordView: recordRecentlyViewed,
  };
}

