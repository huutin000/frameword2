"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowLeft,
  Phone,
  Filter,
} from "lucide-react";
import {
  getAllSupportTickets,
  updateSupportTicketStatus,
  type SupportTicket,
} from "@/features/contact/data/support-store";
import { logAdminMutation } from "@/features/admin/data/audit-store";
import { Button } from "@/components/ui/button";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getAllSupportTickets());
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in_progress" | "resolved">("all");
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const filtered = tickets.filter((t) => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  const handleUpdateStatus = (ticketId: string, status: SupportTicket["status"]) => {
    const reply = replyText[ticketId];
    updateSupportTicketStatus(ticketId, status, reply);
    setTickets(getAllSupportTickets());

    logAdminMutation({
      actor: "admin@smallliving.vn",
      role: "admin",
      action: "SUPPORT_TICKET_UPDATED",
      entityType: "system",
      entityId: ticketId,
      details: `Cập nhật trạng thái ticket sang ${status}: ${reply || ""}`,
    });
  };

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
              Hộp Thư Tư Vấn Không Gian (A033)
            </h1>
          </div>
          <p className="text-xs text-[#786C5E] mt-1">
            Tiếp nhận yêu cầu tư vấn kích thước phòng nhỏ, khe hẹp và phản hồi giải pháp bài trí
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#786C5E]" />
          {(["all", "pending", "in_progress", "resolved"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                statusFilter === st
                  ? "bg-[#5B7065] text-white border-[#5B7065]"
                  : "bg-white text-[#5A4033] border-[#D3C7B7] hover:bg-[#FAF8F5]"
              }`}
            >
              {st === "all" ? "Tất cả" : st === "pending" ? "Chờ xử lý" : st === "in_progress" ? "Đang tư vấn" : "Đã xong"}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-[#E7E0D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E0D6]">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#5B7065] text-sm">
                  {ticket.id}
                </span>
                <span className="font-bold text-[#29241E] text-sm">{ticket.fullName}</span>
                <span className="text-[#786C5E] flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" />
                  {ticket.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ticket.status === "resolved"
                      ? "bg-[#EBF0ED] text-[#5B7065] border border-[#C5D3CC]"
                      : ticket.status === "in_progress"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {ticket.status === "resolved" ? "Đã giải quyết" : ticket.status === "in_progress" ? "Đang tư vấn" : "Chờ xử lý"}
                </span>
                <span className="text-[10px] text-[#786C5E]">
                  {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E0D6]">
              <div>
                <span className="text-[11px] text-[#786C5E] block">Kiểu phòng:</span>
                <strong className="text-xs text-[#29241E]">{ticket.roomType}</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#786C5E] block">Kích thước đo đạc:</span>
                <strong className="text-xs text-[#29241E] font-mono">{ticket.dimensions}</strong>
              </div>
              <div className="md:col-span-1">
                <span className="text-[11px] text-[#786C5E] block">Vấn đề phản ánh:</span>
                <p className="text-xs text-[#5A4033] line-clamp-2">{ticket.problemDescription}</p>
              </div>
            </div>

            {ticket.adminReply && (
              <div className="p-3 bg-[#EBF0ED] border border-[#C5D3CC] rounded-xl text-[#3E5247]">
                <strong className="block text-[11px] text-[#5B7065] font-semibold mb-0.5">
                  Phản hồi từ Kiến trúc sư Small Living:
                </strong>
                <p className="text-xs">{ticket.adminReply}</p>
              </div>
            )}

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <input
                type="text"
                placeholder="Ghi chú giải pháp hoặc nội dung tư vấn..."
                value={replyText[ticket.id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                }
                className="flex-1 bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-1.5 text-xs text-[#29241E]"
              />

              <div className="flex items-center gap-2">
                {ticket.status !== "in_progress" && ticket.status !== "resolved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(ticket.id, "in_progress")}
                    className="text-xs h-8"
                  >
                    Nhận tư vấn
                  </Button>
                )}
                {ticket.status !== "resolved" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(ticket.id, "resolved")}
                    className="text-xs h-8 gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hoàn tất ticket</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
