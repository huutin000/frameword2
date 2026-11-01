"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log safe error telemetry without exposing sensitive data
    console.error("Storefront Client Error Boundary caught:", error?.message || error);
  }, [error]);

  return (
    <div className="site-container py-5 text-center">
      <div className="error-card mx-auto" style={{ maxWidth: "540px" }}>
        <div className="mb-3">
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold">
            HỆ THỐNG GIÁN ĐOẠN TẠM THỜI
          </span>
        </div>

        <div className="error-illustration my-4">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Đã Xảy Ra Sự Cố Khi Tải Dữ Liệu
        </h2>
        <p className="text-secondary mb-4" style={{ fontSize: "0.95rem" }}>
          Đừng lo lắng, dữ liệu giỏ hàng và tài khoản của bạn vẫn được bảo vệ an toàn. Bạn có thể nhấn thử lại bên dưới hoặc quay lại trang chủ.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm"
          >
            <i className="fa-solid fa-rotate-right me-2"></i>
            Thử Lại Ngay
          </button>
          <Link href="/" className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-semibold">
            <i className="fa-solid fa-house me-2"></i>
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

