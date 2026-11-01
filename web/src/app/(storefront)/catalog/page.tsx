"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/components/product-card";
import { CatalogFilters } from "@/features/catalog/components/catalog-filters";
import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";
import { paginateItems, getPageNumbers } from "@/features/catalog/utils/pagination";
import type { CatalogFilterState } from "@/features/catalog/types";

function CatalogContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const roomParam = searchParams.get("room") || "all";
  const problemParam = searchParams.get("problem") || "all";

  const [filters, setFilters] = useState<CatalogFilterState>({
    room: roomParam,
    problem: problemParam,
    onlyNoDrill: problemParam === "no-drill",
    maxWidthMm: 2000,
    sortBy: "featured",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const handleFilterChange = (newFilters: CatalogFilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 on filter change (U009)
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
    if (qParam) {
      const q = qParam.toLowerCase().trim();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.dimensions.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.roomTag.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.room !== "all" && p.roomType !== filters.room) {
      return false;
    }
    if (filters.problem !== "all" && p.problem !== filters.problem) {
      return false;
    }
    if (filters.onlyNoDrill && !p.noDrill) {
      return false;
    }
    if (p.widthMm > filters.maxWidthMm) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "price-asc") return a.priceVnd - b.priceVnd;
    if (filters.sortBy === "price-desc") return b.priceVnd - a.priceVnd;
    return 0;
  });

  const clearAllFilters = () => {
    setFilters({
      room: "all",
      problem: "all",
      onlyNoDrill: false,
      maxWidthMm: 2000,
      sortBy: "featured",
    });
  };

  const hasActiveFilters =
    filters.room !== "all" ||
    filters.problem !== "all" ||
    filters.onlyNoDrill ||
    filters.maxWidthMm < 2000 ||
    Boolean(qParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-[#E7E0D6] pb-6">
        <div className="text-xs text-[#786C5E] flex items-center gap-2">
          <Link href="/" className="hover:text-[#29241E]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-[#29241E] font-medium">Danh mục sản phẩm</span>
          {qParam && (
            <>
              <span>/</span>
              <span className="text-[#5B7065] font-semibold">Tìm kiếm: &ldquo;{qParam}&rdquo;</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E]">
              Nội Thất Đo Đạc Chuẩn Xác SpaceFit™
            </h1>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
              {qParam
                ? `Kết quả tìm kiếm cho từ khóa "${qParam}" (${filteredProducts.length} sản phẩm)`
                : `Tìm đồ đạc theo kích thước chính xác đến từng milimét cho phòng trọ và căn hộ hẹp.`}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5A4033] bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#D3C7B7]">
            {filteredProducts.length} sản phẩm phù hợp
          </span>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CatalogFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips & Sort Toolbar */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E7E0D6] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#786C5E] font-medium">Đang lọc:</span>
              {qParam && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#29241E] border border-[#D3C7B7] px-2.5 py-1 rounded-full font-semibold">
                  <Search className="w-3 h-3 text-[#5B7065]" />
                  <span>&ldquo;{qParam}&rdquo;</span>
                  <Link href="/catalog" className="ml-1 text-[#786C5E] hover:text-[#A05C52]">
                    <X className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {filters.room !== "all" && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#29241E] border border-[#D3C7B7] px-2.5 py-1 rounded-full">
                  <span>Phòng: {filters.room}</span>
                  <button onClick={() => setFilters({ ...filters, room: "all" })}>
                    <X className="w-3 h-3 text-[#786C5E] hover:text-[#A05C52]" />
                  </button>
                </span>
              )}
              {filters.problem !== "all" && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#29241E] border border-[#D3C7B7] px-2.5 py-1 rounded-full">
                  <span>Vấn đề: {filters.problem}</span>
                  <button onClick={() => setFilters({ ...filters, problem: "all" })}>
                    <X className="w-3 h-3 text-[#786C5E] hover:text-[#A05C52]" />
                  </button>
                </span>
              )}
              {filters.onlyNoDrill && (
                <span className="inline-flex items-center gap-1 bg-[#EBF0ED] text-[#2E6F40] px-2.5 py-1 rounded-full font-semibold">
                  <span>Không khoan tường</span>
                  <button onClick={() => setFilters({ ...filters, onlyNoDrill: false })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-[#786C5E] italic">Tất cả sản phẩm</span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#786C5E]">Sắp xếp:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as CatalogFilterState["sortBy"],
                  })
                }
                className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2.5 py-1 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              >
                <option value="featured">Độ phù hợp không gian</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Grid or Empty State */}
          {(() => {
            const pagedResult = paginateItems(filteredProducts, page, pageSize);

            if (filteredProducts.length === 0) {
              return (
                <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-dashed border-[#D3C7B7] p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E7E0D6] flex items-center justify-center mx-auto text-[#786C5E]">
                    <Box className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#29241E]">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc
                  </h3>
                  <p className="text-xs text-[#786C5E] max-w-sm mx-auto">
                    Hãy thử nới rộng giới hạn chiều rộng hoặc tắt chế độ lọc không khoan tường để xem thêm gợi ý.
                  </p>
                  <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                    Đặt lại bộ lọc
                  </Button>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pagedResult.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls (U009) */}
                {pagedResult.totalPages > 1 && (
                  <div className="bg-white border border-[#E7E0D6] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
                    <div className="text-[#786C5E]">
                      Hiển thị <strong>{pagedResult.startIndex} – {pagedResult.endIndex}</strong> trong tổng số{" "}
                      <strong>{pagedResult.totalItems}</strong> sản phẩm
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!pagedResult.hasPrevPage}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="text-xs px-2.5 py-1"
                      >
                        &larr; Trang trước
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers(pagedResult.currentPage, pagedResult.totalPages).map((pNum, idx) =>
                          pNum === "ellipsis" ? (
                            <span key={`dots-${idx}`} className="w-7 text-center text-xs text-[#786C5E]">
                              …
                            </span>
                          ) : (
                            <button
                              key={pNum}
                              type="button"
                              onClick={() => setPage(pNum)}
                              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                                pNum === pagedResult.currentPage
                                  ? "bg-[#5B7065] text-white shadow-xs"
                                  : "text-[#5A4033] hover:bg-[#FAF8F5] border border-transparent hover:border-[#D3C7B7]"
                              }`}
                            >
                              {pNum}
                            </button>
                          )
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!pagedResult.hasNextPage}
                        onClick={() => setPage((p) => Math.min(pagedResult.totalPages, p + 1))}
                        className="text-xs px-2.5 py-1"
                      >
                        Trang sau &rarr;
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-[#786C5E]">
                      <span>Mỗi trang:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                        className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2 py-1 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse text-[#786C5E]">
          Đang tải danh mục sản phẩm SpaceFit™...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
