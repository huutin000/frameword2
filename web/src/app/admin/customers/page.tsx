"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Mail, Phone, Home } from "lucide-react";
import { getAllAdminCustomers } from "@/features/admin/data/customer-store";
import { formatVND } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers] = useState(() => getAllAdminCustomers());
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E0D6]">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-[#786C5E] hover:text-[#29241E]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold text-[#29241E]">
              Quản Lý Khách Hàng (A031)
            </h1>
          </div>
          <p className="text-xs text-[#786C5E] mt-1">
            Danh sách khách hàng, hồ sơ phòng liên kết và tổng chi tiêu giải pháp nội thất
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm theo tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D3C7B7] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          />
          <Search className="w-3.5 h-3.5 text-[#786C5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[#786C5E] uppercase border-b border-[#E7E0D6]">
              <tr>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4">Hồ sơ phòng ưu tiên</th>
                <th className="py-3 px-4 text-center">Đơn hàng</th>
                <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D6]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="block text-[#29241E] font-semibold">{c.fullName}</strong>
                    <span className="font-mono text-[10px] text-[#786C5E]">{c.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-[#5A4033]">
                      <Mail className="w-3 h-3 text-[#786C5E]" />
                      <span className="font-mono">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#786C5E] mt-0.5 font-mono">
                      <Phone className="w-3 h-3" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D3C7B7] text-[#5A4033] text-[11px]">
                      <Home className="w-3 h-3 text-[#786C5E]" />
                      <span>{c.spacePreset}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-[#29241E]">{c.orderCount}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <strong className="font-mono text-[#5B7065] text-sm font-bold">
                      {formatVND(c.totalSpent)}
                    </strong>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0ED] text-[#5B7065] border border-[#C5D3CC]">
                      Hoạt động
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
