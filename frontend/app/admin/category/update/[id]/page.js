"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditCategory({ params }) {
  const router = useRouter();
  const id = params.id;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getCategory() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setValue("name", data.name);
          setValue("description", data.description || "");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin danh mục:", err);
        setErrorMessage("Không tìm thấy danh mục hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getCategory();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("categories")
        .update({
          name: data.name,
          description: data.description,
        })
        .eq("id", id);

      if (error) throw error;
      router.push("/admin/category");
      router.refresh();
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      setErrorMessage("Cập nhật thất bại: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Đang tải thông tin danh mục...</p>
      </div>
    );
  }

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chỉnh sửa danh mục</h2>
        <Link href="/admin/category" className="btn btn-outline-secondary rounded-0">
          <i className="far fa-long-arrow-left"></i> Quay lại
        </Link>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group my-2">
          <label className="form-label">Tên danh mục *</label>
          <input
            type="text"
            className="form-control"
            {...register("name", { required: "Tên danh mục là bắt buộc" })}
          />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>

        <div className="form-group my-2">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="5"
            {...register("description")}
          />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary my-3">
          Cập nhật danh mục
        </button>
      </form>
    </div>
  );
}

