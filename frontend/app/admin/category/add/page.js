"use client";
import { useState } from "react";
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

      setSuccessMessage("Thêm danh mục thành công!");
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
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Thêm danh mục</h3>
        <div>
          <Link href="/admin/category" className="btn btn-outline-secondary rounded-0">
            <i className="far fa-long-arrow-left"></i> Quay lại
          </Link>
        </div>
      </div>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form className="row" onSubmit={formik.handleSubmit}>
        <div className="col-md-8 mb-4">
          <div className="card rounded-0 border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Thông tin danh mục</h6>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <strong className="text-danger">{formik.errors.name}</strong>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Mô tả
                </label>
                <textarea
                  className="form-control rounded-0"
                  id="description"
                  rows="6"
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                ></textarea>
                {formik.touched.description && formik.errors.description ? (
                  <strong className="text-danger">{formik.errors.description}</strong>
                ) : null}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-4 w-100" disabled={formik.isSubmitting}>
            Thêm danh mục
          </button>
        </div>
      </form>
    </>
  );
}
