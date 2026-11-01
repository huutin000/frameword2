import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, ShieldCheck, RefreshCw, Truck, Mail, Phone } from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E7E0D6] mt-20 text-[#29241E]">
      {/* Value Proposition Highlights */}
      <div className="border-b border-[#E7E0D6] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#EBF0ED] text-[#5B7065] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#29241E]">Đo đạc SpaceFit 2026</h4>
              <p className="text-xs text-[#786C5E] mt-0.5">Kiểm tra kích thước đồ đạc vừa vặn theo từng milimet phòng.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#5A4033] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#29241E]">100% Không Khoan Tường</h4>
              <p className="text-xs text-[#786C5E] mt-0.5">Chân đế tăng giảm, giác hút trợ lực, bảo vệ nguyên trạng phòng thuê.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#F9EBE7] text-[#B85D43] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#29241E]">Tháo Lắp & Tái Sử Dụng</h4>
              <p className="text-xs text-[#786C5E] mt-0.5">Thiết kế module tháo rời trong 15 phút khi cần chuyển trọ.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#F3EFEA] text-[#786C5E] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#29241E]">Giao Hàng Mô Phỏng (DEMO)</h4>
              <p className="text-xs text-[#786C5E] mt-0.5">Toàn bộ quy trình đặt hàng và vận chuyển đều là kịch bản demo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Image
            src="/brand/small-living-logo.svg"
            alt="Small Living Logo"
            width={180}
            height={42}
            className="h-8 w-auto"
          />
          <p className="text-xs text-[#786C5E] leading-relaxed pr-4">
            Nền tảng thương mại điện tử chuyên sâu cho không gian sống giới hạn: phòng trọ, căn hộ mini, góc làm việc và nhà bếp hẹp. Kết hợp công nghệ mô phỏng 2D/3D và thuật toán đo độ vừa vặn SpaceFit.
          </p>
          <div className="space-y-1.5 text-xs text-[#786C5E]">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5B7065]" />
              <span>demo.contact@smallliving.local</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#5B7065]" />
              <span>Hotline kỹ thuật: 1900 2026 (Demo)</span>
            </p>
          </div>
        </div>

        {/* Room Categories */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#29241E] mb-3">Giải pháp theo phòng</h5>
          <ul className="space-y-2 text-xs text-[#786C5E]">
            <li><Link href="/catalog?room=studio" className="hover:text-[#5B7065] transition-colors">Phòng trọ & Studio</Link></li>
            <li><Link href="/catalog?room=bedroom" className="hover:text-[#5B7065] transition-colors">Phòng ngủ nhỏ</Link></li>
            <li><Link href="/catalog?room=workspace" className="hover:text-[#5B7065] transition-colors">Góc làm việc mini</Link></li>
            <li><Link href="/catalog?room=kitchen" className="hover:text-[#5B7065] transition-colors">Nhà bếp hẹp</Link></li>
            <li><Link href="/catalog?room=balcony" className="hover:text-[#5B7065] transition-colors">Ban công & Giặt sấy</Link></li>
          </ul>
        </div>

        {/* Tools & Planning */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#29241E] mb-3">Công cụ không gian</h5>
          <ul className="space-y-2 text-xs text-[#786C5E]">
            <li><Link href="/shop-the-room" className="hover:text-[#5B7065] transition-colors font-medium text-[#C1623C]">Shop The Room (Hotspots)</Link></li>
            <li><Link href="/solutions" className="hover:text-[#5B7065] transition-colors font-medium text-[#5B7065]">Solution Bundle Builder</Link></li>
            <li><Link href="/planner" className="hover:text-[#5B7065] transition-colors font-medium text-[#5A4033]">2D Room Planner</Link></li>
            <li><Link href="/room-profile" className="hover:text-[#5B7065] transition-colors">Hồ sơ đo đạc phòng</Link></li>
            <li><Link href="/compare" className="hover:text-[#5B7065] transition-colors">So sánh kích thước mm</Link></li>
            <li><Link href="/admin" className="hover:text-[#5B7065] transition-colors text-[#5B7065] font-medium">Cổng Quản trị Admin</Link></li>
          </ul>
        </div>

        {/* Legal & Info */}
        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#29241E] mb-3">Về chúng tôi & Trợ giúp</h5>
          <ul className="space-y-2 text-xs text-[#786C5E]">
            <li><Link href="/about" className="hover:text-[#5B7065] transition-colors">Giới thiệu thương hiệu</Link></li>
            <li><Link href="/guides" className="hover:text-[#5B7065] transition-colors">Cẩm nang & Tự lắp ráp</Link></li>
            <li><Link href="/faq" className="hover:text-[#5B7065] transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
            <li><Link href="/contact" className="hover:text-[#5B7065] transition-colors">Liên hệ tư vấn phòng</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#5B7065] transition-colors">Danh sách đã lưu</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#E7E0D6] bg-[#FAF8F5] py-4 text-center text-xs text-[#786C5E]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Small Living. Portfolio & Technical Showcase Project.</p>
          <p className="text-[11px] text-[#A83232] font-medium">
            Lưu ý: Không thực hiện giao dịch tài chính hay vận chuyển vật lý thực tế.
          </p>
        </div>
      </div>
    </footer>
  );
}

