import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import cartSlice, {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  hydrateCart,
} from "./cartSlice";

export const CART_STORAGE_KEY = "cartItems";

/**
 * Trả về Storage API an toàn trên cả Browser và môi trường test/SSR
 */
function getStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== "undefined") {
    return localStorage;
  }
  return null;
}

/**
 * Đọc dữ liệu giỏ hàng an toàn từ localStorage với phòng vệ JSON lỗi
 */
export function loadCartFromStorage() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => item && typeof item === "object" && (item.id || item._id)
      );
    }
    return [];
  } catch (error) {
    console.warn("Lỗi khi đọc giỏ hàng từ localStorage:", error);
    return [];
  }
}

/**
 * Lưu dữ liệu giỏ hàng an toàn vào localStorage
 */
export function saveCartToStorage(items) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Lỗi khi lưu giỏ hàng vào localStorage:", error);
  }
}

/**
 * Tạo Store Redux mới (hỗ trợ Next.js App Router tránh global singleton trên Server)
 */
export function makeStore(preloadedState) {
  const listenerMiddleware = createListenerMiddleware();

  // Đồng bộ localStorage an toàn thông qua middleware thay vì side-effect trong reducer
  listenerMiddleware.startListening({
    matcher: isAnyOf(addToCart, removeFromCart, updateCartItemQuantity, clearCart),
    effect: (action, listenerApi) => {
      const state = listenerApi.getState();
      // Ngăn ngừa ghi đè giỏ hàng rỗng khi chưa hoàn tất hydration
      if (state.cart && state.cart.isHydrated) {
        saveCartToStorage(state.cart.items);
      }
    },
  });

  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });
}

// Fallback store tiện ích cho Client / Tests
export const store = makeStore();

// Re-export actions & helpers
export {
  cartSlice,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  hydrateCart,
};
