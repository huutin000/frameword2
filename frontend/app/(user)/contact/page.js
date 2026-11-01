"use client";

import { useState } from "react";
import siteConfig from "@/lib/site-config";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "tu-van-san-pham",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error("Vui lòng điền đầy đủ các thông tin bắt buộc.", "Thiếu thông tin");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      success("Cảm ơn bạn! Đội ngũ tư vấn KOVIQO sẽ liên hệ lại trong vòng 30 phút.", "Gửi thành công");
      setFormData({
        name: "",
        email: "",
        phone: "",
        topic: "tu-van-san-pham",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="site-container py-5">
      {/* Title */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold mb-3">
          HỖ TRỢ & LIÊN HỆ
        </span>
        <h1 className="fw-black mb-3" style={{ fontSize: "2.3rem", color: "var(--text-primary)" }}>
          Liên Hệ Hệ Thống Bán Lẻ KOVIQO
        </h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: "600px" }}>
          Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp và giải đáp mọi thắc mắc của quý khách hàng 24/7.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {/* Contact Info Cards */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {/* Address */}
            <div className="card p-4 border rounded-4 shadow-xs">
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle bg-primary-subtle text-primary p-3">
                  <i className="fa-solid fa-location-dot fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Trụ sở & Showroom Flagship</h5>
                  <p className="text-secondary small mb-1">{siteConfig.contact.address}</p>
                  <span className="badge bg-light text-dark border">Mở cửa: 8:00 - 22:00 hàng ngày</span>
                </div>
              </div>
            </div>

            {/* Hotlines */}
            <div className="card p-4 border rounded-4 shadow-xs">
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle bg-success-subtle text-success p-3">
                  <i className="fa-solid fa-phone fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Tổng đài hỗ trợ miễn phí</h5>
                  <p className="text-secondary small mb-1">
                    Tư vấn mua hàng: <strong className="text-primary">{siteConfig.contact.hotlineSales}</strong> (7:30 - 22:00)<br />
                    Khiếu nại & Bảo hành: <strong className="text-primary">{siteConfig.contact.hotlineSupport}</strong> (8:00 - 21:00)
                  </p>
                  <span className="badge bg-light text-success border">Cước gọi 0đ / phút</span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card p-4 border rounded-4 shadow-xs">
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle bg-info-subtle text-info p-3">
                  <i className="fa-solid fa-envelope fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Email liên hệ & Hợp tác</h5>
                  <p className="text-secondary small mb-1">
                    Chăm sóc khách hàng: <strong>{siteConfig.contact.email}</strong><br />
                    Hỗ trợ kỹ thuật: <strong>{siteConfig.contact.supportEmail}</strong>
                  </p>
                  <span className="badge bg-light text-dark border">Phản hồi trong 2 giờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="card p-4 p-md-5 border rounded-4 shadow-xs">
            <h3 className="fw-bold mb-2">Gửi Tin Nhắn Cho KOVIQO</h3>
            <p className="text-secondary small mb-4">
              Điền thông tin vào biểu mẫu dưới đây, chuyên viên tư vấn sẽ liên hệ lại ngay.
            </p>

            {isSubmitted ? (
              <div className="alert alert-success p-4 rounded-3 text-center">
                <i className="fa-solid fa-circle-check fs-1 text-success mb-3"></i>
                <h4 className="fw-bold">Gửi Tin Nhắn Thành Công!</h4>
                <p className="mb-3">Cảm ơn bạn đã quan tâm. Bộ phận chăm sóc khách hàng KOVIQO sẽ liên hệ hỗ trợ bạn sớm nhất.</p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-outline-success btn-sm rounded-pill px-3"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Nguyễn Văn A"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control rounded-3"
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold small">Địa chỉ Email *</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    placeholder="email@vidu.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold small">Chủ đề cần hỗ trợ</label>
                  <select
                    className="form-select rounded-3"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  >
                    <option value="tu-van-san-pham">Tư vấn mua hàng & Khuyến mãi</option>
                    <option value="bao-hanh">Tra cứu bảo hành & Sửa chữa</option>
                    <option value="tra-gop">Thủ tục trả góp 0%</option>
                    <option value="khieu-nai">Góp ý & Khiếu nại dịch vụ</option>
                    <option value="hop-tac">Hợp tác kinh doanh / Doanh nghiệp</option>
                  </select>
                </div>

                <div>
                  <label className="form-label fw-semibold small">Nội dung tin nhắn *</label>
                  <textarea
                    rows="4"
                    className="form-control rounded-3"
                    placeholder="Nhập nội dung cần hỗ trợ..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary py-2 fw-bold rounded-3 mt-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin me-2"></i>
                      Đang gửi tin nhắn...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane me-2"></i>
                      Gửi Tin Nhắn
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
