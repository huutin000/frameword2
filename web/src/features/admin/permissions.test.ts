import { describe, it, expect } from "vitest";
import {
  hasPermission,
  assertPermission,
  filterAdminSearchResults,
  getAdminTasksForRole,
  updateDemoStoreSettings,
  getDemoStoreSettings,
} from "./utils/permissions";
import type { AdminSearchRecord, AdminTaskRecord } from "./types/acl";
import { adjustStockAction } from "./actions/inventory-actions";
import { updateAdminOrderStatus } from "./actions/order-actions";
import { createPromotionAction } from "./actions/promotion-actions";
import { getAllAuditLogs } from "./data/audit-store";

describe("Phần 3 ACL: Multi-Role Access Control (A034, A035, A036, A037, A038)", () => {
  describe("A034: Staff cannot manage roles, secrets, settings or promotions", () => {
    it("denies warehouse_staff from managing roles, settings and promotions", () => {
      expect(hasPermission("warehouse_staff", "manage_roles")).toBe(false);
      expect(hasPermission("warehouse_staff", "manage_settings")).toBe(false);
      expect(hasPermission("warehouse_staff", "manage_promotions")).toBe(false);
      expect(hasPermission("warehouse_staff", "view_audit_logs")).toBe(false);

      const checkRoles = assertPermission("warehouse_staff", "manage_roles");
      expect(checkRoles.allowed).toBe(false);
      expect(checkRoles.error).toContain("Truy cập bị từ chối");

      const checkSettings = assertPermission("warehouse_staff", "manage_settings");
      expect(checkSettings.allowed).toBe(false);
    });

    it("prevents warehouse_staff from creating promotions via Server Action", async () => {
      const res = await createPromotionAction(
        {
          code: "STAFFHACK26",
          discountPercent: 50,
          maxDiscountVnd: 500000,
          minOrderVnd: 0,
          usageLimit: 10,
          isActive: true,
          startDate: "2026-11-01",
          endDate: "2026-12-01",
          description: "Unauthorized promo creation attempt",
        },
        "warehouse_staff"
      );

      expect(res.success).toBe(false);
      expect(res.error).toContain("A034");
    });
  });

  describe("A035: Content editor cannot change inventory or modify orders", () => {
    it("denies content_editor permissions to manage inventory or orders", () => {
      expect(hasPermission("content_editor", "manage_inventory")).toBe(false);
      expect(hasPermission("content_editor", "manage_orders")).toBe(false);

      const checkInv = assertPermission("content_editor", "manage_inventory");
      expect(checkInv.allowed).toBe(false);
      expect(checkInv.error).toContain("A035");
    });

    it("prevents content_editor from adjusting stock via Server Action", async () => {
      const res = await adjustStockAction(
        "SL-P1-101",
        10,
        "import",
        "PO-ILLEGAL",
        "Unauthorized stock change",
        "content_editor"
      );

      expect(res.success).toBe(false);
      expect(res.error).toContain("A035");
    });

    it("prevents content_editor from updating order status via Server Action", async () => {
      const res = await updateAdminOrderStatus(
        "SL-2026-001",
        "cancelled",
        "Unauthorized cancellation",
        "content_editor"
      );

      expect(res.success).toBe(false);
      expect(res.error).toContain("A035");
    });
  });

  describe("A036: Global admin search returns only authorized records", () => {
    const mockSearchResults: AdminSearchRecord[] = [
      {
        id: "p1",
        title: "Kệ Đứng Chống Trần 600mm",
        category: "product",
        href: "/admin/products/p1",
        requiredPermission: "manage_catalog",
      },
      {
        id: "inv-1",
        title: "Sổ cái tồn kho SL-P1-101",
        category: "inventory",
        href: "/admin/inventory",
        requiredPermission: "manage_inventory",
      },
      {
        id: "promo-1",
        title: "Mã giảm giá NOITHATNHO",
        category: "setting",
        href: "/admin/promotions",
        requiredPermission: "manage_promotions",
      },
      {
        id: "audit-1",
        title: "Nhật ký kiểm toán hệ thống",
        category: "audit",
        href: "/admin/audit-logs",
        requiredPermission: "view_audit_logs",
      },
    ];

    it("returns all records for super_admin", () => {
      const filtered = filterAdminSearchResults("super_admin", mockSearchResults);
      expect(filtered.length).toBe(4);
    });

    it("filters out catalog, promotions, and audit records for warehouse_staff", () => {
      const filtered = filterAdminSearchResults("warehouse_staff", mockSearchResults);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe("inv-1");
    });

    it("filters out inventory and audit records for content_editor", () => {
      const filtered = filterAdminSearchResults("content_editor", mockSearchResults);
      expect(filtered.map((r) => r.id)).toEqual(["p1", "promo-1"]);
    });

    it("returns zero results for support_agent when none match support permissions", () => {
      const filtered = filterAdminSearchResults("support_agent", mockSearchResults);
      expect(filtered.length).toBe(0);
    });
  });

  describe("A037: Admin notifications/tasks query actual records", () => {
    const mockTasks: AdminTaskRecord[] = [
      {
        id: "task-inv-low",
        title: "Cảnh báo tồn kho",
        description: "3 sản phẩm dưới định mức an toàn",
        type: "inventory_alert",
        priority: "high",
        relatedCount: 3,
        href: "/admin/inventory",
        requiredPermission: "manage_inventory",
      },
      {
        id: "task-reviews",
        title: "Đánh giá chờ duyệt",
        description: "2 phản hồi của khách hàng cần kiểm duyệt",
        type: "review_moderation",
        priority: "medium",
        relatedCount: 2,
        href: "/admin/reviews",
        requiredPermission: "moderate_reviews",
      },
      {
        id: "task-support",
        title: "Ticket hỗ trợ khách hàng",
        description: "1 yêu cầu tư vấn kích thước phòng trọ",
        type: "support_ticket",
        priority: "high",
        relatedCount: 1,
        href: "/admin/support",
        requiredPermission: "reply_support",
      },
    ];

    it("allows warehouse_staff to see inventory tasks but not support/review tasks", () => {
      const tasks = getAdminTasksForRole("warehouse_staff", mockTasks);
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe("task-inv-low");
    });

    it("allows content_editor to see review tasks but not inventory/support tasks", () => {
      const tasks = getAdminTasksForRole("content_editor", mockTasks);
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe("task-reviews");
    });

    it("allows support_agent to see both review and support tasks", () => {
      const tasks = getAdminTasksForRole("support_agent", mockTasks);
      expect(tasks.length).toBe(2);
      expect(tasks.map((t) => t.id)).toEqual(["task-reviews", "task-support"]);
    });
  });

  describe("A038: Settings DEMO store change protected and audited", () => {
    it("fails when non-super_admin tries to mutate store settings", () => {
      const res = updateDemoStoreSettings(
        "warehouse_staff",
        { storeName: "Tampered Name" },
        "Warehouse Staff User"
      );

      expect(res.success).toBe(false);
      expect(res.error).toContain("A038");
    });

    it("succeeds for super_admin and records immutable audit log", () => {
      const initialLogsCount = getAllAuditLogs().length;

      const res = updateDemoStoreSettings(
        "super_admin",
        { maintenanceMode: true },
        "Admin (Super Admin Hoang)"
      );

      expect(res.success).toBe(true);
      expect(getDemoStoreSettings().maintenanceMode).toBe(true);

      const logsAfter = getAllAuditLogs();
      expect(logsAfter.length).toBe(initialLogsCount + 1);
      expect(logsAfter[0].action).toBe("system_settings_update");
      expect(logsAfter[0].details).toContain("A038 Audit");
    });
  });
});
