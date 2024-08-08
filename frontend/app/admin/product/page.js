"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Product() {
  const [data, setData] = useState([]);
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/product", {
      cache: "no-cache",
    });
    const newData = await res.json();
    setData(newData);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      const res = await fetch(` http://localhost:3000/product/deleteProduct/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        fetchProducts();
      }
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Products</h3>
        <div>
          <Link href="#" className="btn btn-outline-success rounded-0">
            Manage Categories
          </Link>
          <Link href="/admin/product/add" className="btn btn-primary rounded-0">
            Add Product
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-box"></i>
                20
              </div>
              PRODUCTS
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-danger-subtle text-danger">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-box-open"></i>3
              </div>
              RUNNING OUT
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-success-subtle text-success">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-boxes"></i>5
              </div>
              CATEGORIES
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-dark-subtle text-dark">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-archive"></i>0
              </div>
              ARCHIVE
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-0 border-0 shadow-sm">
        <div className="card-body">
          <table className="table text-center">
            <thead>
              <tr>
                <th className="text-start" colSpan="2">
                  Product
                </th>
                <th>Price</th>
                <th>Quantity</th>
                {/* <th>Rating</th> */}
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data.map((product, index) => (
                <tr key={index}>
                  <td style={{ width: 64 + "px" }}>
                    <img src={`http://localhost:3000/image/${product.image}`} className="w-100" />
                  </td>
                  <td className="text-start">
                    <strong>{product.name}</strong>
                    <br />
                    <small>
                      Id: <strong>{index + 1}</strong> | Category:{" "}
                      <Link href="#" className="text-decoration-none fw-bold">
                        {product.category.categoryName}
                      </Link>
                    </small>
                  </td>
                  <td>
                    {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    <br />
                    <del>
                      {product.del !== undefined
                        ? product.del.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                        : ""}
                    </del>
                  </td>
                  <td>{product.quantity}</td>
                  <td style={{ width: 500 + "px" }}>{product.description}</td>
                  {/* <td>
                    4.6
                    <br />
                    <i className="fas fa-star fa-xs text-warning"></i>
                    <i className="fas fa-star fa-xs text-warning"></i>
                    <i className="fas fa-star fa-xs text-warning"></i>
                    <i className="fas fa-star fa-xs text-warning"></i>
                    <i className="far fa-star fa-xs text-warning"></i>
                  </td> */}
                  <td>
                    {/* <Link href="#" target="_blank" className="btn btn-primary btn-sm">
                      <i className="fas fa-eye fa-fw"></i>
                    </Link> */}
                    <Link href={`/admin/product/update/${product._id}`} className="btn btn-outline-warning btn-sm">
                      <i className="fas fa-pencil fa-fw"></i>
                    </Link>
                    <Link href="#" className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(product._id)}>
                      <i className="fas fa-times fa-fw"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
