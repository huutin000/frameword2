export interface CartItem {
  id: string; // unique item id (productId + variantId)
  productId: string;
  variantId?: string;
  sku: string;
  title: string;
  category: string;
  dimensions: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  noDrill: boolean;
  priceVnd: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

export interface PromoCodeDiscount {
  code: string;
  percent: number;
  maxDiscountVnd: number;
  appliedDiscountVnd: number;
}

export interface CartSummary {
  itemCount: number;
  subtotalVnd: number;
  discountVnd: number;
  shippingVnd: number;
  totalVnd: number;
  promoCode?: PromoCodeDiscount | null;
}

export type PaymentMethod = "cod" | "vietqr" | "momo";

export interface CheckoutFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  ward: string;
  district: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  idempotencyKey: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderCode?: string;
  totalVnd?: number;
  error?: string;
}

