"use client";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, loadCartFromStorage, hydrateCart } from "./index";

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Đọc giỏ hàng từ localStorage sau khi mount ở Client (tránh Hydration error trong SSR)
    const saved = loadCartFromStorage();
    if (storeRef.current) {
      storeRef.current.dispatch(hydrateCart(saved || []));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
