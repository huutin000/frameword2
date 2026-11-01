import React from "react";
import { CheckCircle2, Clock, Package, Truck, Home, XCircle } from "lucide-react";
import type { OrderStatus, OrderEventRecord } from "../types";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  events: OrderEventRecord[];
}

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "placed", label: "Đã đặt hàng", icon: Clock },
  { status: "processing", label: "Đang đóng gói", icon: Package },
  { status: "shipped", label: "Đang giao vận", icon: Truck },
  { status: "delivered", label: "Đã giao thành công", icon: Home },
];

export function OrderTimeline({ currentStatus, events }: OrderTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <div className="p-4 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl flex items-center gap-3 text-[#A05C52]">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <div className="font-bold text-sm">Đơn hàng đã bị hủy</div>
          <p className="text-xs text-[#7A362D] mt-0.5">
            Sản phẩm đã được hoàn trả lại tồn kho. Quý khách vui lòng liên hệ hotline nếu cần hỗ trợ thêm.
          </p>
        </div>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = ["placed", "processing", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper */}
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#E7E0D6] -translate-y-1/2 z-0" />
        <div
          className="hidden sm:block absolute top-1/2 left-0 h-0.5 bg-[#5B7065] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={step.status}
                className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs shrink-0 ${
                    isCompleted
                      ? "bg-[#5B7065] text-white ring-4 ring-[#EBF0ED]"
                      : "bg-white text-[#786C5E] border-2 border-[#D3C7B7]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>

                <div>
                  <div
                    className={`text-xs sm:text-sm font-semibold ${
                      isCurrent
                        ? "text-[#5B7065]"
                        : isCompleted
                        ? "text-[#29241E]"
                        : "text-[#786C5E]"
                    }`}
                  >
                    {step.label}
                  </div>
                  {isCurrent && (
                    <div className="text-[11px] text-[#5B7065] font-medium hidden sm:block">
                      (Hiện tại)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Timeline */}
      <div className="pt-4 border-t border-[#E7E0D6] space-y-3">
        <h3 className="text-xs font-bold text-[#5A4033] uppercase tracking-wider">
          Nhật ký hành trình đơn hàng
        </h3>
        <div className="space-y-2">
          {events
            .slice()
            .reverse()
            .map((evt) => (
              <div
                key={evt.id}
                className="p-3 bg-[#FAF8F5] border border-[#E7E0D6] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      evt.toStatus === "delivered"
                        ? "bg-green-600"
                        : evt.toStatus === "cancelled"
                        ? "bg-red-600"
                        : "bg-[#5B7065]"
                    }`}
                  />
                  <span className="font-semibold text-[#29241E]">{evt.note}</span>
                </div>
                <div className="text-[#786C5E] text-[11px] font-mono shrink-0">
                  {new Date(evt.createdAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

