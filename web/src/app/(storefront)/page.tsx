import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box, Sparkles, CheckCircle2, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/components/product-card";
import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";

export default function HomePage() {
  const featuredProducts = SAMPLE_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SPATIAL STORY SECTION */}
      <section className="relative overflow-hidden bg-[#F3EFEA] border-b border-[#E7E0D6] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF0ED] border border-[#C5D3CC] text-xs font-semibold text-[#5B7065]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Giải pháp không gian hẹp dưới 30m²</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#29241E] leading-[1.15]">
                Tối ưu từng centimet cho căn hộ & phòng trọ của bạn.
              </h1>

              <p className="text-base sm:text-lg text-[#786C5E] max-w-2xl leading-relaxed">
                Không cần khoan đục tường. Không lãng phí góc chết. Công nghệ đo đạc phòng{" "}
                <span className="font-semibold text-[#5B7065]">SpaceFit</span> kết hợp công cụ{" "}
                <span className="font-semibold text-[#5A4033]">2D/3D Planner</span> giúp bạn biết chính xác món đồ có vừa phòng trước khi đặt mua.
              </p>

              {/* Spatial Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/planner">
                  <Button variant="primary" size="lg" className="shadow-md">
                    <Box className="w-5 h-5 mr-1" />
                    <span>Mở 2D / 3D Room Planner</span>
                  </Button>
                </Link>

                <Link href="/catalog?problem=no-drill">
                  <Button variant="secondary" size="lg">
                    <span>Xem đồ không khoan tường</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#786C5E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B7065]" />
                  <span>Kích thước milimet chuẩn xác</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B7065]" />
                  <span>Chân đế trợ lực phòng thuê</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B7065]" />
                  <span>Dữ liệu mô phỏng minh bạch</span>
                </div>
              </div>
            </div>

            {/* Right Visual Room Interactive Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#D3C7B7] bg-[#FFFFFF] shadow-xl p-4">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#FAF8F5]">
                  <Image
                    src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1000&auto=format&fit=crop&q=80"
                    alt="Phòng trọ studio phong cách Japandi ấm áp"
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* Interactive Hotspot Demo Overlay */}
                  <div className="absolute top-1/3 left-1/4 group cursor-pointer">
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7065] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-[#5B7065] border-2 border-white"></span>
                    </span>
                    <div className="hidden group-hover:block absolute left-8 top-0 z-10 w-48 p-2.5 bg-white/95 backdrop-blur-xs rounded-lg shadow-lg border border-[#D3C7B7] text-xs">
                      <p className="font-bold text-[#29241E]">Kệ đứng chống trần 60cm</p>
                      <p className="text-[#5B7065] font-semibold mt-0.5">680.000 ₫</p>
                      <p className="text-[10px] text-[#786C5E] mt-1">Không khoan · Vừa trần 2.6m</p>
                    </div>
                  </div>

                  <div className="absolute bottom-1/4 right-1/3 group cursor-pointer">
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B85D43] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B85D43] border-2 border-white"></span>
                    </span>
                    <div className="hidden group-hover:block absolute right-8 top-0 z-10 w-48 p-2.5 bg-white/95 backdrop-blur-xs rounded-lg shadow-lg border border-[#D3C7B7] text-xs">
                      <p className="font-bold text-[#29241E]">Hộp lưu trữ bánh xe</p>
                      <p className="text-[#5B7065] font-semibold mt-0.5">320.000 ₫</p>
                      <p className="text-[10px] text-[#786C5E] mt-1">Lọt gầm giường 19cm</p>
                    </div>
                  </div>
                </div>

                {/* Card Meta Bar */}
                <div className="mt-3 flex items-center justify-between text-xs text-[#786C5E] px-1">
                  <div className="flex items-center gap-1.5 font-medium text-[#29241E]">
                    <Ruler className="w-4 h-4 text-[#5B7065]" />
                    <span>Gợi ý mẫu: Studio 16m² (4.0 × 4.0m)</span>
                  </div>
                  <Link href="/planner" className="text-[#5B7065] font-semibold hover:underline">
                    Tùy biến phòng này →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPATIAL PROBLEM TAXONOMY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B7065]">Lựa chọn theo vấn đề</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#29241E] mt-1">Bạn đang gặp khó khăn gì với căn phòng?</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-[#5B7065] hover:underline flex items-center gap-1">
            <span>Tất cả giải pháp</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/catalog?problem=no-drill"
            className="group p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] hover:border-[#5B7065] transition-all hover:shadow-md space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EBF0ED] text-[#2E6F40] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              ✓
            </div>
            <h3 className="text-lg font-bold text-[#29241E] group-hover:text-[#5B7065] transition-colors">
              Không được khoan tường
            </h3>
            <p className="text-xs text-[#786C5E] leading-relaxed">
              Dành riêng cho người thuê trọ. Kệ tăng giảm chống sàn-trần, thanh kẹp cửa sổ, và giác hút cơ học chịu tải cao.
            </p>
            <div className="text-xs font-semibold text-[#5B7065] pt-1 flex items-center gap-1">
              <span>18 sản phẩm</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/catalog?problem=tight-space"
            className="group p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] hover:border-[#5B7065] transition-all hover:shadow-md space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F5EFEB] text-[#5A4033] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              📐
            </div>
            <h3 className="text-lg font-bold text-[#29241E] group-hover:text-[#5A4033] transition-colors">
              Phòng hẹp dưới 15m²
            </h3>
            <p className="text-xs text-[#786C5E] leading-relaxed">
              Giải phóng mặt sàn bằng cách tận dụng chiều cao không gian đứng và bàn làm việc gấp áp tường.
            </p>
            <div className="text-xs font-semibold text-[#5A4033] pt-1 flex items-center gap-1">
              <span>14 sản phẩm</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/catalog?problem=dead-corner"
            className="group p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] hover:border-[#5B7065] transition-all hover:shadow-md space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F9EBE7] text-[#B85D43] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              ↗
            </div>
            <h3 className="text-lg font-bold text-[#29241E] group-hover:text-[#B85D43] transition-colors">
              Tận dụng góc chết & khe 15cm
            </h3>
            <p className="text-xs text-[#786C5E] leading-relaxed">
              Kệ trượt kẹp tủ lạnh, kệ tam giác bo góc 90 độ, biến những khoảng trống vô dụng thành nơi chứa đồ đắt giá.
            </p>
            <div className="text-xs font-semibold text-[#B85D43] pt-1 flex items-center gap-1">
              <span>9 sản phẩm</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/catalog?problem=foldable"
            className="group p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] hover:border-[#5B7065] transition-all hover:shadow-md space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F3EFEA] text-[#786C5E] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              🔄
            </div>
            <h3 className="text-lg font-bold text-[#29241E] group-hover:text-[#786C5E] transition-colors">
              Gấp gọn trong 15 giây
            </h3>
            <p className="text-xs text-[#786C5E] leading-relaxed">
              Bàn xếp, ghế xếp phẳng dày dưới 5cm, giàn phơi gấp khúc ban công giúp phòng luôn thoáng đãng sau khi dùng xong.
            </p>
            <div className="text-xs font-semibold text-[#786C5E] pt-1 flex items-center gap-1">
              <span>12 sản phẩm</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5A4033]">Sản phẩm được tuyển chọn</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#29241E] mt-1">Đồ nội thất chuẩn kích thước không gian nhỏ</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-[#5B7065] hover:underline flex items-center gap-1">
            <span>Xem danh mục đầy đủ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. 2D / 3D PLANNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#5A4033] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#FAF8F5]/20 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]">
              Công nghệ độc quyền Small Living
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              Kéo thả đồ đạc vào căn phòng của bạn trước khi quyết định.
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed">
              Trình thiết kế phòng 2D/3D cho phép bạn nhập số đo thực tế của căn phòng (dài, rộng, cao), kiểm tra va chạm giữa các món đồ và xem mô phỏng phối cảnh 3D trực quan.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/planner">
                <Button variant="terracotta" size="lg" className="font-bold">
                  <Box className="w-5 h-5 mr-1" />
                  <span>Trải nghiệm 2D / 3D Planner ngay</span>
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  <span>Khám phá bộ sưu tập</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
