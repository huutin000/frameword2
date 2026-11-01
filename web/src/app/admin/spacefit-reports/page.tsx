"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Ruler,
  Home,
} from "lucide-react";

export default function AdminSpaceFitReportsPage() {
  const fitMetrics = {
    totalEvaluations: 1420,
    fitPercent: 74,
    mayFitPercent: 21,
    doesNotFitPercent: 5,
  };

  const topRooms = [
    { name: "Phòng trọ 15m² gác xép", count: 540, share: "38%" },
    { name: "Studio 12m²", count: 412, share: "29%" },
    { name: "Góc làm việc mini 0.8m²", count: 285, share: "20%" },
    { name: "Góc bếp mini 120cm", count: 183, share: "13%" },
  ];

  const topBottlenecks = [
    {
      issue: "Quy định cấm khoan đục tường của chủ nhà",
      frequency: "68% đơn yêu cầu",
      solution: "Đẩy mạnh dòng sản phẩm chân kẹp & cây chống trần lò xo",
    },
    {
      issue: "Lối đi hẹp dưới 600mm sau khi kê đồ",
      frequency: "42% phòng khách/ngủ",
      solution: "Đề xuất nội thất gấp gọn và ghế giấu hoàn toàn dưới gầm bàn",
    },
    {
      issue: "Chiều cao trần thấp dưới 2400mm (gác lửng)",
      frequency: "31% phòng trọ",
      solution: "Giới hạn chiều cao kệ đứng tối đa 1800mm",
    },
  ];

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
              Báo Cáo Thuật Toán SpaceFit™ & Không Gian (A034)
            </h1>
          </div>
          <p className="text-xs text-[#786C5E] mt-1">
            Phân tích số đo thực tế, tỷ lệ vừa vặn và các điểm nghẽn diện tích phổ biến của người thuê nhà
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E0D6] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#786C5E] text-xs">
            <span>Tổng lượt tính toán SpaceFit</span>
            <Compass className="w-4 h-4 text-[#5B7065]" />
          </div>
          <div className="text-2xl font-bold text-[#29241E] mt-2 font-mono">
            {fitMetrics.totalEvaluations.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#5B7065] font-semibold mt-1 block">
            ↑ 18% so với tháng trước
          </span>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#786C5E] text-xs">
            <span>Vừa vặn (FIT)</span>
            <CheckCircle2 className="w-4 h-4 text-[#5B7065]" />
          </div>
          <div className="text-2xl font-bold text-[#5B7065] mt-2 font-mono">
            {fitMetrics.fitPercent}%
          </div>
          <span className="text-[10px] text-[#786C5E] mt-1 block">
            Không cản trở lối đi & đạt trần
          </span>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#786C5E] text-xs">
            <span>Cần xoay / Lưu ý (MAY_FIT)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">
            {fitMetrics.mayFitPercent}%
          </div>
          <span className="text-[10px] text-[#786C5E] mt-1 block">
            Cần xoay 90° hoặc lối đi 500-600mm
          </span>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#786C5E] text-xs">
            <span>Không vừa (DOES_NOT_FIT)</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2 font-mono">
            {fitMetrics.doesNotFitPercent}%
          </div>
          <span className="text-[10px] text-[#786C5E] mt-1 block">
            Cứu khách khỏi mua nhầm đồ quá khổ
          </span>
        </div>
      </div>

      {/* Grid: Room Distribution + Bottlenecks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Rooms */}
        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#29241E] flex items-center gap-2 pb-2 border-b border-[#E7E0D6]">
            <Home className="w-4 h-4 text-[#5B7065]" />
            <span>Phân bố loại phòng người dùng</span>
          </h2>

          <div className="space-y-3">
            {topRooms.map((room) => (
              <div key={room.name} className="space-y-1">
                <div className="flex justify-between text-xs text-[#29241E]">
                  <span className="font-medium">{room.name}</span>
                  <span className="font-mono text-[#786C5E]">
                    {room.count} lượt ({room.share})
                  </span>
                </div>
                <div className="w-full h-2 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E7E0D6]">
                  <div
                    className="h-full bg-[#5B7065] rounded-full"
                    style={{ width: room.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Insights */}
        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#29241E] flex items-center gap-2 pb-2 border-b border-[#E7E0D6]">
            <Ruler className="w-4 h-4 text-[#5B7065]" />
            <span>Điểm nghẽn không gian thực tế</span>
          </h2>

          <div className="space-y-3 text-xs">
            {topBottlenecks.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-1"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-[#29241E]">{b.issue}</strong>
                  <span className="font-mono font-bold text-[10px] text-[#A05C52]">
                    {b.frequency}
                  </span>
                </div>
                <p className="text-[#5A4033] text-[11px]">
                  <strong>Đề xuất nhập hàng:</strong> {b.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
