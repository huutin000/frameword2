import type { DemoOrderRecord, OrderStatus, OrderEventRecord } from "../types";

// In-memory persistent order repository for Demo runtime
// Seeded with representative orders matching database seed
let ORDERS_REGISTRY: DemoOrderRecord[] = [
  {
    id: "ord-seed-01",
    orderCode: "SL-2026-001",
    idempotencyKey: "seed-key-01",
    customerName: "Nguyễn Văn An",
    customerPhone: "0901234567",
    customerEmail: "an.nguyen@example.com",
    shippingAddress: "Phòng 402, Chung cư Mini 88 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "processing",
    subtotalVnd: 1830000,
    discountVnd: 183000,
    shippingVnd: 0,
    totalVnd: 1647000,
    promoCode: "SMALL2026",
    notes: "Giao sau 18h vì ban ngày đi làm",
    items: [
      {
        id: "item-seed-01",
        orderId: "ord-seed-01",
        productId: "p1",
        sku: "SL-P1-STD",
        productName: "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm",
        dimensionsText: "600 × 280 × 2600 mm",
        unitPriceVnd: 680000,
        quantity: 1,
        subtotalVnd: 680000,
        imageUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-seed-02",
        orderId: "ord-seed-01",
        productId: "p2",
        sku: "SL-P2-OAK",
        productName: "Bàn Làm Việc Gấp Gọn Piston Thủy Lực 800mm",
        dimensionsText: "800 × 500 × 750 mm",
        unitPriceVnd: 1150000,
        quantity: 1,
        subtotalVnd: 1150000,
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
      },
    ],
    events: [
      {
        id: "evt-01",
        orderId: "ord-seed-01",
        fromStatus: null,
        toStatus: "placed",
        note: "Đơn hàng được khởi tạo thành công",
        actor: "customer",
        createdAt: "2026-10-31T08:30:00.000Z",
      },
      {
        id: "evt-02",
        orderId: "ord-seed-01",
        fromStatus: "placed",
        toStatus: "processing",
        note: "Kho Small Living đã tiếp nhận và đang đóng gói sản phẩm",
        actor: "admin",
        createdAt: "2026-10-31T09:15:00.000Z",
      },
    ],
    createdAt: "2026-10-31T08:30:00.000Z",
    updatedAt: "2026-10-31T09:15:00.000Z",
  },
  {
    id: "ord-seed-02",
    orderCode: "SL-2026-002",
    idempotencyKey: "seed-key-02",
    customerName: "Trần Thị Mai",
    customerPhone: "0987654321",
    customerEmail: "mai.tran@example.com",
    shippingAddress: "Căn hộ B-1205, Vinhomes D'Capitale, 119 Trần Duy Hưng, Hà Nội",
    paymentMethod: "vietqr",
    paymentStatus: "paid",
    orderStatus: "shipped",
    subtotalVnd: 840000,
    discountVnd: 0,
    shippingVnd: 35000,
    totalVnd: 875000,
    notes: "Gọi bảo vệ sảnh nhận hàng giúp nếu không liên lạc được",
    items: [
      {
        id: "item-seed-03",
        orderId: "ord-seed-02",
        productId: "p3",
        sku: "SL-P3-WHT",
        productName: "Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe",
        dimensionsText: "150 × 450 × 850 mm",
        unitPriceVnd: 420000,
        quantity: 2,
        subtotalVnd: 840000,
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      },
    ],
    events: [
      {
        id: "evt-03",
        orderId: "ord-seed-02",
        fromStatus: null,
        toStatus: "placed",
        note: "Đơn hàng khởi tạo thành công qua thanh toán VietQR",
        actor: "customer",
        createdAt: "2026-10-30T14:20:00.000Z",
      },
      {
        id: "evt-04",
        orderId: "ord-seed-02",
        fromStatus: "placed",
        toStatus: "processing",
        note: "Đã xác nhận thanh toán VietQR và đóng gói",
        actor: "system",
        createdAt: "2026-10-30T14:22:00.000Z",
      },
      {
        id: "evt-05",
        orderId: "ord-seed-02",
        fromStatus: "processing",
        toStatus: "shipped",
        note: "Bàn giao cho đơn vị vận chuyển Viettel Post (Mã vận đơn: VT-883921)",
        actor: "admin",
        createdAt: "2026-10-31T10:00:00.000Z",
      },
    ],
    createdAt: "2026-10-30T14:20:00.000Z",
    updatedAt: "2026-10-31T10:00:00.000Z",
  },
];

// Valid state machine transitions
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function getAllOrders(filter?: { status?: OrderStatus; search?: string }): DemoOrderRecord[] {
  let orders = [...ORDERS_REGISTRY];
  if (filter?.status) {
    orders = orders.filter((o) => o.orderStatus === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    orders = orders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string): DemoOrderRecord | undefined {
  return ORDERS_REGISTRY.find((o) => o.id === id || o.orderCode === id);
}

export function getOrderByIdempotencyKey(key: string): DemoOrderRecord | undefined {
  if (!key) return undefined;
  return ORDERS_REGISTRY.find((o) => o.idempotencyKey === key);
}

export function saveNewOrder(order: DemoOrderRecord): DemoOrderRecord {
  // Check idempotency first (B007)
  const existing = getOrderByIdempotencyKey(order.idempotencyKey);
  if (existing) {
    return existing;
  }
  ORDERS_REGISTRY.unshift(order);
  return order;
}

export function transitionOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  actor: "admin" | "customer" | "system" = "admin"
): { success: boolean; order?: DemoOrderRecord; error?: string } {
  const order = ORDERS_REGISTRY.find((o) => o.id === orderId || o.orderCode === orderId);
  if (!order) {
    return { success: false, error: "Không tìm thấy đơn hàng" };
  }

  const currentStatus = order.orderStatus;
  if (currentStatus === newStatus) {
    return { success: true, order };
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    return {
      success: false,
      error: `Chuyển trạng thái không hợp lệ: từ "${currentStatus}" sang "${newStatus}"`,
    };
  }

  const event: OrderEventRecord = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    fromStatus: currentStatus,
    toStatus: newStatus,
    note:
      note ||
      (newStatus === "processing"
        ? "Đơn hàng chuyển sang trạng thái đang xử lý và đóng gói"
        : newStatus === "shipped"
        ? "Đơn hàng đã bàn giao vận chuyển"
        : newStatus === "delivered"
        ? "Giao hàng thành công đến khách hàng"
        : "Đơn hàng đã bị hủy, hoàn trả tồn kho"),
    actor,
    createdAt: new Date().toISOString(),
  };

  order.orderStatus = newStatus;
  order.events.push(event);
  order.updatedAt = new Date().toISOString();

  return { success: true, order };
}

export function resetOrderRegistryToSeed() {
  // Useful for deterministic testing
  ORDERS_REGISTRY = ORDERS_REGISTRY.filter((o) => o.id.startsWith("ord-seed-"));
}

