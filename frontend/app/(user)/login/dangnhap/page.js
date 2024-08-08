"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
      password: Yup.string().required("Bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Đăng nhập thất bại");
        }
        // Lưu token vào cookie
        const data = await res.json();
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;
        // Chuyển trang theo role
        const token = data.token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "user") {
          window.location.href = "http://localhost:3001";
        } else {
          window.location.href = "/admin";
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-content">
      <section className="login-form">
        <h1>Đăng nhập</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input type="email" id="login-email" name="email" {...formik.getFieldProps("email")} />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input type="password" id="login-password" name="password" {...formik.getFieldProps("password")} />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </div>

          <button type="submit" disabled={formik.isSubmitting}>
            Đăng nhập
          </button>
          {formik.errors.general ? <div className="text-danger mt-2">{formik.errors.general}</div> : null}
        </form>
        <p className="register-link">
          Chưa có tài khoản? <Link href="../login/dangky">Nhấn đăng ký </Link>
        </p>
      </section>
    </div>
  );
}
