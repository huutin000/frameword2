"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name)")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Lỗi lấy danh sách sản phẩm:", error);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory === "phone") {
      result = result.filter((p) => {
        const cat = p.categories?.name || "";
        return /điện thoại|phone|iphone|samsung/i.test(cat + " " + p.name);
      });
    } else if (selectedCategory === "laptop") {
      result = result.filter((p) => {
        const cat = p.categories?.name || "";
        return /laptop|macbook|asus|dell/i.test(cat + " " + p.name);
      });
    }

    // Price range filter
    if (priceRange === "under-10m") {
      result = result.filter((p) => Number(p.price) < 10000000);
    } else if (priceRange === "10m-20m") {
      result = result.filter(
        (p) => Number(p.price) >= 10000000 && Number(p.price) <= 20000000
      );
    } else if (priceRange === "above-20m") {
      result = result.filter((p) => Number(p.price) > 20000000);
    }

    // Sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return result;
  }, [products, selectedCategory, priceRange, sortOption]);

  return (
    <div className="site-container py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small text-muted">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none">
              <i className="fa-solid fa-house me-1"></i> Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            Danh sách sản phẩm KOVIQO
          </li>
        </ol>
      </nav>

      {/* Main Listing Layout */}
      <div className="plp-layout">
        {/* Sidebar Filters */}
        <aside className="plp-sidebar">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h5 className="fw-bold mb-0">Bộ lọc</h5>
            {(selectedCategory !== "all" || priceRange !== "all") && (
              <button
                type="button"
                className="btn btn-link text-primary btn-sm p-0 text-decoration-none"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h6 className="filter-heading">Danh mục thiết bị</h6>
            <div className="filter-pill-list">
              <button
                type="button"
                className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedCategory === "phone" ? "active" : ""}`}
                onClick={() => setSelectedCategory("phone")}
              >
                Điện thoại
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedCategory === "laptop" ? "active" : ""}`}
                onClick={() => setSelectedCategory("laptop")}
              >
                Laptop & MacBook
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h6 className="filter-heading">Mức giá</h6>
            <div className="d-flex flex-column gap-2 small">
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === "all"}
                  onChange={() => setPriceRange("all")}
                />
                <span>Tất cả mức giá</span>
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === "under-10m"}
                  onChange={() => setPriceRange("under-10m")}
                />
                <span>Dưới 10 triệu</span>
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === "10m-20m"}
                  onChange={() => setPriceRange("10m-20m")}
                />
                <span>10 triệu - 20 triệu</span>
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === "above-20m"}
                  onChange={() => setPriceRange("above-20m")}
                />
                <span>Trên 20 triệu</span>
              </label>
            </div>
          </div>

          {/* Trust Banner inside sidebar */}
          <div className="bg-light p-3 rounded-3 mt-4 small border">
            <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-1">
              <i className="fa-solid fa-certificate"></i>
              <span>100% Chính Hãng</span>
            </div>
            <p className="text-muted mb-0">KOVIQO cam kết hoàn tiền 200% nếu phát hiện sản phẩm không chính hãng.</p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main>
          {/* Toolbar */}
          <div className="toolbar-header">
            <div>
              <h4 className="fw-bold mb-1">Thiết bị công nghệ</h4>
              <span className="text-muted small">
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sort" className="small text-muted fw-semibold">
                Sắp xếp:
              </label>
              <select
                id="sort"
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Loading or Product Cards */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <ProductCard data={filteredProducts} />
          )}
        </main>
      </div>
    </div>
  );
}
