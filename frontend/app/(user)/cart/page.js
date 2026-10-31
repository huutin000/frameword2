"use client";
import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "@/lib/store";
import { getImageUrl } from "@/lib/image";

const CartPage = () => {
  const dispatch = useDispatch();
  const rawItems = useSelector((state) => state.cart?.items);
  const cartItems = useMemo(() => rawItems || [], [rawItems]);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      ),
    [cartItems]
  );

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
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Giỏ hàng của bạn đang trống.
                </td>
              </tr>
            ) : (
              cartItems.map((item) => {
                const id = item.id || item._id;
                return (
                  <tr key={id}>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={getImageUrl(item.image)}
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
                          dispatch(
                            updateCartItemQuantity({
                              id: id,
                              _id: id,
                              quantity: parseInt(e.target.value, 10) || 1,
                            })
                          )
                        }
                      />
                    </td>
                    <td>
                      {Number(item.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {(
                        (Number(item.price) || 0) *
                        (Number(item.quantity) || 1)
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => dispatch(removeFromCart(id))}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            <tr className="table-primary">
              <td colSpan="4" className="text-right">
                Tổng cộng
              </td>
              <td>
                {total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartPage;
