"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function Info() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { info } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error || !authUser) {
          window.location.href = "/login";
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        setUser({
          email: authUser.email,
          name: profile?.name || authUser.user_metadata?.name || "Khách Hàng KOVIQO",
          role: profile?.role || "user",
          createdAt: authUser.created_at,
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "token=; path=/; max-age=0";
    info("Bạn đã đăng xuất khỏi hệ thống KOVIQO.", "Đăng xuất");
    setTimeout(() => {
      window.location.href = "/login";
    }, 400);
  };

  if (loading) {
    return (
      <div className="site-container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="text-muted fw-semibold">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="site-container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card p-4 p-md-5 border rounded-4 shadow-xs">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-4 mb-4 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: "56px", height: "56px" }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "K"}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">{user.name}</h3>
                  <span className="badge bg-primary-subtle text-primary border">
                    {user.role === "admin" ? "Quản trị viên hệ thống" : "Thành viên KOVIQO Elite"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                Đăng Xuất
              </button>
            </div>

            {/* Profile Information List */}
            <h5 className="fw-bold mb-3">Thông Tin Chi Tiết</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <span className="small text-muted d-block mb-1">Email đăng nhập:</span>
                  <strong className="text-dark">{user.email}</strong>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <span className="small text-muted d-block mb-1">Hạng thành viên:</span>
                  <strong className="text-primary">VIP Gold 2026</strong>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <span className="small text-muted d-block mb-1">Điểm tích lũy KOVIQO:</span>
                  <strong className="text-success">1.250 điểm (125.000đ)</strong>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <span className="small text-muted d-block mb-1">Địa chỉ giao hàng mặc định:</span>
                  <span className="text-muted">Chưa lưu địa chỉ</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="d-flex flex-wrap gap-2 pt-3 border-top">
              <Link href="/cart" className="btn btn-primary btn-sm rounded-3">
                <i className="fa-solid fa-cart-shopping me-1"></i> Xem giỏ hàng
              </Link>
              <Link href="/product" className="btn btn-outline-secondary btn-sm rounded-3">
                <i className="fa-solid fa-grid-2 me-1"></i> Mua sắm thêm
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-dark btn-sm rounded-3 ms-auto">
                  <i className="fa-solid fa-gauge-high me-1"></i> Vào Trang Quản Trị
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
