"use client";
import { useEffect, useState } from "react";
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
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Thêm sản phẩm</h3>
        <div>
          <Link href="/admin/product" className="btn btn-outline-secondary rounded-0">
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
              <h6 className="pb-3 border-bottom">Thông tin cơ bản</h6>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Tên sản phẩm *
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
                  Mô tả sản phẩm *
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
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Số lượng tồn *
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="quantity"
                    name="quantity"
                    min="0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.quantity}
                  />
                  {formik.touched.quantity && formik.errors.quantity ? (
                    <strong className="text-danger">{formik.errors.quantity}</strong>
                  ) : null}
                </div>
                <div className="col mb-3">
                  <label htmlFor="category" className="form-label">
                    Danh mục *
                  </label>
                  <select
                    className="form-select rounded-0"
                    id="category"
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => {
                      const catId = category.id || category._id;
                      return (
                        <option key={catId} value={catId}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                  {formik.touched.category && formik.errors.category ? (
                    <strong className="text-danger">{formik.errors.category}</strong>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Giá bán</h6>
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="price" className="form-label">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="price"
                    name="price"
                    min="0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <strong className="text-danger">{formik.errors.price}</strong>
                  ) : null}
                </div>
                <div className="col mb-3">
                  <label htmlFor="saleprice" className="form-label">
                    Giá gốc / Gạch bỏ (VNĐ)
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="saleprice"
                    name="saleprice"
                    min="0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.saleprice}
                  />
                  {formik.touched.saleprice && formik.errors.saleprice ? (
                    <strong className="text-danger">{formik.errors.saleprice}</strong>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Ảnh sản phẩm</h6>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Tải ảnh từ máy tính *
                </label>
                <input
                  className="form-control rounded-0"
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image ? (
                  <strong className="text-danger">{formik.errors.image}</strong>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-0 mt-4 w-100"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đang tải ảnh & lưu..." : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </>
  );
}
