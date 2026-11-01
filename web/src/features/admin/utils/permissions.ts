import type {
  AdminRole,
  AdminPermission,
  RoleDefinition,
  AdminSearchRecord,
  AdminTaskRecord,
} from "../types/acl";
import { recordAuditAction } from "../data/audit-store";

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  super_admin: {
    id: "super_admin",
    title: "Super Admin",
    vietnameseTitle: "Quản trị viên cấp cao",
    description: "Toàn quyền quản trị hệ thống, cấu hình mật, phân quyền và sổ cái kiểm toán.",
    permissions: [
      "manage_roles",
      "manage_settings",
      "view_audit_logs",
      "manage_inventory",
      "manage_orders",
      "manage_catalog",
      "manage_promotions",
      "moderate_reviews",
      "reply_support",
    ],
    allowedRoutes: [
      "/admin",
      "/admin/products",
      "/admin/categories",
      "/admin/inventory",
      "/admin/orders",
      "/admin/customers",
      "/admin/promotions",
      "/admin/solutions",
      "/admin/reviews",
      "/admin/support",
      "/admin/spacefit-reports",
      "/admin/audit-logs",
      "/admin/settings",
    ],
  },
  warehouse_staff: {
    id: "warehouse_staff",
    title: "Warehouse Staff",
    vietnameseTitle: "Nhân viên Kho & Giao vận",
    description: "Quản lý xuất nhập tồn, sổ cái biến động kho và cập nhật trạng thái giao đơn.",
    permissions: ["manage_inventory", "manage_orders"],
    // Strictly forbidden: roles, settings, promotions (A034)
    allowedRoutes: [
      "/admin",
      "/admin/inventory",
      "/admin/orders",
    ],
  },
  content_editor: {
    id: "content_editor",
    title: "Content Editor",
    vietnameseTitle: "Biên tập viên Nội dung & Marketing",
    description: "Chỉnh sửa sản phẩm, danh mục, combo SpaceFit, chiến dịch khuyến mãi và duyệt đánh giá.",
    permissions: [
      "manage_catalog",
      "manage_promotions",
      "moderate_reviews",
    ],
    // Strictly forbidden: inventory, orders (A035), roles, settings (A034)
    allowedRoutes: [
      "/admin",
      "/admin/products",
      "/admin/categories",
      "/admin/promotions",
      "/admin/solutions",
      "/admin/reviews",
    ],
  },
  support_agent: {
    id: "support_agent",
    title: "Support Agent",
    vietnameseTitle: "Nhân viên Chăm sóc & Tư vấn",
    description: "Tiếp nhận ticket tư vấn không gian phòng, xử lý hỗ trợ khách hàng và kiểm duyệt phản hồi.",
    permissions: ["reply_support", "moderate_reviews"],
    // Strictly forbidden: inventory, catalog, roles, settings (A034)
    allowedRoutes: [
      "/admin",
      "/admin/support",
      "/admin/reviews",
      "/admin/customers",
    ],
  },
};

/**
 * Checks if a specific role possesses a permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.permissions.includes(permission);
}

/**
 * Checks if a role is allowed to navigate to a route
 */
export function canAccessRoute(role: AdminRole, route: string): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.allowedRoutes.some((allowed) => {
    if (allowed === "/admin") {
      return route === "/admin";
    }
    return route === allowed || route.startsWith(`${allowed}/`);
  });
}

/**
 * Guard assertion helper for Server Actions & API mutations
 */
export function assertPermission(
  role: AdminRole,
  permission: AdminPermission
): { allowed: boolean; error?: string } {
  if (!hasPermission(role, permission)) {
    return {
      allowed: false,
      error: `Truy cập bị từ chối: Vai trò '${role}' không có quyền '${permission}'. Thao tác vi phạm chính sách ACL (A034/A035/A038 Guard).`,
    };
  }
  return { allowed: true };
}

/**
 * A036: Global admin search returns only authorized records
 */
export function filterAdminSearchResults(
  role: AdminRole,
  records: AdminSearchRecord[]
): AdminSearchRecord[] {
  return records.filter((rec) => hasPermission(role, rec.requiredPermission));
}

/**
 * A037: Admin notifications and pending task badges query actual records
 */
export function getAdminTasksForRole(
  role: AdminRole,
  tasks: AdminTaskRecord[]
): AdminTaskRecord[] {
  return tasks.filter((task) => hasPermission(role, task.requiredPermission));
}

/**
 * A038: Protected settings update mutation with immutable audit trail
 */
let demoStoreSettings = {
  storeName: "Small Living 2026 - Không gian nhỏ, Giải pháp lớn",
  supportHotline: "1900-SMALL-2026",
  autoApproveReviews: false,
  inventoryLowStockThresholdDefault: 5,
  maintenanceMode: false,
};

export function getDemoStoreSettings() {
  return { ...demoStoreSettings };
}

export function updateDemoStoreSettings(
  role: AdminRole,
  newSettings: Partial<typeof demoStoreSettings>,
  actor: string
): { success: boolean; settings?: typeof demoStoreSettings; error?: string } {
  // A034 & A038: Strictly require 'manage_settings' permission
  const check = assertPermission(role, "manage_settings");
  if (!check.allowed) {
    return { success: false, error: check.error };
  }

  const previousSettings = { ...demoStoreSettings };
  demoStoreSettings = { ...demoStoreSettings, ...newSettings };

  // A038: Audit trail recording
  recordAuditAction(
    actor,
    "system_settings_update",
    "SETTINGS-STORE",
    `Cập nhật cấu hình cửa hàng (${Object.keys(previousSettings).length} tham số): ${Object.keys(newSettings).join(", ")} (A038 Audit)`
  );

  return { success: true, settings: demoStoreSettings };
}
