import React from "react";
import ProductCard from "../components/productcard";

export default async function search(params) {
  console.log(params);
  const res = await fetch("http://localhost:3000/product/search/" + params.searchParams.keyword);
  const productSearch = await res.json();
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12">
          <h3>Kết quả tìm kiếm cho từ khóa: {params.searchParams.keyword}</h3>
          <div className="row">
            <ProductCard data={productSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
