"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Register() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
      password: Yup.string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số")
        .required("Vui lòng nhập mật khẩu"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("http://localhost:3000/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.message === "Email đã tồn tại") {
            setFieldError("email", "Email đã tồn tại");
          } else {
            throw new Error(errorData.message || "Đăng ký thất bại");
          }
        }
        // Xử lý thành công
        alert("Đăng ký thành công");
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="register-content">
      <section className="register-form">
        <h1>Đăng ký</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" {...formik.getFieldProps("email")} />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" name="password" {...formik.getFieldProps("password")} />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input type="password" id="confirm-password" name="rePassword" {...formik.getFieldProps("rePassword")} />
            {formik.touched.rePassword && formik.errors.rePassword ? (
              <div className="text-danger">{formik.errors.rePassword}</div>
            ) : null}
          </div>
          <button type="submit" disabled={formik.isSubmitting}>
            Đăng ký
          </button>
          {formik.errors.general && <p className="my-3 text-danger">{formik.errors.general}</p>}
        </form>
        <p className="login-link">
          Đã có tài khoản? <Link href="../login/dangnhap">Đăng nhập</Link>
        </p>
      </section>
    </div>
  );
}
