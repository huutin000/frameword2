"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  Filter,
} from "lucide-react";
import {
  getAllReviews,
  moderateReview,
  type ProductReview,
} from "@/features/catalog/data/review-store";
import { logAdminMutation } from "@/features/admin/data/audit-store";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(() => getAllReviews());
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  const filtered = reviews.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const handleAction = (reviewId: string, action: "approve" | "reject") => {
    moderateReview(reviewId, action);
    setReviews(getAllReviews());

    logAdminMutation({
      actor: "admin@smallliving.vn",
      role: "admin",
      action: action === "approve" ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
      entityType: "product",
      entityId: reviewId,
      details: `Cập nhật trạng thái đánh giá: ${action === "approve" ? "approved" : "rejected"}`,
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
              Kiểm Duyệt Đánh Giá Khách Hàng (A032)
            </h1>
          </div>
          <p className="text-xs text-[#786C5E] mt-1">
            Duyệt và kiểm soát phản hồi thực tế về kích thước không gian, tránh spam hoặc ngôn từ không phù hợp
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#786C5E]" />
          {(["all", "approved", "pending", "rejected"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                statusFilter === st
                  ? "bg-[#5B7065] text-white border-[#5B7065]"
                  : "bg-white text-[#5A4033] border-[#D3C7B7] hover:bg-[#FAF8F5]"
              }`}
            >
              {st === "all" ? "Tất cả" : st === "approved" ? "Đã duyệt" : st === "pending" ? "Chờ duyệt" : "Bị từ chối"}
            </button>
          ))}
        </div>
      </div>

      {/* Review list table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[#786C5E] uppercase border-b border-[#E7E0D6]">
              <tr>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Đánh giá & Kiểu phòng</th>
                <th className="py-3 px-4">Nội dung nhận xét</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D6]">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="block text-[#29241E]">{rev.userName}</strong>
                    <span className="text-[10px] text-[#786C5E]">
                      {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#5B7065]">
                    {rev.productId.toUpperCase()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? "fill-current" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#5A4033] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E7E0D6]">
                      {rev.spaceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <strong className="block text-[#29241E] mb-0.5">{rev.title}</strong>
                    <p className="text-[#5A4033] line-clamp-2">{rev.comment}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rev.status === "approved"
                          ? "bg-[#EBF0ED] text-[#5B7065] border border-[#C5D3CC]"
                          : rev.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {rev.status === "approved" ? "Đã duyệt" : rev.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {rev.status !== "approved" && (
                      <button
                        onClick={() => handleAction(rev.id, "approve")}
                        className="px-2 py-1 rounded bg-[#EBF0ED] hover:bg-[#DCE5E0] text-[#5B7065] font-semibold text-[11px] transition-colors"
                        title="Phê duyệt đánh giá"
                      >
                        Duyệt
                      </button>
                    )}
                    {rev.status !== "rejected" && (
                      <button
                        onClick={() => handleAction(rev.id, "reject")}
                        className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[11px] transition-colors"
                        title="Từ chối / Ẩn"
                      >
                        Từ chối
                      </button>
                    )}
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
