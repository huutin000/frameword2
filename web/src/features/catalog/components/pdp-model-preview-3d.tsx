"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { BoxGeometry } from "three";
import { mmToM } from "@/features/planner/utils/scene-3d-mapping";
import { Box, X } from "lucide-react";

export interface PDPModelPreview3DProps {
  product: {
    id: string;
    title: string;
    widthMm: number;
    depthMm: number;
    heightMm: number;
    priceVnd: number;
    noDrill?: boolean;
    category?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

function SingleProductMesh({
  widthMm,
  depthMm,
  heightMm,
  materialColor,
}: {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  materialColor: string;
}) {
  const sizeX = mmToM(widthMm);
  const sizeY = mmToM(heightMm);
  const sizeZ = mmToM(depthMm);

  return (
    <group position={[0, 0, 0]}>
      {/* Product Box Model */}
      <mesh castShadow receiveShadow position={[0, sizeY / 2, 0]}>
        <boxGeometry args={[sizeX, sizeY, sizeZ]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Wireframe Outline */}
      <lineSegments position={[0, sizeY / 2, 0]}>
        <edgesGeometry
          args={[new BoxGeometry(sizeX * 1.01, sizeY * 1.01, sizeZ * 1.01)]}
        />
        <lineBasicMaterial color="#5B7065" linewidth={1.5} />
      </lineSegments>

      {/* Caliper Dimension Labels in 3D */}
      <Html position={[0, sizeY + 0.15, 0]} center distanceFactor={6}>
        <div className="bg-[#29241E]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-md border border-white/20 whitespace-nowrap">
          {widthMm} × {depthMm} × {heightMm} mm
        </div>
      </Html>

      {/* Pedestal Shadow Receiver Plane */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[Math.max(sizeX, sizeZ) * 1.5, 32]} />
        <meshStandardMaterial color="#EDE6DC" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function PDPModelPreview3D({
  product,
  isOpen,
  onClose,
}: PDPModelPreview3DProps) {
  const [selectedColor, setSelectedColor] = useState("#5B7065");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FAF8F5] rounded-3xl max-w-3xl w-full h-[600px] shadow-2xl border border-[#E7E0D6] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E0D6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5B7065] text-white flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#29241E] line-clamp-1">
                {product.title}
              </h3>
              <div className="text-xs text-[#7A7265] font-mono">
                Số đo thực tế: {product.widthMm} × {product.depthMm} × {product.heightMm} mm
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7265] hover:text-[#29241E] hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 relative bg-[#FAF8F5]">
          <Canvas
            shadows
            camera={{ position: [1.8, 1.4, 2.2], fov: 42 }}
          >
            <ambientLight intensity={0.7} />
            <hemisphereLight intensity={0.3} groundColor="#FAF8F5" />
            <directionalLight
              position={[2.5, 4, 3]}
              intensity={1.4}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <SingleProductMesh
              widthMm={product.widthMm}
              depthMm={product.depthMm}
              heightMm={product.heightMm}
              materialColor={selectedColor}
            />

            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={0.8}
              maxDistance={5.0}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>

          {/* Color Switcher Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/80 shadow-md flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#29241E]">Màu hoàn thiện:</span>
            <div className="flex items-center gap-1.5">
              {[
                { color: "#5B7065", label: "Xanh Bắc Âu" },
                { color: "#8A6D50", label: "Gỗ Sồi Tự Nhiên" },
                { color: "#2B2824", label: "Đen Nhám Tĩnh Điện" },
                { color: "#E8E2D7", label: "Trắng Kem Sữa" },
              ].map((swatch) => (
                <button
                  key={swatch.color}
                  onClick={() => setSelectedColor(swatch.color)}
                  style={{ backgroundColor: swatch.color }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === swatch.color ? "border-[#29241E] ring-2 ring-[#5B7065]" : "border-white"
                  }`}
                  title={swatch.label}
                />
              ))}
            </div>
          </div>

          {/* Navigation Hint */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] text-[#7A7265] shadow-xs">
            Chuột trái xoay 360° • Con lăn phóng to/nhỏ
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E7E0D6] flex items-center justify-between">
          <div className="text-xs text-[#7A7265]">
            Mô phỏng 3D theo tỷ lệ 1:1 chuẩn milimét không gian thật.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#5B7065] text-white text-xs font-bold hover:bg-[#4A5D53] transition-colors"
            >
              Đóng xem trước
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
