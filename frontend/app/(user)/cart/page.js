"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../redux/slices/cartslice";
import { useMemo } from "react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Đọc dữ liệu từ localStorage trên client
    const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedItems);
  }, []);

  // Cập nhật cartItems từ Redux store
  const itemsFromStore = useSelector((state) => state.cart?.items) || [];
  useEffect(() => {
    setCartItems(itemsFromStore);
  }, [itemsFromStore]);

  const total = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return (
    <div className="container mt-3">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Giá</th>
              <th scope="col">Thành tiền</th>
              <th scope="col">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/image/${item.image}`}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxWidth: "100px" }}
                  />
                </td>
                <td>
                  <input
                    min="1"
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(updateCartItemQuantity({ _id: item._id, quantity: parseInt(e.target.value) }))
                    }
                  />
                </td>
                <td>{item.price.toLocaleString()}</td>
                <td>{(item.price * item.quantity).toLocaleString()}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => dispatch(removeFromCart(item._id))}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            <tr className="table-primary">
              <td colSpan="4" className="text-right">
                Tổng cộng
              </td>
              <td>{total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartPage;
