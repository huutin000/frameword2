import Link from "next/link";
import siteConfig from "@/lib/site-config";

export const metadata = {
  title: "Giới thiệu về KOVIQO",
  description: "Khám phá câu chuyện thương hiệu, sứ mệnh và cam kết dịch vụ chuẩn quốc tế của hệ thống bán lẻ công nghệ KOVIQO.",
};

export default function AboutPage() {
  return (
    <div className="site-container py-5">
      {/* 1. Header Banner */}
      <section className="about-hero text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-3">
          VỀ CHÚNG TÔI
        </span>
        <h1 className="fw-black mb-3" style={{ fontSize: "2.5rem", color: "var(--text-primary)" }}>
          KOVIQO — Định Hình Chuẩn Mực Bán Lẻ Công Nghệ 2026
        </h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: "760px", fontSize: "1.1rem" }}>
          Được xây dựng từ niềm đam mê đổi mới sáng tạo, KOVIQO tiên phong mang đến không gian trải nghiệm mua sắm thiết bị điện thoại, máy tính và phụ kiện thông minh chính hãng với tiêu chuẩn dịch vụ vượt trội.
        </p>
      </section>

      {/* 2. Grid Highlights */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 p-4 border rounded-4 shadow-xs text-center">
            <div className="rounded-circle bg-primary-subtle text-primary mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
              <i className="fa-solid fa-bullseye fs-3"></i>
            </div>
            <h4 className="fw-bold mb-2">Tầm Nhìn 2030</h4>
            <p className="text-secondary small mb-0">
              Trở thành chuỗi bán lẻ công nghệ số 1 tại Việt Nam về chỉ số hài lòng khách hàng, kết hợp trải nghiệm mua sắm đa kênh (Omnichannel) mượt mà và hiện đại.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 p-4 border rounded-4 shadow-xs text-center">
            <div className="rounded-circle bg-success-subtle text-success mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
              <i className="fa-solid fa-hand-holding-heart fs-3"></i>
            </div>
            <h4 className="fw-bold mb-2">Sứ Mệnh Phục Vụ</h4>
            <p className="text-secondary small mb-0">
              Đồng hành cùng người dùng Việt tiếp cận những phát minh công nghệ đỉnh cao sớm nhất, với mức giá hợp lý, chính sách bảo hành minh bạch và tư vấn trung thực.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 p-4 border rounded-4 shadow-xs text-center">
            <div className="rounded-circle bg-warning-subtle text-warning mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
              <i className="fa-solid fa-gem fs-3"></i>
            </div>
            <h4 className="fw-bold mb-2">Giá Trị Cốt Lõi</h4>
            <p className="text-secondary small mb-0">
              <strong>Tận tâm — Minh bạch — Sáng tạo — Trách nhiệm</strong>. Mọi cam kết với khách hàng đều được thực hiện trọn vẹn và không thỏa hiệp với chất lượng.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Commitments */}
      <section className="p-4 p-md-5 rounded-4 bg-light border mb-5">
        <h2 className="fw-bold mb-4 text-center">Cam Kết Vàng Từ Hệ Thống KOVIQO</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="d-flex gap-3">
              <i className="fa-solid fa-shield-check text-primary fs-3 mt-1"></i>
              <div>
                <h5 className="fw-bold mb-1">100% Sản Phẩm Nguồn Gốc Chính Hãng</h5>
                <p className="text-secondary small">
                  Tất cả các dòng điện thoại, máy tính bảng, laptop và phụ kiện đều có đầy đủ tem phụ, chứng từ nhập khẩu và hóa đơn VAT điện tử.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex gap-3">
              <i className="fa-solid fa-bolt-lightning text-primary fs-3 mt-1"></i>
              <div>
                <h5 className="fw-bold mb-1">Giao Hàng Siêu Tốc 2 Giờ</h5>
                <p className="text-secondary small">
                  Đội ngũ giao nhận chuyên nghiệp cam kết chuyển sản phẩm tận tay khách hàng trong vòng 2 giờ tại các khu vực trung tâm.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex gap-3">
              <i className="fa-solid fa-rotate-left text-primary fs-3 mt-1"></i>
              <div>
                <h5 className="fw-bold mb-1">Chính Sách 1 Đổi 1 Trong 30 Ngày</h5>
                <p className="text-secondary small">
                  Khách hàng hoàn toàn yên tâm sử dụng với chính sách đổi mới ngay lập tức sản phẩm nguyên hộp nếu phát sinh bất kỳ lỗi kỹ thuật nào từ nhà sản xuất.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex gap-3">
              <i className="fa-solid fa-headset text-primary fs-3 mt-1"></i>
              <div>
                <h5 className="fw-bold mb-1">Hỗ Trợ Kỹ Thuật Trọn Đời Vòng Đời</h5>
                <p className="text-secondary small">
                  Đội ngũ chuyên viên kỹ thuật chứng chỉ chính hãng luôn sẵn sàng hỗ trợ cài đặt, chuyển dữ liệu và xử lý sự cố miễn phí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="text-center py-4">
        <h3 className="fw-bold mb-3">Sẵn Sàng Trải Nghiệm Mua Sắm Tại KOVIQO?</h3>
        <p className="text-secondary mb-4">
          Khám phá bộ sưu tập sản phẩm công nghệ thế hệ mới nhất với các chương trình khuyến mãi độc quyền hôm nay.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/product" className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
            Xem Ngay Sản Phẩm
          </Link>
          <Link href="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-semibold">
            Liên Hệ Chúng Tôi
          </Link>
        </div>
      </section>
    </div>
  );
}
