"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, FolderTree, AlertCircle, CheckCircle2, CornerDownRight } from "lucide-react";
import type { CategoryRecord } from "../data/category-store";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../actions/category-actions";
import { Button } from "@/components/ui/button";

interface CategoryManagementViewProps {
  initialCategories: CategoryRecord[];
}

export function CategoryManagementView({ initialCategories }: CategoryManagementViewProps) {
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
  const [editingCat, setEditingCat] = useState<CategoryRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("studio");
  const [displayOrder, setDisplayOrder] = useState(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const startEdit = (cat: CategoryRecord) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId);
    setDescription(cat.description);
    setRoomType(cat.roomType);
    setDisplayOrder(cat.displayOrder);
    setIsAdding(false);
    setErrorMessage(null);
  };

  const startAdd = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setParentId(null);
    setDescription("");
    setRoomType("studio");
    setDisplayOrder(categories.length + 1);
    setIsAdding(true);
    setErrorMessage(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      const genSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(genSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (editingCat) {
      const res = await updateCategoryAction(editingCat.id, {
        name,
        slug,
        parentId,
        description,
        roomType,
        displayOrder: Number(displayOrder),
      });

      if (res.success && res.category) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? res.category! : c))
        );
        setSuccessMessage(`Đã cập nhật danh mục "${res.category.name}" thành công!`);
        setEditingCat(null);
      } else {
        setErrorMessage(res.error || "Không thể cập nhật danh mục");
      }
    } else {
      const res = await createCategoryAction({
        name,
        slug,
        parentId,
        description,
        roomType,
        displayOrder: Number(displayOrder),
      });

      if (res.success && res.category) {
        setCategories((prev) => [...prev, res.category!]);
        setSuccessMessage(`Đã tạo danh mục "${res.category.name}" thành công!`);
        setIsAdding(false);
      } else {
        setErrorMessage(res.error || "Không thể tạo danh mục");
      }
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${catName}"?`)) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await deleteCategoryAction(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccessMessage(`Đã xóa danh mục "${catName}" thành công!`);
    } else {
      setErrorMessage(res.error || "Không thể xóa danh mục");
    }
  };

  // Group top-level and children
  const topLevel = categories.filter((c) => !c.parentId);
  const getChildren = (pId: string) => categories.filter((c) => c.parentId === pId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#29241E]">
            Quản trị danh mục phân cấp (Hierarchy Taxonomy)
          </h1>
          <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
            Phân loại sản phẩm theo phòng và cấu trúc cây danh mục, tự động ngăn chặn vòng lặp cha-con (A005).
          </p>
        </div>
        {!isAdding && !editingCat && (
          <Button variant="primary" size="sm" onClick={startAdd} className="gap-1.5 shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Thêm danh mục mới</span>
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="p-3 bg-[#EBF0ED] border border-[#C5D3CC] rounded-xl text-xs text-[#3E5247] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5B7065] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[#FDF2F0] border border-[#F5C2BC] rounded-xl text-xs text-[#A05C52] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Add / Edit Form Modal/Drawer */}
      {(isAdding || editingCat) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#5B7065] rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
            <h2 className="text-sm font-bold text-[#29241E] flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-[#5B7065]" />
              <span>{editingCat ? `Chỉnh sửa: ${editingCat.name}` : "Tạo danh mục mới"}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingCat(null);
              }}
              className="text-xs text-[#786C5E] hover:text-[#29241E]"
            >
              Hủy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Tên danh mục *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Kệ góc chữ L"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Slug đường dẫn *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ke-goc-chu-l"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">
                Danh mục cha (Tùy chọn)
              </label>
              <select
                value={parentId || ""}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              >
                <option value="">-- Là danh mục gốc (Top-level) --</option>
                {categories
                  .filter((c) => !editingCat || c.id !== editingCat.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parentId ? `↳ ${c.name}` : c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Mô tả định vị</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tối ưu góc phòng khách hoặc góc học tập hẹp"
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A4033] mb-1">Thứ tự hiển thị</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs font-mono text-[#29241E]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E0D6]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setEditingCat(null);
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              {editingCat ? "Lưu thay đổi" : "Tạo danh mục"}
            </Button>
          </div>
        </form>
      )}

      {/* Categories Hierarchy Table */}
      <div className="bg-white border border-[#E7E0D6] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E0D6] text-[#5A4033] font-bold">
              <th className="py-3 px-4">Tên danh mục / Cấu trúc phân cấp</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Phòng</th>
              <th className="py-3 px-4">Số sản phẩm</th>
              <th className="py-3 px-4">Thứ tự</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EFEA]">
            {topLevel.map((cat) => {
              const children = getChildren(cat.id);
              return (
                <React.Fragment key={cat.id}>
                  {/* Parent row */}
                  <tr className="hover:bg-[#FAF8F5]/80 transition-colors font-semibold">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-[#29241E]">
                        <span className="w-2 h-2 rounded-full bg-[#5B7065]" />
                        <span>{cat.name}</span>
                      </div>
                      <div className="text-[10px] text-[#786C5E] font-normal pl-4 mt-0.5">
                        {cat.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#786C5E]">{cat.slug}</td>
                    <td className="py-3 px-4 text-[#5A4033] capitalize">{cat.roomType}</td>
                    <td className="py-3 px-4 font-bold text-[#5B7065]">{cat.productCount}</td>
                    <td className="py-3 px-4 font-mono">{cat.displayOrder}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-[#5A4033] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-[#A05C52] hover:text-[#7A362D] hover:bg-[#FDF2F0] rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Children rows */}
                  {children.map((child) => (
                    <tr key={child.id} className="bg-[#FAF8F5]/30 hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-2.5 px-4 pl-8">
                        <div className="flex items-center gap-2 text-[#5A4033]">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#5B7065]" />
                          <span>{child.name}</span>
                        </div>
                        <div className="text-[10px] text-[#786C5E] pl-5">{child.description}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[#786C5E]">{child.slug}</td>
                      <td className="py-2.5 px-4 text-[#786C5E] capitalize">{child.roomType}</td>
                      <td className="py-2.5 px-4 font-bold text-[#5B7065]">{child.productCount}</td>
                      <td className="py-2.5 px-4 font-mono">{child.displayOrder}</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(child)}
                            className="p-1.5 text-[#5A4033] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id, child.name)}
                            className="p-1.5 text-[#A05C52] hover:text-[#7A362D] hover:bg-[#FDF2F0] rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

