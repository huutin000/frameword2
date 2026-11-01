"use client";

import { useSyncExternalStore } from "react";
import {
  getCurrentUser,
  subscribeAuth,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  updateCustomerProfile,
  addCustomerAddress,
  removeCustomerAddress,
  requestPasswordReset,
  DEMO_CUSTOMER,
  DEMO_ADMIN,
} from "../data/auth-store";

export function useAuth() {
  const user = useSyncExternalStore(
    subscribeAuth,
    getCurrentUser,
    () => null // Server snapshot
  );

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login: loginCustomer,
    register: registerCustomer,
    logout: logoutCustomer,
    updateProfile: updateCustomerProfile,
    addAddress: addCustomerAddress,
    removeAddress: removeCustomerAddress,
    requestReset: requestPasswordReset,
    demoCustomer: DEMO_CUSTOMER,
    demoAdmin: DEMO_ADMIN,
  };
}

