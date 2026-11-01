"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProductAdd() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("categories").select("*");
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const supabase = createClient();
      let imageUrl = "";

      // 1. Upload ảnh lên Supabase Storage bucket 'products'
      if (values.image && values.image.name) {
        const fileExt = values.image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, values.image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Lỗi upload ảnh:", uploadError);
          throw new Error("Lỗi tải ảnh lên Storage: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Thêm record vào bảng products
      const { error: insertError } = await supabase.from("products").insert([
        {
          name: values.name,
          price: Number(values.price),
          del: Number(values.saleprice) || 0,
          quantity: Number(values.quantity) || 1,
          description: values.description,
          category_id: values.category || null,
          image: imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage("Thêm sản phẩm thành công!");
      router.push("/admin/product");
    } catch (err) {
      setErrorMessage(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên sản phẩm là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ0-9\s.,+_-]*$/, "Tên sản phẩm không hợp lệ"),
    description: Yup.string()
      .min(5, "Mô tả phải có ít nhất 5 ký tự")
      .required("Mô tả là bắt buộc"),
    quantity: Yup.number().required("Số lượng là bắt buộc").min(0, "Số lượng không hợp lệ"),
    price: Yup.number().required("Giá là bắt buộc").min(0, "Giá không hợp lệ"),
    saleprice: Yup.number().min(0, "Giá khuyến mãi không hợp lệ"),
    image: Yup.mixed().required("Hình ảnh là bắt buộc"),
    category: Yup.string().required("Danh mục là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      quantity: 1,
      price: "",
      saleprice: 0,
      image: null,
      category: "",
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
          <h1 className="h3 fw-bold text-dark mb-1">Thêm sản phẩm mới</h1>
          <p className="text-muted small mb-0">Điền thông tin kỹ thuật, giá bán và hình ảnh thiết bị</p>
        </div>
        <div>
          <Link href="/admin/product" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="fa-solid fa-arrow-left me-1"></i> Quay lại kho
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

      <form className="row g-4" onSubmit={formik.handleSubmit}>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Thông tin cơ bản</h2>
            <div className="mb-3">
              <label htmlFor="name" className="auth-label">
                Tên sản phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                placeholder="VD: iPhone 16 Pro Max 256GB Titan Tự Nhiên"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger small mt-1">{formik.errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="auth-label">
                Mô tả chi tiết sản phẩm <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                id="description"
                rows="6"
                name="description"
                placeholder="Mô tả thông số chip, camera, màn hình, thời lượng pin..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger small mt-1">{formik.errors.description}</div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="quantity" className="auth-label">
                  Số lượng nhập kho <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.quantity && formik.errors.quantity ? "is-invalid" : ""}`}
                  id="quantity"
                  name="quantity"
                  min="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.quantity}
                />
                {formik.touched.quantity && formik.errors.quantity && (
                  <div className="text-danger small mt-1">{formik.errors.quantity}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="category" className="auth-label">
                  Thuộc danh mục <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${formik.touched.category && formik.errors.category ? "is-invalid" : ""}`}
                  id="category"
                  name="category"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.category}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => {
                    const catId = category.id || category._id;
                    return (
                      <option key={catId} value={catId}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="text-danger small mt-1">{formik.errors.category}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Chính sách giá</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="price" className="auth-label">
                  Giá bán hiện tại (VNĐ) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.price && formik.errors.price ? "is-invalid" : ""}`}
                  id="price"
                  name="price"
                  min="0"
                  placeholder="VD: 29990000"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="text-danger small mt-1">{formik.errors.price}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="saleprice" className="auth-label">
                  Giá niêm yết cũ / Gạch bỏ (VNĐ)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="saleprice"
                  name="saleprice"
                  min="0"
                  placeholder="VD: 34990000 (để trống nếu không giảm)"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.saleprice}
                />
                {formik.touched.saleprice && formik.errors.saleprice && (
                  <div className="text-danger small mt-1">{formik.errors.saleprice}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Hình ảnh đại diện</h2>
            <div className="mb-3">
              <label htmlFor="image" className="auth-label">
                Tải ảnh từ máy tính <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${formik.touched.image && formik.errors.image ? "is-invalid" : ""}`}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("image", file);
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="text-danger small mt-1">{formik.errors.image}</div>
              )}
            </div>

            {imagePreview && (
              <div className="mt-3 text-center p-3 bg-light rounded-3 border">
                <span className="small text-muted d-block mb-2">Xem trước ảnh:</span>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
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
                Đang tải ảnh & lưu kho...
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up"></i> Lưu & Công bố sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
