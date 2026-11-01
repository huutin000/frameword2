"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";

export default function EditProduct({ params }) {
  const router = useRouter();
  const id = params.id;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        // 1. Lấy danh mục
        const { data: catData, error: catError } = await supabase.from("categories").select("*");
        if (catError) throw catError;
        setCategories(catData || []);

        // 2. Lấy chi tiết sản phẩm
        const { data: proData, error: proError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (proError) throw proError;
        if (proData) {
          setProduct(proData);
          setValue("name", proData.name);
          setValue("price", proData.price);
          setValue("del", proData.del || 0);
          setValue("quantity", proData.quantity || 1);
          setValue("description", proData.description);
          setValue("categoryId", proData.category_id || "");
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu sản phẩm:", err);
        setErrorMsg("Không tìm thấy thông tin sản phẩm yêu cầu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const supabase = createClient();
      let updatedImageUrl = product?.image;

      // Nếu có chọn ảnh mới -> upload lên Supabase Storage
      if (data.image && data.image[0]) {
        const file = data.image[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (uploadError) {
          throw new Error("Lỗi tải ảnh mới lên Storage: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        updatedImageUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: data.name,
          price: Number(data.price),
          del: Number(data.del) || 0,
          quantity: Number(data.quantity) || 1,
          description: data.description,
          category_id: data.categoryId || null,
          image: updatedImageUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/product");
    } catch (err) {
      setErrorMsg("Lỗi cập nhật: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2"></div>
        <p className="text-muted small">Đang nạp thông tin sản phẩm #{id}...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Chỉnh sửa sản phẩm</h1>
          <p className="text-muted small mb-0">Cập nhật thông tin, bảng giá và kho hàng cho sản phẩm #{id}</p>
        </div>
        <div>
          <Link href="/admin/product" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="fa-solid fa-arrow-left me-1"></i> Quay lại kho
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4">
          <i className="fa-solid fa-circle-exclamation me-1"></i> {errorMsg}
        </div>
      )}

      <form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Thông tin chi tiết</h2>

            <div className="mb-3">
              <label className="auth-label">
                Tên sản phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name.message}</div>}
            </div>

            <div className="mb-3">
              <label className="auth-label">
                Mô tả chi tiết <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows="6"
                {...register("description", { required: "Mô tả là bắt buộc" })}
              />
              {errors.description && (
                <div className="text-danger small mt-1">{errors.description.message}</div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="auth-label">Số lượng tồn kho</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  {...register("quantity", { valueAsNumber: true })}
                />
              </div>

              <div className="col-md-6">
                <label className="auth-label">
                  Danh mục phân loại <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                  {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
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
                {errors.categoryId && (
                  <div className="text-danger small mt-1">{errors.categoryId.message}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Bảng giá cập nhật</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="auth-label">
                  Giá bán (VNĐ) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  min="0"
                  {...register("price", { required: "Giá là bắt buộc", valueAsNumber: true })}
                />
                {errors.price && <div className="text-danger small mt-1">{errors.price.message}</div>}
              </div>

              <div className="col-md-6">
                <label className="auth-label">Giá niêm yết cũ / Gạch bỏ (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  {...register("del", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h2 className="h6 fw-bold text-dark pb-3 border-bottom mb-3">Ảnh đại diện</h2>
            {product?.image && (
              <div className="mb-3 text-center p-3 bg-light rounded-3 border">
                <span className="small text-muted d-block mb-2">Ảnh hiện tại:</span>
                <img
                  src={getImageUrl(product.image)}
                  style={{ maxHeight: "150px", maxWidth: "100%", objectFit: "contain" }}
                  className="rounded"
                  alt="Product Current"
                />
              </div>
            )}
            <div>
              <label className="auth-label">Thay đổi ảnh mới (tùy chọn):</label>
              <input type="file" className="form-control" accept="image/*" {...register("image")} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Đang lưu thay đổi...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Cập nhật sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
