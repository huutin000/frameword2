"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((count, item) => count + Number(item.quantity), 0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = document.cookie.split(";").find((c) => c.trim().startsWith("token="));
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <>
      <div className="box-top-logo">
        <Link href="/">
          <img src="/asset/image/logo-new.png" alt="" />
        </Link>

        <form action="/Search" method="get">
          <input className="search" type="text" name="keyword" placeholder="Vui lòng nhập tên sản phẩm..." />
        </form>
        <div className="user">
          <i className="fa-solid fa-user"></i>
        </div>
        {/* nếu đăng nhập rồi thi chuyển sang info */}

        <div id="account" className="d-flex justify-content-center align-items-center rounded-circle  mx-2 px-2 py-1">
          <Link href={isLoggedIn ? "../info" : "../login/dangnhap"}>
            <i
              className={
                isLoggedIn
                  ? "bi bi-person fs-5  fw-bolder text-dark"
                  : "bi bi-box-arrow-in-right fs-5  fw-bolder text-dark"
              }
            />
          </Link>
        </div>
        <Link href="../login/dangnhap" style={{ textDecoration: "none" }}>
          <label className="button-top">Login</label>
        </Link>

        <Link href="../cart" style={{ textDecoration: "none" }}>
          <label className="button-top">
            <i className="fa fa-cart-shopping">{cartCount} </i> Giỏ hàng
          </label>
        </Link>
      </div>
      <div className="box-menu">
        <span className="button-menu">
          <Link href="#">
            <i className="fa-solid fa-bars"></i>&nbsp; Tất cả danh mục |
          </Link>
          <ul className="menu-list">
            <li>Điện thoại</li>
            <li>Laptop</li>
            <li>Đồng hồ</li>
            <li>Âm thanh</li>
            <li>Phụ kiện</li>
            <li>Tivi</li>
            <li>PC , Màn hình</li>
            <li>Hàng cũ</li>
            <li>Thu cũ đổi mới</li>
            <li>Tin công nghệ</li>
          </ul>
        </span>
        <Link href="/">Trang chủ</Link>
        <Link href="../product">Sản Phẩm</Link>
        <Link href="../gioithieu">Giới thiệu</Link>
        <Link href="../contact">Liên hệ</Link>
      </div>
    </>
  );
}
