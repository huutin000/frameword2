"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Col 1: Store Intro */}
          <div className="footer-col">
            <Link href="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--brand-navy)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  NEXUS<strong>TECH</strong>
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  Next-Gen Store
                </span>
              </div>
            </Link>

            <p className="footer-desc">
              Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu Việt Nam. Cam kết 100% sản phẩm nguồn gốc rõ ràng, bảo hành uy tín và hỗ trợ kỹ thuật tận tâm.
            </p>

            <div className="footer-hotlines">
              <div>
                <span className="fw-semibold text-dark">Tổng đài bán hàng:</span>{" "}
                <strong className="text-primary">1800 8888</strong>{" "}
                <span className="text-muted small">(7:30 - 22:00)</span>
              </div>
              <div>
                <span className="fw-semibold text-dark">Hỗ trợ kỹ thuật & bảo hành:</span>{" "}
                <strong className="text-primary">1800 8889</strong>{" "}
                <span className="text-muted small">(8:00 - 21:00)</span>
              </div>
              <div>
                <span className="fw-semibold text-dark">Email liên hệ:</span>{" "}
                <a href="mailto:contact@nexustech.vn" className="text-primary text-decoration-none fw-semibold">
                  contact@nexustech.vn
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Policies */}
          <div className="footer-col">
            <h5>Chính sách mua hàng</h5>
            <ul className="footer-links">
              <li><Link href="/about">Chính sách bảo hành chính hãng</Link></li>
              <li><Link href="/about">Chính sách 1 đổi 1 trong 30 ngày</Link></li>
              <li><Link href="/about">Chính sách giao hàng siêu tốc 2h</Link></li>
              <li><Link href="/about">Chính sách trả góp 0% lãi suất</Link></li>
              <li><Link href="/about">Chính sách bảo mật dữ liệu</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col">
            <h5>Hỗ trợ khách hàng</h5>
            <ul className="footer-links">
              <li><Link href="/contact">Hệ thống cửa hàng toàn quốc</Link></li>
              <li><Link href="/contact">Tra cứu thông tin bảo hành</Link></li>
              <li><Link href="/cart">Hướng dẫn đặt hàng online</Link></li>
              <li><Link href="/info">Ưu đãi thành viên NEXUSTECH VIP</Link></li>
              <li><Link href="/contact">Góp ý & Khiếu nại dịch vụ</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Payments */}
          <div className="footer-col">
            <h5>Đăng ký nhận tin công nghệ</h5>
            <p className="footer-desc">
              Nhận ngay mã giảm giá 100.000đ và cập nhật sớm nhất các đợt flash sale sản phẩm mới.
            </p>
            {subscribed ? (
              <div className="alert alert-success py-2 px-3 small rounded-3">
                <i className="fa-solid fa-circle-check me-2"></i>
                Cảm ơn bạn đã đăng ký nhận bản tin NEXUSTECH!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="d-flex gap-2 mb-4">
                <input
                  type="email"
                  className="form-control form-control-sm rounded-3 bg-white border text-dark"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm px-3 fw-bold rounded-3">
                  Đăng ký
                </button>
              </form>
            )}

            <h6 className="small fw-bold text-dark mb-2">Phương thức thanh toán</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border p-2">
                <i className="fa-brands fa-cc-visa fa-lg me-1 text-primary"></i> Visa
              </span>
              <span className="badge bg-light text-dark border p-2">
                <i className="fa-brands fa-cc-mastercard fa-lg me-1 text-danger"></i> Mastercard
              </span>
              <span className="badge bg-light text-dark border p-2">
                <i className="fa-solid fa-qrcode fa-lg me-1 text-info"></i> VNPAY-QR
              </span>
              <span className="badge bg-light text-dark border p-2">
                <i className="fa-solid fa-wallet fa-lg me-1 text-danger"></i> MoMo
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 NEXUSTECH Retail. Toàn bộ bản quyền thuộc về hệ thống bán lẻ công nghệ NEXUSTECH.
          </div>
          <div className="d-flex gap-3 footer-bottom-links">
            <Link href="/about">Điều khoản sử dụng</Link>
            <Link href="/about">Quy chế hoạt động</Link>
            <Link href="/contact">Liên hệ báo chí</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
