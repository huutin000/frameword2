export interface AdminAuditLogRecord {
  id: string;
  actor: string;
  role: string;
  action: string;
  entityType: "order" | "product" | "category" | "promotion" | "inventory" | "system";
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

const AUDIT_LOGS_REGISTRY: AdminAuditLogRecord[] = [
  {
    id: "log-1",
    actor: "Admin (Hoàng Tuấn Anh)",
    role: "super_admin",
    action: "STATUS_TRANSITION",
    entityType: "order",
    entityId: "SL-2026-001",
    details: "Chuyển trạng thái đơn hàng từ 'placed' sang 'processing'",
    ipAddress: "118.70.124.52",
    createdAt: "2026-10-31T09:15:00Z",
  },
  {
    id: "log-2",
    actor: "Admin (Hoàng Tuấn Anh)",
    role: "super_admin",
    action: "PRODUCT_UPDATE",
    entityType: "product",
    entityId: "p1",
    details: "Cập nhật giá niêm yết sản phẩm Kệ Đứng Chống Trần 600mm",
    ipAddress: "118.70.124.52",
    createdAt: "2026-10-30T15:20:00Z",
  },
  {
    id: "log-3",
    actor: "Hệ thống (Automated)",
    role: "system",
    action: "PROMO_EXHAUSTED",
    entityType: "promotion",
    entityId: "FREESHIP26",
    details: "Mã ưu đãi đã đạt giới hạn 200/200 lượt và tự động tạm dừng",
    ipAddress: "127.0.0.1",
    createdAt: "2026-10-31T23:59:59Z",
  },
  {
    id: "log-4",
    actor: "Nguyễn Văn Kho (Admin)",
    role: "inventory_manager",
    action: "STOCK_IMPORT",
    entityType: "inventory",
    entityId: "SL-P1-101",
    details: "Nhập thêm 20 sản phẩm theo phiếu PO-2026-001",
    ipAddress: "118.70.124.52",
    createdAt: "2026-10-25T08:00:00Z",
  },
];

export function getAllAuditLogs(filter?: {
  entityType?: string;
  search?: string;
}): AdminAuditLogRecord[] {
  let logs = [...AUDIT_LOGS_REGISTRY];
  if (filter?.entityType && filter.entityType !== "all") {
    logs = logs.filter((l) => l.entityType === filter.entityType);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    logs = logs.filter(
      (l) =>
        l.details.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
    );
  }
  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function logAdminMutation(
  entry: Omit<AdminAuditLogRecord, "id" | "createdAt" | "ipAddress">
) {
  const newLog: AdminAuditLogRecord = {
    ...entry,
    id: `log-${Date.now()}`,
    ipAddress: "118.70.124.52",
    createdAt: new Date().toISOString(),
  };
  AUDIT_LOGS_REGISTRY.unshift(newLog);
  return newLog;
}

export function recordAuditAction(
  actor: string,
  action: string,
  entityId: string,
  details: string,
  entityType: AdminAuditLogRecord["entityType"] = "system"
) {
  return logAdminMutation({
    actor,
    role: "super_admin",
    action,
    entityType,
    entityId,
    details,
  });
}
