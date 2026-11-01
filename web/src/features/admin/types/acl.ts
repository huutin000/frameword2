export type AdminRole =
  | "super_admin"
  | "warehouse_staff"
  | "content_editor"
  | "support_agent";

export type AdminPermission =
  | "manage_roles"       // Only super_admin (A034)
  | "manage_settings"    // Only super_admin (A034, A038)
  | "view_audit_logs"    // Only super_admin
  | "manage_inventory"   // super_admin, warehouse_staff (NOT content_editor A035)
  | "manage_orders"      // super_admin, warehouse_staff (NOT content_editor A035)
  | "manage_catalog"     // super_admin, content_editor (NOT warehouse_staff)
  | "manage_promotions"  // super_admin, content_editor (NOT warehouse_staff A034)
  | "moderate_reviews"   // super_admin, content_editor, support_agent
  | "reply_support";     // super_admin, support_agent

export interface RoleDefinition {
  id: AdminRole;
  title: string;
  vietnameseTitle: string;
  description: string;
  permissions: AdminPermission[];
  allowedRoutes: string[];
}

export interface AdminSearchRecord {
  id: string;
  title: string;
  category: "product" | "order" | "inventory" | "customer" | "audit" | "setting";
  href: string;
  requiredPermission: AdminPermission;
}

export interface AdminTaskRecord {
  id: string;
  title: string;
  description: string;
  type: "inventory_alert" | "order_pending" | "support_ticket" | "review_moderation";
  priority: "high" | "medium" | "low";
  relatedCount: number;
  href: string;
  requiredPermission: AdminPermission;
}

