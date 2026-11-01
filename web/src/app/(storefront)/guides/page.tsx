import React from "react";
import Link from "next/link";
import { BookOpen, Wrench, ArrowRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Cẩm nang tối ưu không gian nhỏ & Hướng dẫn lắp đặt | Small Living 2026",
  description: "Các kỹ thuật bài trí phòng trọ hẹp, cơ chế không khoan tường và hướng dẫn tự lắp ráp.",
};

export default function GuidesPage() {
  const guides = [
    {
      title: "Kỹ thuật lắp đặt kệ chống trần không khoan tường",
      category: "Lắp ráp tự làm (DIY)",
      time: "5 phút đọc",
      summary: "Nguyên lý trụ tăng giảm áp lực (tension pole) chịu tải 25kg mà không để lại vết hằn trên trần thạch cao hoặc bê tông.",
      steps: [
        "Đo chiều cao trần nhà từ sàn tới trần chính xác bằng thước cuộn.",
        "Nới lỏng vòng đai lò xo thủy lực của cột chống đứng.",
        "Đặt chân đế cao su chống trượt vuông góc 90° so với mặt sàn.",
        "Xoay siết đai ốc tăng giảm cho đến khi chỉ báo lực căng chuyển sang màu xanh lá.",
      ],
    },
    {
      title: "Cách xử lý góc chết và khe hẹp từ 15cm trong nhà bếp mini",
      category: "Tối ưu không gian",
      time: "4 phút đọc",
      summary: "Biến khoảng hở giữa tủ lạnh và tường thành tháp gia vị đa tầng di động có bánh xe trượt mượt mà.",
      steps: [
        "Đo chiều rộng thực tế của khe hở tại 3 điểm: sàn, giữa tường và trên cao.",
        "Chọn kệ có bánh xe bearing chịu lực để kéo êm ái trên sàn gạch.",
        "Xếp các đồ nặng (dầu ăn, nước mắm) ở tầng đáy để tạo trọng tâm vững chãi.",
      ],
    },
    {
      title: "Bài toán bàn làm việc gấp gọn piston cho phòng ngủ dưới 12m²",
      category: "Không gian làm việc",
      time: "6 phút đọc",
      summary: "Hạ xuống thành bàn làm việc 80x50cm tiêu chuẩn công thái học, gấp lên chỉ dày đúng 8cm sát tường khi ngủ.",
      steps: [
        "Xác định độ cao bàn chuẩn (720mm – 750mm từ sàn).",
        "Kiểm tra vị trí ổ điện để cắm sạc laptop và đèn bàn không bị vướng dây.",
        "Thử nghiệm hành trình nâng hạ piston thủy lực êm ái không giật cục.",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold border border-[#C5D3CC]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cẩm nang Small Living™ 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#29241E] tracking-tight">
          Bí quyết biến không gian nhỏ thành nơi đáng sống
        </h1>
        <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
          Tập hợp các hướng dẫn đo đạc chuẩn milimét, cơ chế lắp đặt tự làm và phương pháp bài trí nội thất cho người thuê nhà hiện đại.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="space-y-8">
        {guides.map((g, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#5B7065] bg-[#EBF0ED] px-2.5 py-1 rounded-full">
                {g.category}
              </span>
              <span className="text-[#786C5E] font-medium">{g.time}</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#29241E]">{g.title}</h2>
              <p className="text-xs sm:text-sm text-[#786C5E] mt-2 leading-relaxed">
                {g.summary}
              </p>
            </div>

            {/* Steps list */}
            <div className="pt-2 border-t border-[#F3EFEA] space-y-2.5">
              <div className="text-xs font-bold text-[#5A4033] flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#5B7065]" />
                <span>Các bước thực hiện chuẩn xác:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {g.steps.map((st, sIdx) => (
                  <div key={sIdx} className="p-3 bg-[#FAF8F5] rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#EBF0ED] text-[#5B7065] font-bold text-[11px] flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <span className="text-[#29241E] leading-snug">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Demonstration Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B7065]">
              <Film className="w-3.5 h-3.5" />
              <span>Video thao tác & Lắp đặt thực tế</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#29241E]">
              Hướng Dẫn Lắp Đặt Bằng Video Trực Quan
            </h2>
          </div>
          <span className="text-xs font-medium text-[#786C5E] hidden sm:inline">
            100% người thuê nhà có thể tự làm tại phòng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Card 1 */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="relative aspect-video bg-black">
              <video
                controls
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=80"
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              >
                Trình duyệt của bạn không hỗ trợ phát video HTML5.
              </video>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#5B7065] bg-[#EBF0ED] px-2 py-0.5 rounded">
                  DIY 3 Bước
                </span>
                <span className="text-[#786C5E] font-mono">Thời lượng: 0:15 demo</span>
              </div>
              <h3 className="text-base font-bold text-[#29241E]">
                Thao tác dựng cột chống trần tăng giảm lực nén không khoan tường
              </h3>
              <p className="text-xs text-[#786C5E] leading-relaxed">
                Xem chi tiết cách điều chỉnh ren vặn áp lực và kiểm tra chỉ báo cân bằng để đạt độ ổn định 25kg tải trọng.
              </p>
            </div>
          </div>

          {/* Video Card 2 */}
          <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="relative aspect-video bg-black">
              <video
                controls
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80"
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              >
                Trình duyệt của bạn không hỗ trợ phát video HTML5.
              </video>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#5B7065] bg-[#EBF0ED] px-2 py-0.5 rounded">
                  Piston Thủy Lực
                </span>
                <span className="text-[#786C5E] font-mono">Thời lượng: 0:15 demo</span>
              </div>
              <h3 className="text-base font-bold text-[#29241E]">
                Cơ chế đóng gập bàn làm việc sát tường êm ái chống kẹp tay
              </h3>
              <p className="text-xs text-[#786C5E] leading-relaxed">
                Minh họa chu trình nâng hạ trợ lực giảm chấn, bảo vệ an toàn cho gia đình có trẻ nhỏ và phòng ngủ chật hẹp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-[#29241E]">
          Cần tư vấn chọn đồ vừa vặn cho kích thước phòng cụ thể?
        </h3>
        <p className="text-xs sm:text-sm text-[#786C5E] max-w-lg mx-auto">
          Sử dụng công cụ lập kế hoạch 2D của chúng tôi để nhập chiều rộng, chiều sâu và ướm thử đồ nội thất theo tỷ lệ thật.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/planner">
            <Button variant="primary" size="md">
              <span>Mở 2D Room Planner</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
