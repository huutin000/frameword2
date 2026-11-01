"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CategoryAdd() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values) => {
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("categories").insert([
        {
          name: values.name,
          description: values.description,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage("Thêm danh mục mới thành công!");
      router.push("/admin/category");
    } catch (err) {
      setErrorMessage("Có lỗi xảy ra: " + err.message);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên danh mục là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ\s0-9]*$/, "Tên danh mục không hợp lệ"),
    description: Yup.string().required("Mô tả là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Thêm danh mục mới</h1>
          <p className="text-muted small mb-0">Tạo nhóm phân loại thiết bị công nghệ mới</p>
        </div>
        <div>
          <Link href="/admin/category" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="fa-solid fa-arrow-left me-1"></i> Quay lại danh mục
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4">
          <i className="fa-solid fa-circle-exclamation me-1"></i> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success py-2 px-3 small rounded-3 mb-4">
          <i className="fa-solid fa-circle-check me-1"></i> {successMessage}
        </div>
      )}

      <div className="row">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="auth-label">
                  Tên danh mục <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name ? "is-invalid" : ""
                  }`}
                  id="name"
                  name="name"
                  placeholder="VD: Điện thoại, Laptop AI, Thiết bị âm thanh"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger small mt-1">{formik.errors.name}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="auth-label">
                  Mô tả danh mục <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    formik.touched.description && formik.errors.description ? "is-invalid" : ""
                  }`}
                  id="description"
                  rows="5"
                  name="description"
                  placeholder="Mô tả nhóm sản phẩm, phục vụ hiển thị trên storefront..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <div className="text-danger small mt-1">{formik.errors.description}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Đang lưu danh mục...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-folder-plus"></i> Khởi tạo danh mục
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
