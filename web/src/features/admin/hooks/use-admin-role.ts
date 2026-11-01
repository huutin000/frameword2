"use client";

import { useSyncExternalStore } from "react";
import type { AdminRole, AdminPermission, RoleDefinition } from "../types/acl";
import {
  ROLE_DEFINITIONS,
  hasPermission,
  canAccessRoute,
} from "../utils/permissions";

const ROLE_STORAGE_KEY = "small_living_admin_role_v1";
let currentRole: AdminRole = "super_admin";
const roleListeners = new Set<() => void>();

function notifyRoleChange() {
  roleListeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("small_living_role_changed"));
  }
}

export function getActiveAdminRole(): AdminRole {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY) as AdminRole;
      if (stored && ROLE_DEFINITIONS[stored]) {
        return stored;
      }
    } catch {
      // Fallback
    }
  }
  return currentRole;
}

export function setActiveAdminRole(role: AdminRole): void {
  if (!ROLE_DEFINITIONS[role]) return;
  currentRole = role;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // Ignore quota
    }
  }
  notifyRoleChange();
}

function subscribeRole(listener: () => void): () => void {
  roleListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("small_living_role_changed", listener);
    window.addEventListener("storage", listener);
  }
  return () => {
    roleListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("small_living_role_changed", listener);
      window.removeEventListener("storage", listener);
    }
  };
}

export function useAdminRole(): {
  role: AdminRole;
  roleDefinition: RoleDefinition;
  setRole: (role: AdminRole) => void;
  canAccess: (permission: AdminPermission) => boolean;
  canNavigate: (route: string) => boolean;
} {
  const role = useSyncExternalStore(
    subscribeRole,
    getActiveAdminRole,
    () => "super_admin" as AdminRole // Server snapshot
  );

  return {
    role,
    roleDefinition: ROLE_DEFINITIONS[role],
    setRole: setActiveAdminRole,
    canAccess: (perm) => hasPermission(role, perm),
    canNavigate: (route) => canAccessRoute(role, route),
  };
}

