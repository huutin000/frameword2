import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/cartslice.js";

export const store = configureStore({
  reducer: {
    cart: CartSlice.reducer,
  },
});
