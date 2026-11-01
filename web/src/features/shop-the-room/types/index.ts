export interface RoomHotspot {
  id: string;
  productId: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  label: string;
  note?: string;
}

export interface ShopRoomScene {
  id: string;
  title: string;
  subtitle: string;
  roomStyle: string;
  areaM2: number;
  imageUrl: string;
  description: string;
  hotspots: RoomHotspot[];
}

