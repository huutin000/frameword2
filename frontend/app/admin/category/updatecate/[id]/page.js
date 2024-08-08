"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EditCategory({ params }) {
  const router = useRouter();
  const id = params.id;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  // Lấy danh mục từ backend vào biến categories
  useEffect(() => {
    // Khai báo hàm lấy danh mục

    // Lấy dữ liệu của chi tiết sản phẩm cần sửa
    const getProduct = async () => {
      const res = await fetch(`http://localhost:3000/category/category/${id}`);
      const data = await res.json();
      setProduct(data);
      // Đặt giá trị ban đầu cho form
      setValue("name", data.name);
      setValue("price", data.price);
      setValue("description", data.description);
      setValue("categoryId", data.categoryId);
    };
    // Gọi hàm
    if (id) {
      getProduct();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const res = await fetch(`http://localhost:3000/category/updateCategory/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await res.json();
    if (!result.error) {
      router.push("/admin/category");
    } else {
      // Xử lý hiển thị lỗi
      console.error(result.error);
    }
  };

  return (
    <div className="m-3">
      <h2>Chỉnh sửa danh mục</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="form-group my-2">
          <label className="form-label">Tên danh mục</label>
          <input type="text" className="form-control" {...register("name", { required: "Tên danh mục là bắt buộc" })} />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>

        <div className="form-group my-2">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" {...register("description", { required: "Mô tả là bắt buộc" })} />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary my-3">
          Cập nhật danh mục
        </button>
      </form>
    </div>
  );
}
