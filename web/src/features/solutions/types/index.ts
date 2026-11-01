export type SolutionGoal =
  | "bep_gon"
  | "goc_lam_viec"
  | "luu_tru"
  | "giat_phoi"
  | "phong_thue_khong_khoan";

export interface SolutionItem {
  productId: string;
  title: string;
  variantSku: string;
  variantName: string;
  priceVnd: number;
  imageUrl: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  noDrill: boolean;
  quantity: number;
  isRequired?: boolean;
  selected: boolean;
}

export interface SolutionBundle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  goal: SolutionGoal;
  roomType: string;
  description: string;
  imageUrl: string;
  comboDiscountPercent: number; // e.g. 10%
  items: SolutionItem[];
  isTemplate: boolean;
  isPublished: boolean;
  authorRole: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface BundlePricingSummary {
  originalTotalVnd: number;
  discountVnd: number;
  finalTotalVnd: number;
  selectedCount: number;
  totalFloorAreaM2: number;
  allNoDrill: boolean;
}

