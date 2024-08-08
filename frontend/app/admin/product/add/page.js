"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function ProductAdd() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const message = useRef("");
  const error = useRef("");

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:3000/category");
      const data = await res.json();
      setCategories(data);
    };
    getCategories();
  }, []);

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("price", values.price);
    data.append("del", values.saleprice);
    data.append("quantity", values.quantity);
    data.append("description", values.description);
    data.append("category[categoryId]", values.category);
    data.append("category[categoryName]", categories.find((cate) => cate._id === values.category)?.name);
    data.append("image", values.image);

    try {
      const res = await fetch("http://localhost:3000/product/addProduct", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.error) {
        error.current = result.error;
      } else {
        message.current = result.message;
        router.push("/admin/product");
      }
    } catch (err) {
      error.current = "Có lỗi xảy ra. Vui lòng thử lại.";
    }
  };

  // form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ\s]*$/, "Name không hợp lệ"),
    description: Yup.string()
      .min(10, "Description phải có ít nhất 10 ký tự")
      .required("Description là bắt buộc")
      .matches(/^[a-zA-ZÀ-ỹ\d\s]*$/, "Description không hợp lệ"),
    quantity: Yup.number().required("Quantity là bắt buộc").min(1, "Quantity không hợp lệ"),
    price: Yup.number().required("Price là bắt buộc").min(0, "Price không hợp lệ"),
    saleprice: Yup.number().required("SalePrice là bắt buộc").min(0, "SalePrice không hợp lệ"),
    image: Yup.mixed()
      .required("Image là bắt buộc")
      .test("image-validation", "Image không hợp lệ", (value) => {
        return value && /\.(jpeg|jpg|gif|png|bmp|svg)$/.test(value.name);
      }),
    category: Yup.string().required("Category là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      quantity: "",
      price: "",
      saleprice: "",
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
        <h3 className="mb-4">Add Product</h3>
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
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantity *
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
                  {formik.touched.quantity && formik.errors.quantity ? <strong>{formik.errors.quantity}</strong> : null}
                </div>
                <div className="col mb-3">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <div className="input-group">
                    <select
                      className="form-select rounded-0"
                      id="category"
                      name="category"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.category}
                      required
                    >
                      <option value="" label="Select category" />
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-outline-primary rounded-0">
                      <i className="fal fa-boxes"></i>
                    </button>
                  </div>
                  {formik.touched.category && formik.errors.category ? <strong>{formik.errors.category}</strong> : null}
                </div>
              </div>
            </div>
          </div>
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Price</h6>
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="price" className="form-label">
                    Price *
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
                  {formik.touched.price && formik.errors.price ? <strong>{formik.errors.price}</strong> : null}
                </div>
                <div className="col mb-3">
                  <label htmlFor="saleprice" className="form-label">
                    Sale Price
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
                    <strong>{formik.errors.saleprice}</strong>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <h6 className="pb-3 border-bottom">Image</h6>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Product Image *
                </label>
                <input
                  className="form-control rounded-0"
                  type="file"
                  id="image"
                  name="image"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image ? <strong>{formik.errors.image}</strong> : null}
                <div className="bg-secondary-subtle mb-3 p-2 text-center"></div>
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
