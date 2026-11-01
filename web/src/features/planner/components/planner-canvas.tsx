"use client";

import React, { useRef, useState, useEffect } from "react";
import type { PlannerItem } from "../utils/collision";
import { getEffectiveDimensions } from "../utils/collision";
import { AlertTriangle } from "lucide-react";

export interface PlannerCanvasProps {
  room: { widthMm: number; depthMm: number; heightMm: number; name: string };
  items: PlannerItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItemPosition: (id: string, xMm: number, zMm: number) => void;
  onRotateItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function PlannerCanvas({
  room,
  items,
  selectedItemId,
  onSelectItem,
  onUpdateItemPosition,
  onRotateItem,
  onDeleteItem,
}: PlannerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 700, height: 500 });

  // Update container dimensions on resize
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(320, rect.width - 64),
          height: Math.max(300, Math.min(560, window.innerHeight * 0.6)),
        });
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Compute scale to fit room into canvas container
  const scale = Math.min(
    containerSize.width / Math.max(room.widthMm, 1),
    containerSize.height / Math.max(room.depthMm, 1)
  );

  const canvasWidthPx = Math.round(room.widthMm * scale);
  const canvasHeightPx = Math.round(room.depthMm * scale);

  // Dragging State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, z: 0 });

  const handlePointerDown = (e: React.PointerEvent, item: PlannerItem) => {
    e.stopPropagation();
    onSelectItem(item.id);
    setDraggingId(item.id);

    // Calculate mouse position relative to item top-left in mm
    const canvasRect = containerRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const pointerCanvasX = (e.clientX - canvasRect.left - 32) / scale;
    const pointerCanvasZ = (e.clientY - canvasRect.top - 32) / scale;

    setDragStartOffset({
      x: pointerCanvasX - item.xMm,
      z: pointerCanvasZ - item.zMm,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;

    const canvasRect = containerRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const pointerCanvasX = (e.clientX - canvasRect.left - 32) / scale;
    const pointerCanvasZ = (e.clientY - canvasRect.top - 32) / scale;

    const rawX = pointerCanvasX - dragStartOffset.x;
    const rawZ = pointerCanvasZ - dragStartOffset.z;

    // Snap to 100mm grid
    const snappedX = Math.round(rawX / 100) * 100;
    const snappedZ = Math.round(rawZ / 100) * 100;

    // Constrain within room
    const draggingItem = items.find((it) => it.id === draggingId);
    if (!draggingItem) return;

    const { effectiveWidthMm, effectiveDepthMm } = getEffectiveDimensions(draggingItem);
    const clampedX = Math.max(0, Math.min(room.widthMm - effectiveWidthMm, snappedX));
    const clampedZ = Math.max(0, Math.min(room.depthMm - effectiveDepthMm, snappedZ));

    onUpdateItemPosition(draggingId, clampedX, clampedZ);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safe fallback
      }
      setDraggingId(null);
    }
  };

  // Keyboard Navigation Alternative (S011)
  const handleKeyDown = (e: React.KeyboardEvent, item: PlannerItem) => {
    const step = e.shiftKey ? 500 : 100; // 100mm standard, 500mm fast

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onUpdateItemPosition(item.id, Math.max(0, item.xMm - step), item.zMm);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const { effectiveWidthMm } = getEffectiveDimensions(item);
      onUpdateItemPosition(
        item.id,
        Math.min(room.widthMm - effectiveWidthMm, item.xMm + step),
        item.zMm
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onUpdateItemPosition(item.id, item.xMm, Math.max(0, item.zMm - step));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const { effectiveDepthMm } = getEffectiveDimensions(item);
      onUpdateItemPosition(
        item.id,
        item.xMm,
        Math.min(room.depthMm - effectiveDepthMm, item.zMm + step)
      );
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      onRotateItem(item.id);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDeleteItem(item.id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onSelectItem(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectItem(null)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full flex flex-col items-center justify-center p-8 bg-[#FAF8F5] select-none overflow-hidden rounded-3xl border border-[#E7E0D6] shadow-inner"
      style={{ minHeight: `${canvasHeightPx + 80}px` }}
    >
      {/* Dimension Label Top */}
      <div className="absolute top-2 left-0 right-0 text-center font-mono text-xs font-bold text-[#5B7065]">
        ← Chiều ngang: {room.widthMm} mm ({(room.widthMm / 1000).toFixed(2)} m) →
      </div>

      {/* Dimension Label Left */}
      <div className="absolute left-2 top-0 bottom-0 flex items-center justify-center font-mono text-xs font-bold text-[#5B7065] -rotate-90">
        ← Chiều sâu: {room.depthMm} mm →
      </div>

      {/* Scaled Room Boundary Box */}
      <div
        className="relative bg-white border-4 border-[#29241E] rounded-xs shadow-lg transition-all"
        style={{
          width: `${canvasWidthPx}px`,
          height: `${canvasHeightPx}px`,
          backgroundImage:
            "linear-gradient(to right, #EDE6DC 1px, transparent 1px), linear-gradient(to bottom, #EDE6DC 1px, transparent 1px)",
          backgroundSize: `${Math.max(8, Math.round(100 * scale))}px ${Math.max(8, Math.round(100 * scale))}px`,
        }}
      >
        {/* Entrance Door Indicator */}
        <div className="absolute top-0 left-8 w-16 h-1.5 bg-[#C1623C] rounded-b-xs" title="Cửa vào phòng" />

        {/* Placed Furniture Items */}
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;
          const isColliding = (item.collidingWith && item.collidingWith.length > 0) || item.isOutOfBounds;
          const { effectiveWidthMm, effectiveDepthMm } = getEffectiveDimensions(item);

          const leftPx = Math.round(item.xMm * scale);
          const topPx = Math.round(item.zMm * scale);
          const widthPx = Math.max(24, Math.round(effectiveWidthMm * scale));
          const heightPx = Math.max(24, Math.round(effectiveDepthMm * scale));

          return (
            <div
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`${item.name}, vị trí X ${item.xMm}mm, Z ${item.zMm}mm, xoay ${item.rotationDeg} độ`}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              className={`absolute cursor-grab active:cursor-grabbing rounded-md flex flex-col items-center justify-center p-1 text-center transition-shadow border-2 focus:outline-hidden ${
                isColliding
                  ? "border-[#9E2A2B] bg-[#FDF2F2]/90 text-[#9E2A2B] shadow-md ring-2 ring-[#9E2A2B]/40"
                  : isSelected
                  ? "border-[#29241E] bg-[#5B7065] text-white shadow-xl ring-2 ring-[#5B7065]/40"
                  : "border-[#5B7065]/60 bg-[#EEF4F0] text-[#29241E] shadow-xs hover:border-[#5B7065]"
              }`}
              style={{
                left: `${leftPx}px`,
                top: `${topPx}px`,
                width: `${widthPx}px`,
                height: `${heightPx}px`,
              }}
            >
              {/* Item Name */}
              <span className="text-[10px] sm:text-xs font-bold truncate max-w-full leading-tight">
                {item.name}
              </span>

              {/* Dimension tag */}
              <span className="text-[8px] sm:text-[9px] font-mono opacity-80 mt-0.5">
                {effectiveWidthMm}×{effectiveDepthMm}
              </span>

              {/* Collision Danger Badge */}
              {isColliding && (
                <div
                  className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#9E2A2B] text-white flex items-center justify-center shadow-md animate-pulse"
                  title="Phát hiện va chạm hoặc chạm tường"
                >
                  <AlertTriangle className="w-3 h-3" />
                </div>
              )}

              {/* Rotation tag */}
              {item.rotationDeg !== 0 && (
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono opacity-70">
                  {item.rotationDeg}°
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Keyboard Controls Hint */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-[#7A7265]">
        Dùng chuột kéo thả hoặc <strong>Phím Mũi tên</strong> (di chuyển 100mm), <strong>R</strong> (xoay 90°), <strong>Delete</strong> (xóa).
      </div>
    </div>
  );
}
