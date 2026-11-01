import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Về thương hiệu Small Living 2026 | Không gian tinh gọn",
  description: "Triết lý thiết kế Japandi Warm Minimalist tối ưu diện tích cho cuộc sống đô thị hiện đại.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Brand Mission Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold border border-[#C5D3CC]">
          <Compass className="w-3.5 h-3.5" />
          <span>Triết lý kiến trúc 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#29241E] tracking-tight leading-tight">
          Diện tích có thể khiêm tốn, nhưng chất lượng sống thì không.
        </h1>
        <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
          Small Living ra đời từ sự thấu hiểu sâu sắc áp lực không gian của người trẻ thuê nhà đô thị tại Việt Nam: phòng trọ chật hẹp, chủ nhà cấm khoan tường, và đồ đạc cồng kềnh khó di chuyển khi đổi chỗ ở.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-[#29241E]">Chuẩn xác đến từng milimét</h3>
          <p className="text-xs text-[#786C5E] leading-relaxed">
            Trong căn phòng dưới 15m², 5cm cũng là ranh giới giữa một lối đi thoáng đãng và một góc chết bừa bộn. Hệ thống SpaceFit™ công khai mọi kích thước W x D x H và diện tích sàn $m^2$.
          </p>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#D3C7B7] text-[#5A4033] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-[#29241E]">Không Khoan Tường (No-drill)</h3>
          <p className="text-xs text-[#786C5E] leading-relaxed">
            Áp dụng nguyên lý cột chống trần tăng giảm lực nén thủy lực và chân hít chân không. Bảo vệ tiền cọc nhà thuê, dễ dàng tháo dỡ và tái sử dụng khi bạn chuyển đến nơi ở mới.
          </p>
        </div>

        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#D3C7B7] text-[#A05C52] flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-[#29241E]">Phong cách Japandi Tối giản</h3>
          <p className="text-xs text-[#786C5E] leading-relaxed">
            Sự kết hợp tinh tế giữa công năng mộc mạc Nhật Bản và nét thanh lịch Bắc Âu. Tông màu gỗ sồi ấm, kem yến mạch và xanh xám làm dịu mắt và tạo cảm giác căn phòng rộng hơn thực tế.
          </p>
        </div>
      </div>

      {/* Visual Showcase */}
      <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D6]">
        <Image
          src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1600&auto=format&fit=crop&q=80"
          alt="Không gian nội thất tinh gọn Japandi"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <div className="text-white space-y-1">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#DCE5E0]">Studio Thử Nghiệm 2026</div>
            <div className="text-lg sm:text-2xl font-bold">Tối ưu từng góc chết — Nâng tầm trải nghiệm sống</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-[#29241E]">Bắt đầu thiết kế không gian phòng của bạn ngay hôm nay</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/catalog">
            <Button variant="primary" size="md">
              <span>Xem danh mục sản phẩm</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/planner">
            <Button variant="secondary" size="md">
              <Box className="w-4 h-4 mr-1.5" />
              <span>Mở 2D Room Planner</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
