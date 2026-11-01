"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import type { AdminAuditLogRecord } from "../data/audit-store";

interface AuditLogsViewProps {
  initialLogs: AdminAuditLogRecord[];
}

export function AuditLogsView({ initialLogs }: AuditLogsViewProps) {
  const [logs] = useState<AdminAuditLogRecord[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesType = typeFilter === "all" || log.entityType === typeFilter;
    const matchesSearch =
      !search ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
          Nhật ký kiểm toán quản trị (Admin Audit Logs - A030)
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
          Ghi nhận toàn bộ các thao tác nhạy cảm, thay đổi trạng thái đơn hàng, chỉnh sửa giá và phân quyền.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo nội dung, tác nhân, mã đối tượng..."
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          />
          <Search className="w-4 h-4 text-[#786C5E] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#786C5E] shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065] w-full sm:w-auto"
          >
            <option value="all">Tất cả phân hệ ({logs.length})</option>
            <option value="order">Đơn hàng (Order)</option>
            <option value="product">Sản phẩm (Product)</option>
            <option value="category">Danh mục (Category)</option>
            <option value="promotion">Khuyến mãi (Promotion)</option>
            <option value="inventory">Kho bãi (Inventory)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Tác nhân & Vai trò</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Đối tượng</th>
                <th className="py-3 px-4">Chi tiết thao tác</th>
                <th className="py-3 px-4 font-mono">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFEA]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#786C5E]">
                    Không có nhật ký nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 text-[#786C5E] font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#29241E]">{log.actor}</div>
                      <div className="text-[10px] text-[#786C5E] font-mono">{log.role}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#EBF0ED] text-[#5B7065] font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <span className="text-[#5A4033] font-bold">{log.entityId}</span>
                      <span className="text-[10px] text-[#786C5E] block capitalize">({log.entityType})</span>
                    </td>
                    <td className="py-3 px-4 text-[#29241E]">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-[#786C5E] font-mono whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
