"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/store";
import { useState } from "react";
import { getImageUrl } from "@/lib/image";

export default function ProductCard(props) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  if (!props.data || props.data.length === 0) {
    return (
      <div className="p-3 text-muted">
        <p>Hiện chưa có sản phẩm nào trong mục này.</p>
      </div>
    );
  }

  return (
    <>
      <div className="box-sanpham">
        {props.data.map((product) => {
          const id = product.id || product._id;
          const { name, price, del, image } = product;
          return (
            <div className="boder-sanpham" id="dienthoai" key={id}>
              <div className="sanpham border-blue">
                <span className="label-tragop">Trả góp 1%</span>
                <Link href={`/product-detail/${id}`}>
                  <img src={getImageUrl(image)} alt={name} />
                </Link>
                <span className="label-sale">
                  <i className="fa-regular fa-bell"></i> FLASH SALE GIÁ SỐC
                </span>
                <br />
                <span>{name}</span>
                <br />
                <p className="gia">
                  {Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  {del && Number(del) > 0 && (
                    <>
                      <br />
                      <del>{Number(del).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
                    </>
                  )}
                </p>
                <button
                  className="dat-hang"
                  onClick={() => dispatch(addToCart({ item: product, quantity: quantity }))}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

