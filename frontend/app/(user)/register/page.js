"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function Register() {
  const { success, error: toastError } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
      password: Yup.string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số")
        .required("Vui lòng nhập mật khẩu"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
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
            setFieldError("email", "Email này đã được đăng ký trước đó.");
            toastError("Email này đã được sử dụng.", "Đăng ký không thành công");
          } else {
            throw new Error(error.message || "Đăng ký thất bại");
          }
        } else {
          success("Đăng ký thành công! Bạn có thể đăng nhập ngay.", "Chào mừng");
          setTimeout(() => {
            window.location.href = "/login";
          }, 600);
        }
      } catch (err) {
        setFieldError("general", err.message);
        toastError(err.message, "Lỗi đăng ký");
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
            Tạo Tài Khoản Mới
          </h2>
          <p className="text-secondary small mb-0">
            Gia nhập cộng đồng KOVIQO Member nhận ngay ưu đãi độc quyền
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
            <label htmlFor="email" className="form-label small fw-semibold">
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
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
            <label htmlFor="password" className="form-label small fw-semibold">
              Mật khẩu (Tối thiểu 6 ký tự gồm chữ và số)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control rounded-3 ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
              placeholder="••••••••"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback small">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label small fw-semibold">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirm-password"
              name="rePassword"
              className={`form-control rounded-3 ${formik.touched.rePassword && formik.errors.rePassword ? "is-invalid" : ""}`}
              placeholder="••••••••"
              {...formik.getFieldProps("rePassword")}
            />
            {formik.touched.rePassword && formik.errors.rePassword && (
              <div className="invalid-feedback small">{formik.errors.rePassword}</div>
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
                Đang tạo tài khoản...
              </>
            ) : (
              "Đăng Ký Tài Khoản"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          Đã có tài khoản KOVIQO?{" "}
          <Link href="/login" className="fw-bold text-primary text-decoration-none">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
