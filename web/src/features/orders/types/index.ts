export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  sku: string;
  productName: string;
  dimensionsText: string;
  unitPriceVnd: number;
  quantity: number;
  subtotalVnd: number;
  imageUrl: string;
}

export interface OrderEventRecord {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string;
  actor: "customer" | "admin" | "system";
  createdAt: string;
}

export interface DemoOrderRecord {
  id: string;
  orderCode: string;
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: "cod" | "vietqr" | "momo";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotalVnd: number;
  discountVnd: number;
  shippingVnd: number;
  totalVnd: number;
  promoCode?: string;
  notes?: string;
  items: OrderItemRecord[];
  events: OrderEventRecord[];
  createdAt: string;
  updatedAt: string;
}

