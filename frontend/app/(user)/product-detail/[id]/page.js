"use client";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartslice";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function DetailPage({ params }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/product/productdetail/${params.id}`, fetcher, {
    refreshInterval: 6000,
  });

  if (error) return <div>Lỗi load dữ liệu.</div>;
  if (isLoading) return <div>Đang tải</div>;

  return (
    <>
      <div className="product-detail">
        <div className="product-images">
          <img src={`http://localhost:3000/image/${product.image}`} alt={product.name} style={{ width: "230px" }} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">
            Khuyến Mãi: {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>

          <del className="sale">
            <del>Gía Gốc:{product.del.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
          </del>

          <div className="product-options">
            <label>Số lượng:</label>
            <input type="number" id="quantity" name="quantity" min="1" defaultValue={1} />
          </div>
          <button className="add-to-cart" onClick={() => dispatch(addToCart({ item: product, quantity: quantity }))}>
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
