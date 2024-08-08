"use client";
import React, { useState, useEffect } from "react";

export default function Info() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      // Kiểm tra nếu đang chạy trên client
      if (typeof window !== "undefined") {
        // Lấy token từ cookie ở máy tính
        const token = document.cookie.split(";").find((c) => c.trim().startsWith("token="));
        const tokenValue = token?.split("=")[1];

        if (!tokenValue) {
          window.location.href = "../login/dangnhap";
          return;
        }

        try {
          const res = await fetch("http://localhost:3000/user/detailuser", {
            headers: {
              Authorization: `Bearer ${tokenValue}`,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle errors here if needed
        } finally {
          setLoading(false);
        }
      }
    };

    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Thông tin cá nhân</h2>
      <div>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Tên:</strong> {user.name}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {user.address}
        </p>
      </div>
      {/* nút đăng xuất */}
      <button
        className="btn btn-danger"
        onClick={() => {
          if (typeof window !== "undefined") {
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = "/login/dangnhap";
          }
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
