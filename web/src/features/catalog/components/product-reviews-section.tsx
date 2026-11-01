"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquare, Plus, Home } from "lucide-react";
import {
  getApprovedReviews,
  getProductRatingSummary,
  submitProductReview,
} from "../data/review-store";
import { Button } from "@/components/ui/button";

interface Props {
  productId: string;
}

export function ProductReviewsSection({ productId }: Props) {
  const [reviews, setReviews] = useState(() => getApprovedReviews(productId));
  const [summary, setSummary] = useState(() => getProductRatingSummary(productId));
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [spaceType, setSpaceType] = useState("Phòng trọ 15m²");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    submitProductReview({
      productId,
      userName: userName || "Khách hàng xác thực",
      rating,
      spaceType,
      title,
      comment,
    });

    setReviews(getApprovedReviews(productId));
    setSummary(getProductRatingSummary(productId));
    setShowForm(false);
    setTitle("");
    setComment("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <section className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header & Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D6]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#29241E]">
              Đánh giá thực tế từ người dùng căn hộ nhỏ
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF0ED] text-[#5B7065] font-semibold border border-[#C5D3CC]">
              {reviews.length} đánh giá
            </span>
          </div>
          <p className="text-xs text-[#786C5E] mt-1">
            Đánh giá trung thực về độ vừa vặn, tính năng không khoan tường và giải phóng không gian
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(summary.average) ? "fill-current" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-base font-bold text-[#29241E]">
              {summary.average > 0 ? summary.average.toFixed(1) : "5.0"}
            </span>
            <span className="text-xs text-[#786C5E]">/ 5</span>
          </div>

          {!showForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Viết đánh giá</span>
            </Button>
          )}
        </div>
      </div>

      {submittedMessage && (
        <div className="p-3 rounded-xl bg-[#EBF0ED] border border-[#C5D3CC] text-xs text-[#5B7065] flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Cảm ơn bạn! Đánh giá trải nghiệm không gian của bạn đã được ghi nhận.</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#29241E] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#5B7065]" />
              <span>Chia sẻ trải nghiệm lắp đặt trong phòng của bạn</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#786C5E] hover:text-[#29241E] text-xs"
            >
              Hủy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#5A4033] mb-1 font-medium">Tên của bạn</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Hải Đăng"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
              />
            </div>
            <div>
              <label className="block text-[#5A4033] mb-1 font-medium">Kiểu phòng sử dụng</label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
              >
                <option>Phòng trọ 12m² gác xép</option>
                <option>Phòng trọ 15m²</option>
                <option>Studio 20m²</option>
                <option>Chung cư mini 25m²</option>
                <option>Góc làm việc 1m²</option>
                <option>Nhà bếp hẹp</option>
              </select>
            </div>
            <div>
              <label className="block text-[#5A4033] mb-1 font-medium">Số sao đánh giá</label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating ? "text-amber-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#5A4033] mb-1 font-medium">Tiêu đề đánh giá *</label>
            <input
              type="text"
              required
              placeholder="VD: Kê vừa khít góc 80cm, không cần khoan tường"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
            />
          </div>

          <div>
            <label className="block text-[#5A4033] mb-1 font-medium">Nội dung chi tiết *</label>
            <textarea
              required
              rows={3}
              placeholder="Chia sẻ về độ tiện dụng, việc lắp ráp và hiệu quả tiết kiệm diện tích..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="sm">
              Đăng đánh giá
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Đóng
            </Button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-[#786C5E] py-4 text-center">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ cảm nhận!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#29241E]">{rev.userName}</span>
                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#5B7065] font-semibold bg-[#EBF0ED] px-2 py-0.5 rounded-full border border-[#C5D3CC]">
                      <CheckCircle className="w-3 h-3" />
                      <span>Đã mua hàng</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#5A4033] bg-white px-2 py-0.5 rounded-full border border-[#D3C7B7]">
                    <Home className="w-3 h-3 text-[#786C5E]" />
                    <span>{rev.spaceType}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-current" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-sm text-[#29241E]">{rev.title}</h4>
              <p className="text-[#5A4033] leading-relaxed">{rev.comment}</p>

              <span className="text-[10px] text-[#786C5E] block pt-1">
                {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

