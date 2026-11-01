export type RoomType =
  | "studio"
  | "rented_room"
  | "living_room"
  | "bedroom"
  | "kitchen_corner"
  | "workspace_corner";

export interface RoomProfile {
  id: string;
  name: string;
  roomType: RoomType;
  // Outer room dimensions (mm)
  widthMm: number;
  depthMm: number;
  heightMm: number;
  // Free usable placement clearance (mm)
  freeWidthMm: number;
  freeDepthMm: number;
  freeHeightMm: number;
  // Conditions & restrictions
  isRented: boolean;
  noDrillRequired: boolean;
  targetBudgetVnd?: number;
  notes?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPreset {
  id: string;
  name: string;
  description: string;
  roomType: RoomType;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  freeWidthMm: number;
  freeDepthMm: number;
  freeHeightMm: number;
  isRented: boolean;
  noDrillRequired: boolean;
  targetBudgetVnd: number;
  badge: string;
}

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: "preset-studio-12m",
    name: "Phòng Trọ / Studio 12m²",
    description: "Không gian studio phổ biến cho người đi làm hoặc sinh viên. Yêu cầu đồ nội thất gấp gọn, không khoan đục tường.",
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
    badge: "Phổ biến nhất",
  },
  {
    id: "preset-phong-tro-15m",
    name: "Phòng Trọ 15m² Có Gác Xép",
    description: "Diện tích tầng trệt 15m², trần cao thoáng đãng nhưng lối đi hẹp. Cần tận dụng chiều cao và góc chết.",
    roomType: "rented_room",
    widthMm: 4000,
    depthMm: 3750,
    heightMm: 3200,
    freeWidthMm: 2800,
    freeDepthMm: 2200,
    freeHeightMm: 3200,
    isRented: true,
    noDrillRequired: true,
    targetBudgetVnd: 20000000,
    badge: "Gác xép",
  },
  {
    id: "preset-goc-lam-viec-90cm",
    name: "Góc Làm Việc Mini 0.8m²",
    description: "Khoảng thụt tường 90cm cạnh cửa sổ phòng ngủ. Tối ưu bàn treo/kẹp bàn và ghế xoay gấp gọn.",
    roomType: "workspace_corner",
    widthMm: 900,
    depthMm: 700,
    heightMm: 2500,
    freeWidthMm: 900,
    freeDepthMm: 700,
    freeHeightMm: 2500,
    isRented: false,
    noDrillRequired: false,
    targetBudgetVnd: 6000000,
    badge: "Góc nhỏ",
  },
  {
    id: "preset-bep-mini-120cm",
    name: "Góc Bếp Gọn 120cm",
    description: "Góc nấu nướng căn hộ mini. Bắt buộc kệ đứng đa tầng hít tường, không khoan gạch men.",
    roomType: "kitchen_corner",
    widthMm: 1200,
    depthMm: 600,
    heightMm: 2400,
    freeWidthMm: 1200,
    freeDepthMm: 600,
    freeHeightMm: 2400,
    isRented: true,
    noDrillRequired: true,
    targetBudgetVnd: 4500000,
    badge: "Bếp nhỏ",
  },
];

