"use server";

import { z } from "zod";
import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";
import {
  saveNewOrder,
  getOrderByIdempotencyKey,
} from "@/features/orders/data/order-store";
import type { DemoOrderRecord, OrderItemRecord } from "@/features/orders/types";
import type { CheckoutResult } from "../types";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Họ và tên người nhận phải có ít nhất 2 ký tự"),
  customerPhone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ (VD: 0901234567)"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  shippingAddress: z.string().min(5, "Địa chỉ nhận hàng chi tiết ít nhất 5 ký tự"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "vietqr", "momo"]),
  promoCode: z.string().optional(),
  idempotencyKey: z.string().min(8, "Mã khóa idempotency không hợp lệ"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Giỏ hàng phải có ít nhất 1 sản phẩm"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function processDemoCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  try {
    // 1. Zod Validation
    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      return { success: false, error: errorMsg };
    }

    const data = parsed.data;

    // 2. Idempotency Check (Criterion B007)
    const existingOrder = getOrderByIdempotencyKey(data.idempotencyKey);
    if (existingOrder) {
      return {
        success: true,
        orderId: existingOrder.id,
        orderCode: existingOrder.orderCode,
        totalVnd: existingOrder.totalVnd,
      };
    }

    // 3. Server-Authoritative Price & Stock Lookup (Criterion B005)
    // NEVER trust prices or titles submitted from client
    const orderItems: OrderItemRecord[] = [];
    let calculatedSubtotalVnd = 0;

    for (const rawItem of data.items) {
      const product = SAMPLE_PRODUCTS.find((p) => p.id === rawItem.productId);
      if (!product) {
        return {
          success: false,
          error: `Sản phẩm với mã "${rawItem.productId}" không tồn tại hoặc đã ngừng kinh doanh`,
        };
      }

      if (!product.inStock) {
        return {
          success: false,
          error: `Sản phẩm "${product.title}" hiện đang hết hàng`,
        };
      }

      const unitPriceVnd = product.priceVnd;
      const subtotalVnd = unitPriceVnd * rawItem.quantity;
      calculatedSubtotalVnd += subtotalVnd;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        orderId: "", // will attach below
        productId: product.id,
        sku: product.slug.toUpperCase(),
        productName: product.title,
        dimensionsText: product.dimensions,
        unitPriceVnd,
        quantity: rawItem.quantity,
        subtotalVnd,
        imageUrl: product.imageUrl,
      });
    }

    // 4. Promo code calculation
    let calculatedDiscountVnd = 0;
    if (data.promoCode && data.promoCode.trim().toUpperCase() === "SMALL2026") {
      // 10% discount, max 500,000 VND
      calculatedDiscountVnd = Math.min(
        Math.floor(calculatedSubtotalVnd * 0.1),
        500000
      );
    }

    // 5. Shipping fee calculation (Free for orders >= 1,000,000 VND, else 35,000 VND)
    const shippingVnd = calculatedSubtotalVnd >= 1000000 ? 0 : 35000;
    const finalTotalVnd = calculatedSubtotalVnd - calculatedDiscountVnd + shippingVnd;

    // 6. Generate IDs
    const timestampStr = Date.now().toString().slice(-6);
    const orderCode = `SL-2026-${timestampStr}`;
    const orderId = `ord-${orderCode.toLowerCase()}`;

    // Link items to orderId
    orderItems.forEach((i) => (i.orderId = orderId));

    const newOrder: DemoOrderRecord = {
      id: orderId,
      orderCode,
      idempotencyKey: data.idempotencyKey,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail?.trim() || undefined,
      shippingAddress: data.shippingAddress.trim(),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: "placed",
      subtotalVnd: calculatedSubtotalVnd,
      discountVnd: calculatedDiscountVnd,
      shippingVnd,
      totalVnd: finalTotalVnd,
      promoCode: data.promoCode?.trim().toUpperCase(),
      notes: data.notes?.trim() || undefined,
      items: orderItems,
      events: [
        {
          id: `evt-init-${orderId}`,
          orderId,
          fromStatus: null,
          toStatus: "placed",
          note: `Đơn hàng được đặt thành công qua phương thức ${
            data.paymentMethod === "cod"
              ? "Thanh toán khi nhận hàng (COD)"
              : data.paymentMethod === "vietqr"
              ? "Chuyển khoản VietQR"
              : "Ví MoMo"
          }`,
          actor: "customer",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveNewOrder(newOrder);

    return {
      success: true,
      orderId: newOrder.id,
      orderCode: newOrder.orderCode,
      totalVnd: newOrder.totalVnd,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định khi tạo đơn hàng";
    return { success: false, error: message };
  }
}

