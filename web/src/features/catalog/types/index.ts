import type { RoomType, SpatialProblem } from "@/types/commerce";

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  roomType: RoomType;
  roomTag: string;
  problem: SpatialProblem;
  problemTag: string;
  dimensions: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  noDrill: boolean;
  priceVnd: number;
  imageUrl: string;
  galleryImages?: string[];
  videoUrl?: string;
  videoTitle?: string;
  fitScoreExplanation: string;
  inStock: boolean;
}

export interface CatalogFilterState {
  room: string;
  problem: string;
  onlyNoDrill: boolean;
  maxWidthMm: number;
  sortBy: "featured" | "price-asc" | "price-desc";
}

