"use client";

import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { BoxGeometry } from "three";
import type { PlannerItem } from "../utils/collision";
import { mapItemTo3D, mmToM } from "../utils/scene-3d-mapping";
import { isWebGLAvailable } from "../utils/webgl-check";
import { Box, Layers, AlertTriangle } from "lucide-react";

export interface RoomViewport3DProps {
  room: { widthMm: number; depthMm: number; heightMm: number; name: string };
  items: PlannerItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onFallbackTo2D: () => void;
}

// 3D Furniture Box Component
function FurnitureMesh({
  item,
  roomHeightMm,
  isSelected,
  onSelect,
}: {
  item: PlannerItem;
  roomHeightMm: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos3D = mapItemTo3D(item, roomHeightMm);

  const isColliding =
    (item.collidingWith && item.collidingWith.length > 0) || item.isOutOfBounds;

  let mainColor = item.color || "#5B7065";
  if (isColliding) {
    mainColor = "#9E2A2B"; // Red warning
  } else if (item.category === "Bàn") {
    mainColor = "#7A6855"; // Wood tone
  } else if (item.category === "Kệ") {
    mainColor = "#4A5D53"; // Sage steel
  } else if (item.category === "Giường") {
    mainColor = "#685848"; // Dark wood
  }

  return (
    <group
      position={[pos3D.centerX, pos3D.centerY, pos3D.centerZ]}
      rotation={[0, pos3D.rotationRadY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Furniture Box Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[pos3D.sizeX, pos3D.sizeY, pos3D.sizeZ]} />
        <meshStandardMaterial
          color={mainColor}
          roughness={0.4}
          metalness={0.1}
          opacity={isColliding ? 0.85 : 1}
          transparent={Boolean(isColliding)}
        />
      </mesh>

      {/* Selection / Collision Outline Wireframe */}
      {(isSelected || isColliding) && (
        <lineSegments>
          <edgesGeometry
            args={[new BoxGeometry(pos3D.sizeX * 1.02, pos3D.sizeY * 1.02, pos3D.sizeZ * 1.02)]}
          />
          <lineBasicMaterial
            color={isColliding ? "#FF3B30" : "#FFFFFF"}
            linewidth={2}
          />
        </lineSegments>
      )}

      {/* Floating 3D HTML Tooltip when selected or hovered */}
      {(isSelected || hovered) && (
        <Html position={[0, pos3D.sizeY / 2 + 0.25, 0]} center distanceFactor={8}>
          <div className="bg-[#29241E]/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl text-center pointer-events-none border border-white/20 whitespace-nowrap animate-in fade-in zoom-in-95">
            <div className="text-xs font-bold leading-tight">{item.name}</div>
            <div className="text-[10px] text-[#D3C7B7] font-mono mt-0.5">
              {item.widthMm} × {item.depthMm} × {item.heightMm} mm
            </div>
            {isColliding && (
              <div className="text-[9px] font-bold text-[#FF6B6B] mt-0.5 flex items-center justify-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>Va chạm / Chạm tường</span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// 3D Room Shell (Floor, Boundary Walls, Measuring Lines)
function RoomShell({
  room,
}: {
  room: { widthMm: number; depthMm: number; heightMm: number };
}) {
  const widthM = mmToM(room.widthMm);
  const depthM = mmToM(room.depthMm);
  const heightM = mmToM(room.heightMm);

  return (
    <group>
      {/* 1. Wooden Floor Mesh */}
      <mesh
        position={[widthM / 2, -0.01, depthM / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[widthM, depthM]} />
        <meshStandardMaterial
          color="#FAF8F5"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Floor Grid Lines (100mm / 0.1m step) */}
      <gridHelper
        args={[Math.max(widthM, depthM), Math.round(Math.max(widthM, depthM) * 10), "#D3C7B7", "#E7E0D6"]}
        position={[widthM / 2, 0.001, depthM / 2]}
      />

      {/* 2. Back Wall (Translucent) */}
      <mesh position={[widthM / 2, heightM / 2, 0]} receiveShadow>
        <planeGeometry args={[widthM, heightM]} />
        <meshStandardMaterial
          color="#EDE6DC"
          transparent
          opacity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* 3. Left Wall (Translucent) */}
      <mesh
        position={[0, heightM / 2, depthM / 2]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depthM, heightM]} />
        <meshStandardMaterial
          color="#EDE6DC"
          transparent
          opacity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* 4. Ceiling Height Line Indicator */}
      <lineSegments>
        <edgesGeometry
          args={[new BoxGeometry(widthM, heightM, depthM)]}
        />
        <lineBasicMaterial color="#5B7065" transparent opacity={0.3} />
      </lineSegments>

      {/* Door Entrance Indicator on Floor */}
      <mesh position={[0.4, 0.005, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.06]} />
        <meshBasicMaterial color="#C1623C" />
      </mesh>
    </group>
  );
}

export function RoomViewport3D({
  room,
  items,
  selectedItemId,
  onSelectItem,
  onFallbackTo2D,
}: RoomViewport3DProps) {
  const [webGLSupported] = useState<boolean>(() => isWebGLAvailable());
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const widthM = mmToM(room.widthMm);
  const depthM = mmToM(room.depthMm);
  const heightM = mmToM(room.heightMm);

  const roomCenterX = widthM / 2;
  const roomCenterZ = depthM / 2;

  const setCameraAngle = (mode: "perspective" | "top" | "eye") => {
    if (!controlsRef.current) return;
    if (mode === "perspective") {
      controlsRef.current.object.position.set(roomCenterX + 3.5, heightM + 2.5, roomCenterZ + 4.5);
      controlsRef.current.target.set(roomCenterX, heightM / 3, roomCenterZ);
    } else if (mode === "top") {
      controlsRef.current.object.position.set(roomCenterX, heightM + 5.0, roomCenterZ + 0.01);
      controlsRef.current.target.set(roomCenterX, 0, roomCenterZ);
    } else if (mode === "eye") {
      controlsRef.current.object.position.set(roomCenterX, 1.4, depthM + 2.5);
      controlsRef.current.target.set(roomCenterX, 1.0, roomCenterZ);
    }
    controlsRef.current.update();
  };

  if (!webGLSupported) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-[#FAF8F5] rounded-3xl border border-[#E7E0D6] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF9EB] text-[#8C6D1F] flex items-center justify-center border border-[#E8D4A2]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-base font-bold text-[#29241E]">
            Trình duyệt chưa bật tăng tốc WebGL
          </h3>
          <p className="text-xs text-[#7A7265] leading-relaxed">
            Hệ thống tự động chuyển sang chế độ Mặt Bằng 2D đầy đủ công năng với tỷ lệ chuẩn mm, kiểm tra va chạm và đo lối đi lưu thông.
          </p>
        </div>
        <button
          onClick={onFallbackTo2D}
          className="px-5 py-2.5 rounded-xl bg-[#5B7065] text-white text-xs font-bold hover:bg-[#4A5D53] transition-colors"
        >
          Quay lại Mặt Bằng 2D
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D6] shadow-inner">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [roomCenterX + 3.2, heightM + 2.2, roomCenterZ + 4.0],
          fov: 45,
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            onSelectItem(null);
          }
        }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={0.4} groundColor="#FAF8F5" />
        <directionalLight
          position={[roomCenterX + 4, heightM + 5, roomCenterZ + 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <RoomShell room={room} />

        {items.map((item) => (
          <FurnitureMesh
            key={item.id}
            item={item}
            roomHeightMm={room.heightMm}
            isSelected={selectedItemId === item.id}
            onSelect={() => onSelectItem(item.id)}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          target={[roomCenterX, heightM / 3, roomCenterZ]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={1.0}
          maxDistance={12.0}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-xs flex items-center gap-1.5 text-xs text-[#29241E]">
          <Box className="w-3.5 h-3.5 text-[#5B7065]" />
          <span className="font-bold">Mô phỏng 3D WebGL</span>
          <span className="text-[#A8A196] font-mono text-[10px]">
            ({(room.widthMm / 1000).toFixed(2)}m × {(room.depthMm / 1000).toFixed(2)}m)
          </span>
        </div>
      </div>

      {/* Preset Camera Views (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-white/80 shadow-xs">
        <button
          onClick={() => setCameraAngle("perspective")}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#29241E] hover:bg-[#FAF7F2] transition-colors"
          title="Góc nhìn phối cảnh 45°"
        >
          Phối cảnh
        </button>
        <button
          onClick={() => setCameraAngle("top")}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#29241E] hover:bg-[#FAF7F2] transition-colors"
          title="Góc nhìn thẳng từ trên xuống"
        >
          Từ trên xuống
        </button>
        <button
          onClick={() => setCameraAngle("eye")}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#29241E] hover:bg-[#FAF7F2] transition-colors"
          title="Góc nhìn ngang tầm mắt 1.4m"
        >
          Tầm mắt
        </button>
      </div>

      {/* Helper Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-[#7A7265] pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-xs pointer-events-auto">
          Chuột trái: <strong>Xoay phòng</strong> • Chuột phải: <strong>Di chuyển góc nhìn</strong> • Con lăn: <strong>Phóng to/nhỏ</strong>
        </div>

        <button
          onClick={onFallbackTo2D}
          className="bg-white/90 backdrop-blur-md hover:bg-white text-[#5B7065] font-bold px-3 py-1 rounded-lg border border-[#E7E0D6] shadow-xs pointer-events-auto flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Về mặt bằng 2D</span>
        </button>
      </div>
    </div>
  );
}
