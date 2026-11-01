"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRoomProfile } from "@/features/room-profile/context/room-profile-context";
import { useCart } from "@/features/cart/context/cart-context";
import type { CatalogProduct } from "@/features/catalog/types";
import type { PlannerItem, RoomScene } from "../utils/collision";
import {
  evaluateSceneCollisions,
  serializeScene,
  deserializeScene,
} from "../utils/collision";
import { PlannerCanvas } from "./planner-canvas";
import { PlannerSidebar } from "./planner-sidebar";
import {
  Maximize2,
  Home,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Box,
} from "lucide-react";

// Web-safe dynamic import for 3D Viewport (Zero SSR crash, lazy bundle chunk E015)
const RoomViewport3D = dynamic(
  () => import("./room-viewport-3d").then((mod) => mod.RoomViewport3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[520px] rounded-3xl bg-[#FAF8F5] border border-[#E7E0D6] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF4F0] text-[#5B7065] flex items-center justify-center shadow-inner">
          <Box className="w-7 h-7 animate-pulse" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#29241E]">
            Khởi tạo không gian 3D WebGL...
          </div>
          <div className="text-[10px] text-[#7A7265] mt-0.5">
            Ánh xạ tọa độ milimét sang Three.js meters
          </div>
        </div>
      </div>
    ),
  }
);

const SCENE_STORAGE_KEY = "small_living_saved_scene_v1";

const DEFAULT_ITEMS: PlannerItem[] = [
  {
    id: "item-table-1",
    productId: "p1",
    name: "Bàn Treo Tường Gấp Gọn",
    widthMm: 600,
    depthMm: 400,
    heightMm: 150,
    xMm: 200,
    zMm: 200,
    rotationDeg: 0,
    color: "#5B7065",
    priceVnd: 890000,
    category: "Bàn",
    noDrill: true,
  },
  {
    id: "item-shelf-1",
    productId: "p2",
    name: "Kệ Sách Đa Năng 5 Tầng",
    widthMm: 600,
    depthMm: 280,
    heightMm: 1500,
    xMm: 900,
    zMm: 200,
    rotationDeg: 0,
    color: "#5A4033",
    priceVnd: 1250000,
    category: "Kệ",
    noDrill: true,
  },
];

