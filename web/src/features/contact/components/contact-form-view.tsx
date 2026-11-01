"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupportTicket, type SupportTicket } from "../data/support-store";

export function ContactFormView() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomType, setRoomType] = useState("Phòng trọ cho thuê (dưới 15m²)");
  const [dimensions, setDimensions] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !problemDescription.trim()) return;

    const tkt = createSupportTicket({
      fullName,
      phone,
      roomType,
      dimensions,
      problemDescription,
    });

    setCreatedTicket(tkt);
    setFullName("");
    setPhone("");
    setDimensions("");
    setProblemDescription("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold border border-[#C5D3CC]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tư vấn không gian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn
        </h1>
        <p className="text-sm text-[#786C5E]">
          Gửi số đo căn phòng hoặc kích thước khe hẹp của bạn để nhận bản vẽ đề xuất bài trí miễn phí trong 24 giờ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-[#29241E] pb-3 border-b border-[#E7E0D6]">
            Thông tin kết nối Small Living
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#5A4033]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#29241E] font-semibold">Studio trưng bày trải nghiệm:</strong>
                <span>Tầng 3, Tòa nhà Sáng Tạo, 88 Phố Dịch Vọng Hậu, Cầu Giấy, Hà Nội</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#29241E] font-semibold">Hotline hỗ trợ kỹ thuật:</strong>
                <span className="font-mono font-bold text-[#5B7065]">1900 6826</span>
                <span className="text-xs text-[#786C5E] block">(8:00 – 21:00 hàng ngày)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#29241E] font-semibold">Email tiếp nhận số đo & bản vẽ:</strong>
                <span className="font-mono">spacefit@smallliving.vn</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#29241E] font-semibold">Giờ mở cửa đón khách thử nghiệm:</strong>
                <span>Thứ 2 – Chủ Nhật: 9:00 – 20:30</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E0D6] flex items-center gap-2 text-xs text-[#786C5E]">
            <ShieldCheck className="w-4 h-4 text-[#5B7065]" />
            <span>Tư vấn trung thực, không ép mua nếu phòng không phù hợp</span>
          </div>
        </div>

        {/* Right: Contact Form / Ticket Confirmation */}
        <div className="lg:col-span-7 space-y-4">
          {createdTicket && (
            <div className="p-5 rounded-2xl bg-[#EBF0ED] border border-[#C5D3CC] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#5B7065]" />
                  <strong className="text-sm font-bold text-[#29241E]">
                    Yêu cầu tư vấn đã được tiếp nhận thành công!
                  </strong>
                </div>
                <span className="font-mono text-xs font-bold bg-white text-[#5B7065] px-2.5 py-1 rounded-full border border-[#C5D3CC]">
                  {createdTicket.id}
                </span>
              </div>
              <p className="text-xs text-[#5A4033]">
                Mã hỗ trợ của bạn là <strong className="font-mono text-[#5B7065]">{createdTicket.id}</strong>. Đội ngũ kiến trúc sư Small Living sẽ đối chiếu số đo <code className="bg-white/80 px-1 py-0.5 rounded font-mono">{createdTicket.dimensions}</code> và phản hồi qua số điện thoại <strong className="font-mono">{createdTicket.phone}</strong> trong vòng 24 giờ.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <h2 className="text-base font-bold text-[#29241E] pb-2 border-b border-[#E7E0D6]">
              Gửi yêu cầu tư vấn kích thước
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Họ và tên của bạn *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Phương Thảo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Số điện thoại / Zalo *</label>
                <input
                  type="tel"
                  required
                  placeholder="0987 654 321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Loại căn phòng</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                >
                  <option>Phòng trọ cho thuê (dưới 15m²)</option>
                  <option>Căn hộ Studio mini (15m² - 25m²)</option>
                  <option>Góc làm việc tại nhà (Home Office)</option>
                  <option>Nhà bếp hẹp</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A4033] mb-1">Kích thước ước tính (Dài x Rộng x Cao)</label>
                <input
                  type="text"
                  placeholder="VD: 3.2m x 2.8m, trần 2.6m"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Vấn đề không gian bạn đang gặp phải *</label>
              <textarea
                required
                rows={3}
                placeholder="VD: Chủ nhà không cho khoan đục tường, muốn có bàn làm việc nhưng phòng ngủ quá chật..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="gap-2 font-bold text-xs shadow-xs">
              <Send className="w-3.5 h-3.5" />
              <span>Gửi yêu cầu bài trí & Nhận mã Ticket</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
