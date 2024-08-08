"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartslice";
import { useState } from "react";
export default function ProductCard(props) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  return (
    <>
      <div className="box-sanpham">
        {props.data.map((product) => {
          const { _id, name, price, del, image } = product;
          return (
            <div className="boder-sanpham" id="dienthoai" key={_id}>
              <div className="sanpham border-blue">
                <span className="label-tragop">Trả góp 1%</span>
                <Link href={`/product-detail/${product._id}`}>
                  <img src={`http://localhost:3000/image/${image}`} alt={name} />
                </Link>
                <span className="label-sale">
                  <i className="fa-regular fa-bell"></i> FLASH SALE GIÁ SỐC
                </span>
                <br />
                <span>{name}</span>
                <br />
                <p className="gia">
                  {price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  {del && (
                    <>
                      <br />
                      <del>{del.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
                    </>
                  )}
                </p>
                <button className="dat-hang" onClick={() => dispatch(addToCart({ item: product, quantity: quantity }))}>
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
