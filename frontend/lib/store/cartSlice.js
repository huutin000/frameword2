import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isHydrated: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload.map((item) => {
          const id = item.id || item._id;
          return {
            ...item,
            id,
            _id: id,
            quantity: Math.max(1, Number(item.quantity) || 1),
          };
        });
      }
      state.isHydrated = true;
    },
    addToCart: (state, action) => {
      state.isHydrated = true;
      const { item, quantity = 1 } = action.payload || {};
      if (!item) return;

      const itemId = item.id || item._id;
      if (!itemId) return;

      const qtyToAdd = Math.max(1, Number(quantity) || 1);
      const existing = state.items.find((i) => (i.id || i._id) === itemId);

      if (existing) {
        existing.quantity = Number(existing.quantity) + qtyToAdd;
      } else {
        state.items.push({
          ...item,
          id: itemId,
          _id: itemId,
          quantity: qtyToAdd,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.isHydrated = true;
      const targetId = action.payload;
      state.items = state.items.filter((i) => (i.id || i._id) !== targetId);
    },
    updateCartItemQuantity: (state, action) => {
      state.isHydrated = true;
      const { id, _id, quantity } = action.payload || {};
      const targetId = id || _id;
      const target = state.items.find((i) => (i.id || i._id) === targetId);

      if (target) {
        const newQty = parseInt(quantity, 10);
        if (newQty > 0) {
          target.quantity = newQty;
        } else {
          state.items = state.items.filter((i) => (i.id || i._id) !== targetId);
        }
      }
    },
    clearCart: (state) => {
      state.isHydrated = true;
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice;

