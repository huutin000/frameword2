"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import type { AdminProductRecord } from "../data/product-store";
import { formatVND } from "@/lib/formatters/currency";
import {
  toggleProductStatusAction,
  deleteProductAction,
} from "../actions/product-actions";
import { Button } from "@/components/ui/button";

interface ProductManagementTableProps {
  initialProducts: AdminProductRecord[];
}

export function ProductManagementTable({
  initialProducts,
}: ProductManagementTableProps) {
  const [products, setProducts] = useState<AdminProductRecord[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const categories = Array.from(new Set(initialProducts.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.dimensions.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTogglePublish = async (id: string) => {
    setActionLoading(id);
    const res = await toggleProductStatusAction(id);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: res.isPublished! } : p))
      );
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${title}"?`)) return;
    setActionLoading(id);
    const res = await deleteProductAction(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SKU, kích thước..."
              className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
            />
            <Search className="w-4 h-4 text-[#786C5E] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D3C7B7] rounded-xl px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          >
            <option value="all">Tất cả danh mục ({initialProducts.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" className="gap-1.5 shadow-xs whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
                <th className="py-3 px-4">Sản phẩm / SKU</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Kích thước (WxDxH)</th>
                <th className="py-3 px-4">Giá niêm yết</th>
                <th className="py-3 px-4">Tồn kho</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFEA]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#786C5E]">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Product Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-[#F3EFEA] overflow-hidden shrink-0 border border-[#E7E0D6]">
                          <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <div className="font-bold text-[#29241E] line-clamp-1 max-w-xs">{p.title}</div>
                          <div className="text-[11px] text-[#786C5E] font-mono mt-0.5">{p.sku}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#5A4033] whitespace-nowrap">
                      <div>{p.category}</div>
                      <div className="text-[10px] text-[#786C5E]">{p.roomTag}</div>
                    </td>

                    {/* Dimensions & Features */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-[#29241E] flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-[#5B7065]" />
                        <span>{p.dimensions}</span>
                      </div>
                      {p.noDrill && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#5B7065] bg-[#EBF0ED] px-1.5 py-0.5 rounded mt-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Không khoan</span>
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#29241E] whitespace-nowrap">
                      {formatVND(p.priceVnd)}
                    </td>

                    {/* Stock balance */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.stockBalance > 10
                            ? "bg-[#EBF0ED] text-[#3E5247]"
                            : p.stockBalance > 0
                            ? "bg-[#FFF9E6] text-[#A05C52]"
                            : "bg-[#FDF2F0] text-[#A05C52]"
                        }`}
                      >
                        {p.stockBalance > 0 ? `${p.stockBalance} cái` : "Hết hàng"}
                      </span>
                    </td>

                    {/* Publish Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(p.id)}
                        disabled={actionLoading === p.id}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          p.isPublished
                            ? "bg-[#EBF0ED] text-[#5B7065] hover:bg-[#DCE5E0]"
                            : "bg-[#F3EFEA] text-[#786C5E] hover:bg-[#E7E0D6]"
                        }`}
                        title="Bấm để bật/tắt hiển thị sản phẩm"
                      >
                        {p.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Hiển thị</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Bản nháp</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-[#5A4033] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={actionLoading === p.id}
                          className="p-1.5 text-[#A05C52] hover:text-[#7A362D] hover:bg-[#FDF2F0] rounded transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
