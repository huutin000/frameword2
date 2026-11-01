export type RoomType =
  | "studio"
  | "bedroom"
  | "workspace"
  | "kitchen"
  | "balcony";

export type SpatialProblem =
  | "no-drill"
  | "tight-space"
  | "dead-corner"
  | "foldable";

export interface SpatialDimensions {
  widthMm: number;
  depthMm: number;
  heightMm: number;
}

export type OrderStatus =
  | "draft"
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface DemoOrderItem {
  id: string;
  sku: string;
  title: string;
  priceVnd: number;
  quantity: number;
  dimensions: SpatialDimensions;
}

export interface DemoOrder {
  id: string;
  customerName: string;
  totalVnd: number;
  itemsCount: number;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
}

export interface InventoryBalance {
  sku: string;
  productName: string;
  dimensions: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
}

