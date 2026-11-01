"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function Login() {
  const { success, error: toastError } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Địa chỉ email không hợp lệ").required("Vui lòng nhập email"),
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
          throw new Error("Email hoặc mật khẩu không chính xác.");
        }

        if (data.session) {
          document.cookie = `token=${data.session.access_token}; path=/; max-age=3600`;
        }

        success("Đăng nhập thành công! Đang chuyển hướng...", "Tài Khoản");

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        setTimeout(() => {
          if (profile?.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        }, 500);
      } catch (err) {
        setFieldError("general", err.message);
        toastError(err.message, "Đăng nhập thất bại");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="site-container py-5 d-flex justify-content-center align-items-center">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link href="/" className="d-inline-block mb-3">
            <img src="/brand/koviqo-mark.svg" alt="KOVIQO" width="48" height="48" />
          </Link>
          <h2 className="fw-black mb-1" style={{ fontSize: "1.75rem", color: "var(--text-primary)" }}>
            Đăng Nhập Tài Khoản
          </h2>
          <p className="text-secondary small mb-0">
            Truy cập hệ thống mua sắm và theo dõi đơn hàng KOVIQO
          </p>
        </div>

        {formik.errors.general && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            {formik.errors.general}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label small fw-semibold">
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              className={`form-control rounded-3 ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              placeholder="ten@vidu.com"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback small">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="login-password" className="form-label small fw-semibold mb-0">
                Mật khẩu
              </label>
              <Link href="/about" className="small text-primary text-decoration-none">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              id="login-password"
              name="password"
              className={`form-control rounded-3 ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
              placeholder="••••••••"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback small">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn btn-primary py-2 fw-bold rounded-3 shadow-sm mt-2"
          >
            {formik.isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                Đang xác thực...
              </>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          Chưa có tài khoản KOVIQO?{" "}
          <Link href="/register" className="fw-bold text-primary text-decoration-none">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
