"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@/lib/supabase/client";

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
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        if (data.session) {
          document.cookie = `token=${data.session.access_token}; path=/; max-age=3600`;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
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
          Chưa có tài khoản? <Link href="/register">Nhấn đăng ký </Link>
        </p>
      </section>
    </div>
  );
}
