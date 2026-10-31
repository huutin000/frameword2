"use client";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/store";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/image";

export default function DetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name)")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (isLoading) return <div className="container p-4">Đang tải chi tiết sản phẩm...</div>;
  if (error || !product) return <div className="container p-4 text-danger">Không tìm thấy sản phẩm.</div>;

  return (
    <>
      <div className="product-detail">
        <div className="product-images">
          <img src={getImageUrl(product.image)} alt={product.name} style={{ width: "230px" }} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">
            Khuyến Mãi: {Number(product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>

          {product.del && Number(product.del) > 0 && (
            <del className="sale">
              <del>Giá Gốc: {Number(product.del).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
            </del>
          )}

          <div className="product-options">
            <label>Số lượng:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>
          <button
            className="add-to-cart"
            onClick={() => dispatch(addToCart({ item: product, quantity: quantity }))}
          >
            <i className="fa fa-cart-plus"></i> Thêm vào giỏ hàng
          </button>
        </div>
        <div className="product-description">
          <h2>Chi tiết sản phẩm</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </>
  );
}
