import React from "react";
import { getAllAuditLogs } from "@/features/admin/data/audit-store";
import { AuditLogsView } from "@/features/admin/components/audit-logs-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nhật ký kiểm toán | Admin Small Living",
  description: "Lịch sử thao tác quản trị và thay đổi trạng thái nhạy cảm trên hệ thống.",
};

export default function AdminAuditLogsPage() {
  const logs = getAllAuditLogs();

  return <AuditLogsView initialLogs={logs} />;
}

