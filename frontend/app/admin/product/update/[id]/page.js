"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EditProduct({ params }) {
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
    const getCategories = async () => {
      const res = await fetch("http://localhost:3000/category");
      const data = await res.json();
      setCategories(data);
    };
    // Gọi hàm lấy danh mục
    getCategories();

    // Lấy dữ liệu của chi tiết sản phẩm cần sửa
    const getProduct = async () => {
      const res = await fetch(`http://localhost:3000/product/productdetail/${id}`);
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
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }

    const res = await fetch(`http://localhost:3000/product/updateProduct/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await res.json();
    if (!result.error) {
      router.push("/admin/product");
    } else {
      // Xử lý hiển thị lỗi
      console.error(result.error);
    }
  };

  return (
    <div className="m-3">
      <h2>Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="form-group my-2">
          <label className="form-label">Tên sản phẩm</label>
          <input type="text" className="form-control" {...register("name", { required: "Tên sản phẩm là bắt buộc" })} />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className="form-label">Giá</label>
          <input
            type="number"
            className="form-control"
            {...register("price", { required: "Giá là bắt buộc", valueAsNumber: true })}
          />
          {errors.price && <div className="text-danger">{errors.price.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" {...register("description", { required: "Mô tả là bắt buộc" })} />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className="form-label">Hình ảnh</label>
          <br />
          {product?.image && <img src={`http://localhost:3000/image/${product.image}`} width="200px" alt="product" />}
          <input type="file" className="form-control" {...register("image")} />
        </div>
        <div className="form-group my-2">
          <label className="form-label">Danh mục</label>
          <select className="form-control" {...register("categoryId", { required: "Chọn một danh mục" })}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <div className="text-danger">{errors.categoryId.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary my-3">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
}
