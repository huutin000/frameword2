"use client";

import React from "react";
import type { PlacedFurniture, RoomProfile } from "../types";

export interface RoomCanvas2DProps {
  room: RoomProfile;
  objects: PlacedFurniture[];
  onSelectObject?: (obj: PlacedFurniture) => void;
}

export function RoomCanvas2D({ room, objects, onSelectObject }: RoomCanvas2DProps) {
  // Scale factor: fit within 520x420 container
  const maxContainerWidth = 520;
  const maxContainerHeight = 420;
  const scale = Math.min(
    maxContainerWidth / Math.max(room.widthMm, 1),
    maxContainerHeight / Math.max(room.depthMm, 1)
  );

  const canvasWidthPx = Math.round(room.widthMm * scale);
  const canvasHeightPx = Math.round(room.depthMm * scale);

  return (
    <div className="relative flex items-center justify-center p-8">
      {/* Scaled Room Box */}
      <div
        className="relative bg-[#FFFFFF] border-4 border-[#29241E] shadow-lg rounded-xs transition-all duration-300"
        style={{
          width: `${canvasWidthPx}px`,
          height: `${canvasHeightPx}px`,
          backgroundImage:
            "linear-gradient(to right, #E7E0D6 1px, transparent 1px), linear-gradient(to bottom, #E7E0D6 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Dimension Labels */}
        <div className="absolute -top-7 left-0 right-0 text-center font-mono text-[11px] font-bold text-[#5B7065]">
          ← {room.widthMm} mm →
        </div>
        <div className="absolute -left-14 top-0 bottom-0 flex items-center justify-center font-mono text-[11px] font-bold text-[#5B7065] -rotate-90">
          {room.depthMm} mm
        </div>

        {/* Placed Furniture Blocks */}
        {objects.map((obj) => {
          const leftPct = (obj.xMm / room.widthMm) * 100;
          const topPct = (obj.yMm / room.depthMm) * 100;
          const widthPct = (obj.widthMm / room.widthMm) * 100;
          const heightPct = (obj.depthMm / room.depthMm) * 100;

          return (
            <div
              key={obj.id}
              onClick={() => onSelectObject?.(obj)}
              className="absolute cursor-pointer border-2 border-white rounded shadow-md flex items-center justify-center text-[10px] font-bold text-white transition-all hover:ring-2 hover:ring-[#5B7065] select-none"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
                backgroundColor: obj.color,
              }}
              title={`${obj.name} (${obj.widthMm} × ${obj.depthMm} mm)`}
            >
              <span className="truncate px-1">{obj.name.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

