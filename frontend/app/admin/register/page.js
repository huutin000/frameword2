"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@/lib/supabase/client";

export default function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số"
        )
        .required("Vui lòng nhập mật khẩu"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("user already")
          ) {
            setFieldError("email", "Email quản trị này đã được đăng ký trước đó.");
          } else {
            throw new Error(error.message || "Khởi tạo tài khoản quản trị thất bại");
          }
        } else {
          alert("Đăng ký tài khoản quản trị thành công! Vui lòng đăng nhập để bắt đầu phiên làm việc.");
          window.location.href = "/admin/login";
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: "460px", width: "100%" }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-3 mb-3"
            style={{ width: "48px", height: "48px", fontSize: "1.25rem" }}
          >
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Cấp Quyền Quản Trị Mới</h1>
          <p className="text-muted small mb-0">Tạo tài khoản quản trị viên tham gia vận hành hệ thống</p>
        </div>

        {formik.errors.general && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            <i className="fa-solid fa-circle-exclamation me-1"></i> {formik.errors.general}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-reg-email" className="auth-label">Email quản trị</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input
                type="email"
                id="admin-reg-email"
                placeholder="staff@nexustech.vn"
                className={`form-control border-start-0 ${
                  formik.touched.email && formik.errors.email ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("email")}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger small mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="admin-reg-password" className="auth-label">Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-reg-password"
                placeholder="Tối thiểu 6 ký tự gồm chữ và số"
                className={`form-control border-start-0 border-end-0 ${
                  formik.touched.password && formik.errors.password ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                className="input-group-text bg-light text-muted border-start-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger small mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="admin-reg-repassword" className="auth-label">Xác nhận mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="fa-solid fa-shield-check"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-reg-repassword"
                placeholder="Nhập lại mật khẩu"
                className={`form-control border-start-0 ${
                  formik.touched.rePassword && formik.errors.rePassword ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("rePassword")}
              />
            </div>
            {formik.touched.rePassword && formik.errors.rePassword && (
              <div className="text-danger small mt-1">{formik.errors.rePassword}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn btn-warning w-100 py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Đang tạo tài khoản...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> Hoàn tất tạo tài khoản
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-muted small">
          Đã có tài khoản quản trị?{" "}
          <Link href="/admin/login" className="text-primary fw-semibold text-decoration-none">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
