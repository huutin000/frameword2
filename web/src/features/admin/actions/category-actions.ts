"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../data/category-store";

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  roomType: string;
  displayOrder: number;
}) {
  const res = createCategory(data);
  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");
  }
  return res;
}

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    slug?: string;
    parentId?: string | null;
    description?: string;
    roomType?: string;
    displayOrder?: number;
  }
) {
  const res = updateCategory(id, data);
  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");
  }
  return res;
}

export async function deleteCategoryAction(id: string) {
  const res = deleteCategory(id);
  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");
  }
  return res;
}

