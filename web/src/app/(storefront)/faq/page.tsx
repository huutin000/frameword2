import React from "react";
import { HelpCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Câu hỏi thường gặp (FAQ) | Small Living 2026",
  description: "Giải đáp thắc mắc về cơ chế không khoan tường, vận chuyển, đổi trả 30 ngày và bảo hành.",
};

export default function FaqPage() {
  const faqs = [
    {
      q: "Cơ chế 'Không khoan tường' có thực sự chịu được đồ nặng không?",
      a: "Tất cả các sản phẩm chống trần hoặc kẹp góc của Small Living đều sử dụng hệ thống lò xo áp lực nén cao kết hợp với chân đế cao su hút chân không chống trượt. Các kệ chống trần đã được thử nghiệm chịu tải trọng tĩnh lên tới 25kg – 30kg, hoàn toàn đáp ứng nhu cầu để sách vở, máy tính và đồ gia dụng nặng mà không cần đóng đinh hay khoan tường bê tông.",
    },
    {
      q: "Nếu tôi chuyển trọ thì việc tháo dỡ và tái sử dụng có dễ dàng không?",
      a: "Hoàn toàn dễ dàng! Đó chính là triết lý cốt lõi của Small Living. Các sản phẩm được thiết kế module tháo lắp bằng tay với khóa cam và ốc siết lục giác đi kèm. Bạn chỉ mất 5–10 phút để hạ kệ xuống, đóng gói lại và mang sang phòng trọ mới với chiều cao trần khác nhau nhờ dải tăng giảm từ 2.2m đến 2.8m.",
    },
    {
      q: "Chính sách đổi trả trong 30 ngày áp dụng như thế nào?",
      a: "Nếu sản phẩm sau khi nhận về không vừa vặn với kích thước thực tế của phòng bạn (khe quá hẹp, trần quá cao), bạn có thể yêu cầu đổi sang sản phẩm kích thước khác hoặc hoàn tiền 100% trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên phụ kiện ban đầu.",
    },
    {
      q: "Đơn hàng demo trong hệ thống này có bị trừ tiền thật không?",
      a: "Dự án Small Living 2026 là một sản phẩm danh mục portfolio kỹ thuật hoàn chỉnh cao cấp. Tất cả quy trình thanh toán COD, VietQR và MoMo đều được mô phỏng an toàn tuyệt đối, không có giao dịch tiền thật, nhưng dữ liệu đơn hàng và lịch sử kiểm toán được lưu trữ và vận hành thật trên hệ thống.",
    },
    {
      q: "Làm thế nào để tôi biết sản phẩm có chiếm quá nhiều lối đi trong phòng không?",
      a: "Trên mỗi thẻ sản phẩm và trang chi tiết, hệ thống SpaceFit™ đều hiển thị diện tích chiếm sàn chính xác tính bằng mét vuông (m²) cùng lời khuyên không gian. Ngoài ra bạn có thể bấm 'Ướm thử trong phòng 2D' để đưa sản phẩm trực tiếp vào sơ đồ mặt bằng tỷ lệ thật.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#5B7065] text-xs font-bold border border-[#C5D3CC]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Trung tâm trợ giúp</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
          Câu hỏi thường gặp (FAQ)
        </h1>
        <p className="text-sm text-[#786C5E] max-w-lg mx-auto">
          Mọi thông tin bạn cần biết về kỹ thuật không gian, cơ chế không khoan và chính sách dịch vụ của Small Living.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E7E0D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2 hover:border-[#D3C7B7] transition-colors"
          >
            <h2 className="text-base font-bold text-[#29241E] flex items-start gap-2">
              <span className="text-[#5B7065] font-black">Q.</span>
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5A4033] leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-[#E7E0D6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0D6]">
          <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-[#5B7065]" />
          <div className="font-bold text-xs text-[#29241E]">Bảo hành 12 tháng</div>
          <div className="text-[11px] text-[#786C5E] mt-0.5">Lỗi 1 đổi 1 piston và trụ chịu lực</div>
        </div>
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0D6]">
          <RotateCcw className="w-5 h-5 mx-auto mb-2 text-[#5B7065]" />
          <div className="font-bold text-xs text-[#29241E]">Đổi trả 30 ngày</div>
          <div className="text-[11px] text-[#786C5E] mt-0.5">Không vừa kích thước phòng</div>
        </div>
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0D6]">
          <Truck className="w-5 h-5 mx-auto mb-2 text-[#5B7065]" />
          <div className="font-bold text-xs text-[#29241E]">Giao hàng 24/48h</div>
          <div className="text-[11px] text-[#786C5E] mt-0.5">Miễn phí cho đơn từ 1 triệu</div>
        </div>
      </div>
    </div>
  );
}
