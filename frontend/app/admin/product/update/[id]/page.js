"use client";
import { useEffect, useState } from "react";
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
        setErrorMsg("Không tìm thấy sản phẩm.");
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
          throw new Error("Lỗi tải ảnh mới: " + uploadError.message);
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

  if (loading) return <div className="p-4">Đang tải thông tin sản phẩm...</div>;

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between mb-3">
        <h2>Chỉnh sửa sản phẩm</h2>
        <Link href="/admin/product" className="btn btn-outline-secondary">
          Quay lại
        </Link>
      </div>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group my-2">
          <label className="form-label">Tên sản phẩm *</label>
          <input
            type="text"
            className="form-control"
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
          />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 form-group my-2">
            <label className="form-label">Giá bán (VNĐ) *</label>
            <input
              type="number"
              className="form-control"
              {...register("price", { required: "Giá là bắt buộc", valueAsNumber: true })}
            />
            {errors.price && <div className="text-danger">{errors.price.message}</div>}
          </div>

          <div className="col-md-6 form-group my-2">
            <label className="form-label">Giá gốc / Gạch bỏ (VNĐ)</label>
            <input
              type="number"
              className="form-control"
              {...register("del", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="form-group my-2">
          <label className="form-label">Số lượng tồn kho</label>
          <input
            type="number"
            className="form-control"
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>

        <div className="form-group my-2">
          <label className="form-label">Mô tả sản phẩm *</label>
          <textarea
            className="form-control"
            rows="5"
            {...register("description", { required: "Mô tả là bắt buộc" })}
          />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>

        <div className="form-group my-2">
          <label className="form-label">Hình ảnh hiện tại</label>
          <br />
          {product?.image && (
            <div className="mb-2">
              <img
                src={getImageUrl(product.image)}
                style={{ maxWidth: "160px", maxHeight: "160px", objectFit: "contain" }}
                className="rounded border p-1"
                alt="Product"
              />
            </div>
          )}
          <label className="form-label text-muted small">Chọn ảnh mới (nếu muốn thay đổi):</label>
          <input type="file" className="form-control" accept="image/*" {...register("image")} />
        </div>

        <div className="form-group my-2">
          <label className="form-label">Danh mục *</label>
          <select className="form-control" {...register("categoryId", { required: "Chọn một danh mục" })}>
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
          {errors.categoryId && <div className="text-danger">{errors.categoryId.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary my-3" disabled={isSubmitting}>
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
        </button>
      </form>
    </div>
  );
}
