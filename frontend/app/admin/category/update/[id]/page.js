"use client";
import React, { useEffect, useState } from "react";
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
    formState: { errors, isSubmitting },
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
        setErrorMessage("Không tìm thấy thông tin danh mục yêu cầu.");
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2"></div>
        <p className="text-muted small">Đang nạp thông tin danh mục #{id}...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Chỉnh sửa danh mục</h1>
          <p className="text-muted small mb-0">Cập nhật tên gọi và mô tả nhóm danh mục #{id}</p>
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

      <div className="row">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="auth-label">
                  Tên danh mục <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", { required: "Tên danh mục là bắt buộc" })}
                />
                {errors.name && <div className="text-danger small mt-1">{errors.name.message}</div>}
              </div>

              <div className="mb-4">
                <label className="auth-label">Mô tả danh mục</label>
                <textarea
                  className="form-control"
                  rows="5"
                  {...register("description")}
                ></textarea>
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
                    <i className="fa-solid fa-floppy-disk"></i> Cập nhật danh mục
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
