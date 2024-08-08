"use client";
import { useEffect, useState } from "react";
import ProductCard from "../components/productcard";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [sortOption, setSortOption] = useState("asc");
  const [filters, setFilters] = useState({
    showAll: true,
    showPhone: false,
    showLaptop: false,
  });

  useEffect(() => {
    async function fetchProduct() {
      let url = "http://localhost:3000/product";
      if (!filters.showAll) {
        const selectedCategories = [];
        if (filters.showPhone) selectedCategories.push("65f2829efc13ae110c318c55");
        if (filters.showLaptop) selectedCategories.push("65f2829efc13ae110c318c56");

        if (selectedCategories.length > 0) {
          url = `http://localhost:3000/product/productcate/${selectedCategories.join(",")}`;
        }
      }
      const res = await fetch(url);
      const newProduct = await res.json();
      setProduct(newProduct);
    }
    fetchProduct();
  }, [filters]);

  const handleSort = (product) => {
    return [...product].sort((a, b) => {
      if (sortOption === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;

    if (name === "showPhone" && checked) {
      setFilters({
        showAll: false,
        showPhone: true,
        showLaptop: false,
      });
    } else if (name === "showLaptop" && checked) {
      setFilters({
        showAll: false,
        showPhone: false,
        showLaptop: true,
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        showAll: true,
        showPhone: false,
        showLaptop: false,
      }));
    }
  };
  return (
    <>
      <h1>Danh sách sản phẩm</h1>

      <div className="controls">
        <label htmlFor="sort">Sắp xếp:</label>
        <select id="sort" onChange={handleSortChange}>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>
      <div style={{ textAlign: "center" }}>
        <input
          type="checkbox"
          id="showAll"
          name="showAll"
          value="showAll"
          checked={filters.showAll}
          onChange={handleFilterChange}
        />
        <label htmlFor="showAll" className="me-2">
          Hiển thị tất cả
        </label>
        <input
          type="checkbox"
          id="showPhone"
          name="showPhone"
          value="showPhone"
          checked={filters.showPhone}
          onChange={handleFilterChange}
        />
        <label htmlFor="showPhone" className="me-2">
          Điện thoại
        </label>
        <input
          type="checkbox"
          id="showLaptop"
          name="showLaptop"
          value="showLaptop"
          checked={filters.showLaptop}
          onChange={handleFilterChange}
        />
        <label htmlFor="showLaptop" className="me-2">
          Laptop
        </label>
      </div>

      <ProductCard data={handleSort(product)} />
    </>
  );
}
