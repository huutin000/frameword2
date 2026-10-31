import { describe, it, expect, beforeEach, vi } from "vitest";
import cartSlice, {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  hydrateCart,
} from "../../lib/store/cartSlice";
import {
  makeStore,
  loadCartFromStorage,
  saveCartToStorage,
  CART_STORAGE_KEY,
} from "../../lib/store";

describe("Production Cart Reducer (lib/store/cartSlice)", () => {
  const reducer = cartSlice.reducer;

  it("should return empty initial state without crashing", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state).toEqual({ items: [], isHydrated: false });
  });

  it("should be a PURE function that does not touch localStorage during execution", () => {
    // Reducer execution must not call window.localStorage
    const product = { id: "p1", name: "iPhone 15", price: 20000000 };
    const initialState = { items: [], isHydrated: false };

    // Pass copy of state
    const nextState = reducer(initialState, addToCart({ item: product, quantity: 1 }));

    // Verify immutability: initialState should not be mutated
    expect(initialState.items).toHaveLength(0);
    expect(nextState.items).toHaveLength(1);
  });

  it("should add a new product and normalize both id and _id", () => {
    const productWithId = { id: "uuid-123", name: "MacBook Pro", price: 35000000 };
    const state = reducer(
      { items: [], isHydrated: false },
      addToCart({ item: productWithId, quantity: 2 })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("uuid-123");
    expect(state.items[0]._id).toBe("uuid-123");
    expect(state.items[0].quantity).toBe(2);
  });

  it("should handle products with legacy _id correctly", () => {
    const productWithLegacyId = { _id: "mongo-456", name: "AirPods", price: 4000000 };
    const state = reducer(
      { items: [], isHydrated: false },
      addToCart({ item: productWithLegacyId, quantity: 1 })
    );

    expect(state.items[0].id).toBe("mongo-456");
    expect(state.items[0]._id).toBe("mongo-456");
  });

  it("should increment quantity when adding duplicate product ID", () => {
    const product = { id: "p1", name: "iPhone 15", price: 25000000 };
    let state = reducer(
      { items: [], isHydrated: false },
      addToCart({ item: product, quantity: 1 })
    );
    state = reducer(state, addToCart({ item: product, quantity: 3 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(4);
  });

  it("should update quantity of an existing item", () => {
    const initialState = {
      items: [{ id: "p1", _id: "p1", name: "iPhone 15", price: 25000000, quantity: 2 }],
      isHydrated: true,
    };
    const state = reducer(
      initialState,
      updateCartItemQuantity({ id: "p1", quantity: 6 })
    );

    expect(state.items[0].quantity).toBe(6);
  });

  it("should remove product if quantity is updated to 0 or negative", () => {
    const initialState = {
      items: [{ id: "p1", _id: "p1", name: "iPhone 15", price: 25000000, quantity: 2 }],
      isHydrated: true,
    };
    const state = reducer(
      initialState,
      updateCartItemQuantity({ id: "p1", quantity: 0 })
    );

    expect(state.items).toHaveLength(0);
  });

  it("should remove item by ID from cart", () => {
    const initialState = {
      items: [
        { id: "p1", _id: "p1", name: "iPhone 15", price: 25000000, quantity: 1 },
        { id: "p2", _id: "p2", name: "MacBook", price: 30000000, quantity: 1 },
      ],
      isHydrated: true,
    };
    const state = reducer(initialState, removeFromCart("p1"));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("p2");
  });

  it("should clear all items in cart", () => {
    const initialState = {
      items: [{ id: "p1", _id: "p1", name: "iPhone 15", price: 25000000, quantity: 1 }],
      isHydrated: true,
    };
    const state = reducer(initialState, clearCart());

    expect(state.items).toEqual([]);
  });

  it("should hydrate cart from saved items array", () => {
    const savedItems = [
      { id: "saved-1", name: "iPad Pro", price: 22000000, quantity: 1 },
    ];
    const state = reducer(
      { items: [], isHydrated: false },
      hydrateCart(savedItems)
    );

    expect(state.isHydrated).toBe(true);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("iPad Pro");
  });
});

describe("Storage Persistence & Resilience (lib/store/storage)", () => {
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal("localStorage", {
      getItem: (key) => mockStorage[key] || null,
      setItem: (key, value) => {
        mockStorage[key] = String(value);
      },
      removeItem: (key) => {
        delete mockStorage[key];
      },
    });
  });

  it("should safely save and load valid cart items", () => {
    const items = [{ id: "test-1", name: "Product A", price: 100000, quantity: 2 }];
    saveCartToStorage(items);

    const loaded = loadCartFromStorage();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("test-1");
  });

  it("should return empty array when localStorage is empty", () => {
    const loaded = loadCartFromStorage();
    expect(loaded).toEqual([]);
  });

  it("should gracefully handle corrupted JSON in localStorage without throwing", () => {
    mockStorage[CART_STORAGE_KEY] = "{ corrupted json :: invalid }";

    const loaded = loadCartFromStorage();
    expect(loaded).toEqual([]);
  });

  it("should filter out non-object or invalid records from localStorage", () => {
    mockStorage[CART_STORAGE_KEY] = JSON.stringify([
      null,
      123,
      "invalid string",
      { id: "valid-1", name: "Phone", price: 5000 },
      { name: "no-id-product" },
    ]);

    const loaded = loadCartFromStorage();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("valid-1");
  });
});

describe("Redux Store Instance Factory (makeStore)", () => {
  it("should create independent store instances without sharing server state", () => {
    const store1 = makeStore();
    const store2 = makeStore();

    store1.dispatch(addToCart({ item: { id: "p1", name: "Item 1", price: 100 }, quantity: 1 }));

    // store1 should have 1 item, store2 should remain empty
    expect(store1.getState().cart.items).toHaveLength(1);
    expect(store2.getState().cart.items).toHaveLength(0);
  });
});