function getStoredSceneItems(): PlannerItem[] {
  if (typeof window === "undefined") return DEFAULT_ITEMS;
  try {
    const raw = localStorage.getItem(SCENE_STORAGE_KEY);
    if (raw) {
      const parsed = deserializeScene(raw);
      if (parsed.items && parsed.items.length > 0) {
        return parsed.items;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_ITEMS;
}

export function PlannerView() {
  const { activeProfile, profiles, setActiveProfileId } = useRoomProfile();
  const { addItem } = useCart();

  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [items, setItems] = useState<PlannerItem[]>(() => getStoredSceneItems());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Evaluate collisions and boundaries
  const { evaluatedItems, summary } = evaluateSceneCollisions(items, {
    widthMm: activeProfile.widthMm,
    depthMm: activeProfile.depthMm,
    heightMm: activeProfile.freeHeightMm,
  });

  const selectedItem =
    evaluatedItems.find((it) => it.id === selectedItemId) || null;

  // Actions
  const handleUpdatePosition = (id: string, xMm: number, zMm: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, xMm, zMm } : it))
    );
  };

  const handleRotateItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextRot = ((it.rotationDeg + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...it, rotationDeg: nextRot };
        }
        return it;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  const handleAddItem = (product: CatalogProduct) => {
    const newItem: PlannerItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      name: product.title,
      widthMm: product.widthMm || 800,
      depthMm: product.depthMm || 500,
      heightMm: product.heightMm || 750,
      xMm: 300,
      zMm: 300,
      rotationDeg: 0,
      color: "#5B7065",
      priceVnd: product.priceVnd,
      category: product.category || "Nội thất",
      noDrill: product.noDrill,
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    showToast(`Đã thêm "${product.title}" vào phòng!`);
  };

  const handleAddAllToCart = () => {
    if (items.length === 0) return;

    items.forEach((it) => {
      addItem(
        {
          id: it.productId,
          slug: it.productId,
          title: it.name,
          category: it.category,
          roomType: "studio",
          roomTag: activeProfile.name,
          problem: "tight-space",
          problemTag: "Thiết kế phòng",
          dimensions: `${it.widthMm}x${it.depthMm}x${it.heightMm}mm`,
          widthMm: it.widthMm,
          heightMm: it.heightMm,
          depthMm: it.depthMm,
          noDrill: Boolean(it.noDrill),
          priceVnd: it.priceVnd,
          imageUrl:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
          fitScoreExplanation: "Sản phẩm được chọn từ 2D Room Planner",
          inStock: true,
        },
        1
      );
    });

    setJustAddedToCart(true);
    showToast(`Đã thêm toàn bộ ${items.length} món trong phòng vào giỏ hàng!`);
    setTimeout(() => setJustAddedToCart(false), 3000);
  };

  const handleSaveScene = () => {
    const scene: RoomScene = {
      id: `scene-${activeProfile.id}`,
      name: activeProfile.name,
      widthMm: activeProfile.widthMm,
      depthMm: activeProfile.depthMm,
      heightMm: activeProfile.heightMm,
      items,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SCENE_STORAGE_KEY, serializeScene(scene));
      setSavedSuccess(true);
      showToast("Đã lưu thiết kế không gian thành công!");
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      alert("Không thể lưu thiết kế vào bộ nhớ trình duyệt.");
    }
  };

  const handleClearScene = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả nội thất khỏi phòng?")) {
      setItems([]);
      setSelectedItemId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29241E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#5A4033] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#85A392]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation & Active Room Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D6]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B7065] uppercase tracking-wider">
            <Maximize2 className="w-4 h-4" />
            <span>2D & 3D Interactive Room Planner & SpaceFit™ (S013, S014, S017)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E] mt-1">
            Quy Hoạch Phòng 2D / 3D Tương Tác
          </h1>
        </div>

        {/* 2D vs 3D View Switcher & Room Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E7E0D6] shadow-xs">
            <button
              onClick={() => setViewMode("2d")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "2d"
                  ? "bg-[#5B7065] text-white shadow-xs"
                  : "text-[#7A7265] hover:text-[#29241E]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mặt bằng 2D</span>
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "3d"
                  ? "bg-[#29241E] text-white shadow-xs"
                  : "text-[#7A7265] hover:text-[#29241E]"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#C1623C]" />
              <span>Phối cảnh 3D WebGL</span>
            </button>
          </div>

          {/* Active Room Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E7E0D6] shadow-xs">
            <Home className="w-4 h-4 text-[#5B7065]" />
            <select
              value={activeProfile.id}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="text-xs font-bold text-[#29241E] bg-transparent focus:outline-hidden cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/room-profile"
            className="text-xs font-bold text-[#5B7065] hover:text-[#29241E] px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E7E0D6] transition-colors border border-[#E7E0D6] flex items-center gap-1"
          >
            <span>Đổi số đo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Workspace Grid (Canvas/3D Viewport 8 cols, Sidebar 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: 2D Canvas or 3D WebGL Viewport (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {viewMode === "2d" ? (
            <PlannerCanvas
              room={{
                widthMm: activeProfile.widthMm,
                depthMm: activeProfile.depthMm,
                heightMm: activeProfile.heightMm,
                name: activeProfile.name,
              }}
              items={evaluatedItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onUpdateItemPosition={handleUpdatePosition}
              onRotateItem={handleRotateItem}
              onDeleteItem={handleDeleteItem}
            />
          ) : (
            <RoomViewport3D
              room={{
                widthMm: activeProfile.widthMm,
                depthMm: activeProfile.depthMm,
                heightMm: activeProfile.freeHeightMm,
                name: activeProfile.name,
              }}
              items={evaluatedItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onFallbackTo2D={() => setViewMode("2d")}
            />
          )}
        </div>

        {/* Right Column: Sidebar Inspector, Metrics & Picker (4 cols) */}
        <div className="lg:col-span-4">
          <PlannerSidebar
            items={evaluatedItems}
            selectedItem={selectedItem}
            sceneSummary={summary}
            onAddItem={handleAddItem}
            onRotateItem={handleRotateItem}
            onDeleteItem={handleDeleteItem}
            onUpdateCoordinates={handleUpdatePosition}
            onAddAllToCart={handleAddAllToCart}
            onSaveScene={handleSaveScene}
            onClearScene={handleClearScene}
            justAddedToCart={justAddedToCart}
            savedSuccess={savedSuccess}
          />
        </div>
      </div>
    </div>
  );
}
