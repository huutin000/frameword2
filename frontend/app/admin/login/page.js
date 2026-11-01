"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          throw new Error("Tài khoản quản trị hoặc mật khẩu không chính xác.");
        }

        if (data.session) {
          document.cookie = `token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
        }

        window.location.href = "/admin";
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: "440px", width: "100%" }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 mb-3"
            style={{ width: "48px", height: "48px", fontSize: "1.25rem" }}
          >
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="h4 fw-bold text-dark mb-1">Cổng Quản Trị Hệ Thống</h1>
          <p className="text-muted small mb-0">Đăng nhập tài khoản Administrator để truy cập console</p>
        </div>

        {formik.errors.general && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
            <i className="fa-solid fa-circle-exclamation me-1"></i> {formik.errors.general}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login-email" className="auth-label">Email quản trị</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input
                type="email"
                id="login-email"
                placeholder="admin@nexustech.vn"
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

          <div className="mb-4">
            <label htmlFor="login-password" className="auth-label">Mật khẩu bảo mật</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Đang xác thực...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Đăng nhập Console
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-muted small">
          Cần cấp quyền quản trị?{" "}
          <Link href="/admin/register" className="text-primary fw-semibold text-decoration-none">
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
