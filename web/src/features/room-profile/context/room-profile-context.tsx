"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { RoomProfile, RoomPreset } from "../types";

const STORAGE_KEY = "small_living_room_profiles_v1";
const ACTIVE_ROOM_KEY = "small_living_active_room_v1";

const DEFAULT_PROFILE: RoomProfile = {
  id: "room-default-studio",
  name: "Phòng Trọ 12m² Của Tôi",
  roomType: "studio",
  widthMm: 3500,
  depthMm: 3420,
  heightMm: 2600,
  freeWidthMm: 2400,
  freeDepthMm: 2000,
  freeHeightMm: 2600,
  isRented: true,
  noDrillRequired: true,
  targetBudgetVnd: 15000000,
  notes: "Phòng thuê chung cư mini, chủ nhà cấm khoan tường.",
  isDefault: true,
  createdAt: "2026-11-01T00:00:00Z",
  updatedAt: "2026-11-01T00:00:00Z",
};

function getStoredProfiles(): RoomProfile[] {
  if (typeof window === "undefined") return [DEFAULT_PROFILE];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [DEFAULT_PROFILE];
}

function getStoredActiveId(): string {
  if (typeof window === "undefined") return DEFAULT_PROFILE.id;
  try {
    const active = localStorage.getItem(ACTIVE_ROOM_KEY);
    if (active) return active;
  } catch {
    // fallback
  }
  return DEFAULT_PROFILE.id;
}

interface RoomProfileContextType {
  profiles: RoomProfile[];
  activeProfile: RoomProfile;
  isHydrated: boolean;
  setActiveProfileId: (id: string) => void;
  saveProfile: (profile: Omit<RoomProfile, "id" | "createdAt" | "updatedAt"> & { id?: string }) => RoomProfile;
  deleteProfile: (id: string) => void;
  applyPreset: (preset: RoomPreset) => RoomProfile;
}

const RoomProfileContext = createContext<RoomProfileContextType | null>(null);

function subscribeHydration() {
  return () => {};
}

export function RoomProfileProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );

  const [profiles, setProfiles] = useState<RoomProfile[]>(() => getStoredProfiles());
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() => getStoredActiveId());

  const persistProfiles = (newProfiles: RoomProfile[]) => {
    setProfiles(newProfiles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
    } catch {
      // safe fallback
    }
  };

  const setActiveProfileId = (id: string) => {
    setActiveProfileIdState(id);
    try {
      localStorage.setItem(ACTIVE_ROOM_KEY, id);
    } catch {
      // safe fallback
    }
  };

  const saveProfile = (
    profileData: Omit<RoomProfile, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ): RoomProfile => {
    const now = new Date().toISOString();
    let saved: RoomProfile;

    if (profileData.id && profiles.some((p) => p.id === profileData.id)) {
      saved = {
        ...profileData,
        id: profileData.id,
        updatedAt: now,
        createdAt: profiles.find((p) => p.id === profileData.id)!.createdAt,
      };
      const updated = profiles.map((p) => (p.id === saved.id ? saved : p));
      persistProfiles(updated);
    } else {
      const newId = `room-${Date.now()}`;
      saved = {
        ...profileData,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...profiles, saved];
      persistProfiles(updated);
      setActiveProfileId(newId);
    }

    return saved;
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("Bạn cần giữ lại ít nhất 1 hồ sơ không gian.");
      return;
    }
    const updated = profiles.filter((p) => p.id !== id);
    persistProfiles(updated);
    if (activeProfileId === id) {
      setActiveProfileId(updated[0].id);
    }
  };

  const applyPreset = (preset: RoomPreset): RoomProfile => {
    const created = saveProfile({
      name: `${preset.name} (Tạo từ mẫu)`,
      roomType: preset.roomType,
      widthMm: preset.widthMm,
      depthMm: preset.depthMm,
      heightMm: preset.heightMm,
      freeWidthMm: preset.freeWidthMm,
      freeDepthMm: preset.freeDepthMm,
      freeHeightMm: preset.freeHeightMm,
      isRented: preset.isRented,
      noDrillRequired: preset.noDrillRequired,
      targetBudgetVnd: preset.targetBudgetVnd,
      notes: preset.description,
    });
    return created;
  };

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILE;

  return (
    <RoomProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isHydrated,
        setActiveProfileId,
        saveProfile,
        deleteProfile,
        applyPreset,
      }}
    >
      {children}
    </RoomProfileContext.Provider>
  );
}

export function useRoomProfile() {
  const context = useContext(RoomProfileContext);
  if (!context) {
    throw new Error("useRoomProfile must be used within a RoomProfileProvider");
  }
  return context;
}
