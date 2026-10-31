"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";

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
      const supabase = createClient();
      let query = supabase.from("products").select("*, categories(name)");

      if (!filters.showAll) {
        if (filters.showPhone) {
          query = supabase
            .from("products")
            .select("*, categories!inner(name)")
            .ilike("categories.name", "%Điện thoại%");
        } else if (filters.showLaptop) {
          query = supabase
            .from("products")
            .select("*, categories!inner(name)")
            .ilike("categories.name", "%Laptop%");
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      } else {
        setProduct(data || []);
      }
    }
    fetchProduct();
  }, [filters]);

  const handleSort = (products) => {
    return [...products].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortOption === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
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
      setFilters({
        showAll: true,
        showPhone: false,
        showLaptop: false,
      });
    }
  };

  return (
    <>
      <h1>Danh sách sản phẩm</h1>

      <div className="controls">
        <label htmlFor="sort">Sắp xếp:</label>
        <select id="sort" onChange={handleSortChange} value={sortOption}>
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
