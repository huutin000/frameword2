import React from "react";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function search(params) {
  const keyword = params.searchParams?.keyword || "";
  let productSearch = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .ilike("name", `%${keyword}%`);

    if (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
    } else {
      productSearch = data || [];
    }
  } catch (err) {
    console.error("Lỗi kết nối tìm kiếm:", err);
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12">
          <h3>Kết quả tìm kiếm cho từ khóa: {keyword}</h3>
          <div className="row">
            <ProductCard data={productSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
