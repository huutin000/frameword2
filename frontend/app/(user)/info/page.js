"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Info() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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
          name: profile?.name || authUser.user_metadata?.name || "Chưa cập nhật",
          role: profile?.role || "user",
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
    window.location.href = "/login";
  };

  if (loading) return <div className="container py-4"><p>Đang tải thông tin...</p></div>;

  return (
    <div className="container py-4">
      <h2>Thông tin cá nhân</h2>
      <div className="card p-3 my-3">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Tên:</strong> {user.name}
        </p>
        <p>
          <strong>Vai trò:</strong> {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
        </p>
      </div>
      <button className="btn btn-danger" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
}
