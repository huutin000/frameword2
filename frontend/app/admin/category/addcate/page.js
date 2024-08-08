"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function CategoryAdd() {
  const router = useRouter();

  const message = useRef("");
  const error = useRef("");

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("description", values.description);

    try {
      const res = await fetch("http://localhost:3000/category/addCategory", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.error) {
        error.current = result.error;
      } else {
        message.current = result.message;
        router.push("/admin/category");
      }
    } catch (err) {
      error.current = "Có lỗi xảy ra. Vui lòng thử lại.";
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ\s]*$/, "Name không hợp lệ"),
    description: Yup.string()
      .min(10, "Description phải có ít nhất 10 ký tự")
      .required("Description là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ\d\s]*$/, "Description không hợp lệ"),
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
        <h3 className="mb-4">Add Category</h3>
        <div>
          <Link href="/admin/product" className="btn btn-outline-secondary rounded-0">
            <i className="far fa-long-arrow-left"></i> Back
          </Link>
        </div>
      </div>
      {error.current && <div className="alert alert-danger">{error.current}</div>}
      {message.current && <div className="alert alert-success">{message.current}</div>}
      <form className="row" onSubmit={formik.handleSubmit} method="POST" encType="multipart/form-data">
        <div className="col-md-8 mb-4">
          <div className="card rounded-0 border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Basic Info</h6>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name *
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
                {formik.touched.name && formik.errors.name ? <strong>{formik.errors.name}</strong> : null}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
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
                  <strong>{formik.errors.description}</strong>
                ) : null}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-4 w-100">
            Add Product
          </button>
        </div>
      </form>
    </>
  );
}
