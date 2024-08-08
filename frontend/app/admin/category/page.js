"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Category() {
  const [data, setData] = useState([]);
  const fetchCategory = async () => {
    const res = await fetch("http://localhost:3000/category", {
      cache: "no-cache",
    });
    const newData = await res.json();
    setData(newData);
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  const deleteCategory = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      const res = await fetch(` http://localhost:3000/category/deleteCategory/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result) {
        fetchCategory();
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
          <Link href="/admin/category/addcate" className="btn btn-primary rounded-0">
            Add Category
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
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data.map((category, index) => (
                <tr key={index}>
                  <td className="text-start">
                    <strong>{category.name}</strong>
                    <br />
                  </td>

                  <td>{category.description}</td>

                  <td>
                    <Link
                      href={`/admin/category/updatecate/${category._id}`}
                      className="btn btn-outline-warning btn-sm"
                    >
                      <i className="fas fa-pencil fa-fw"></i>
                    </Link>
                    <Link
                      href="#"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteCategory(category._id)}
                    >
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
