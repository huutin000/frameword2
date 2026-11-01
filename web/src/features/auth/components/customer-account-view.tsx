"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Home,
  LogOut,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { getAllOrders } from "@/features/orders/data/order-store";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";

export function CustomerAccountView() {
  const { user, isAuthenticated, logout, updateProfile, addAddress, removeAddress, requestReset, demoCustomer } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders" | "security">("profile");

  // Local state for address form modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newDistrict, setNewDistrict] = useState("Cầu Giấy");
  const [newProvince, setNewProvince] = useState("Hà Nội");
  const [newNotes, setNewNotes] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");

  // Password reset message
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // Return / Refund modal state (U038)
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("Kích thước không vừa khe tường sau khi đo lại");
  const [refundSubmittedOrders, setRefundSubmittedOrders] = useState<Record<string, string>>({});

  const orders = getAllOrders();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#EBF0ED] text-[#5B7065] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#29241E]">Đăng nhập tài khoản Small Living</h1>
          <p className="text-xs text-[#786C5E]">
            Đăng nhập để xem lịch sử đơn hàng, sổ địa chỉ và đồng bộ hồ sơ không gian phòng của bạn.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] text-left text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#29241E]">
            <Sparkles className="w-3.5 h-3.5 text-[#5B7065]" />
            <span>Tài khoản Demo Portfolio có sẵn:</span>
          </div>
          <p className="text-[#5A4033]">
            Email: <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E7E0D6]">{demoCustomer.email}</code>
          </p>
          <p className="text-[#5A4033]">
            Mật khẩu: <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E7E0D6]">password123</code>
          </p>
        </div>
        <Link href="/login" className="block">
          <Button variant="primary" size="md" className="w-full">
            Đến trang Đăng nhập Demo
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreet) return;
    addAddress({
      recipientName: newRecipient,
      phone: newPhone,
      street: newStreet,
      ward: "Phường Dịch Vọng Hậu",
      district: newDistrict,
      province: newProvince,
      isDefault,
      notes: newNotes,
    });
    setShowAddAddress(false);
    setNewRecipient("");
    setNewPhone("");
    setNewStreet("");
    setNewNotes("");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName: editName, phone: editPhone });
    setIsEditingProfile(false);
  };

  const handleRequestReset = () => {
    const res = requestReset(user.email);
    setResetStatus(res.message);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#5B7065] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#29241E]">{user.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0ED] text-[#5B7065] border border-[#C5D3CC]">
                {user.role === "admin" ? "Quản trị viên" : "Thành viên Small Living"}
              </span>
            </div>
            <p className="text-xs text-[#786C5E] flex items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/room-profile">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Home className="w-3.5 h-3.5" />
              <span>Hồ sơ phòng</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Tabs + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="bg-white border border-[#E7E0D6] rounded-xl p-2 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
              activeTab === "profile"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:bg-[#FAF8F5]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hồ sơ cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
              activeTab === "addresses"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:bg-[#FAF8F5]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Sổ địa chỉ nhận hàng</span>
            <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
              {user.addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
              activeTab === "orders"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:bg-[#FAF8F5]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Đơn hàng của tôi</span>
            <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
              activeTab === "security"
                ? "bg-[#5B7065] text-white shadow-xs"
                : "text-[#5A4033] hover:bg-[#FAF8F5]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Bảo mật & Sandbox</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="md:col-span-3 bg-white border border-[#E7E0D6] rounded-2xl p-6 sm:p-8 min-h-[400px]">
          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
                <h2 className="text-base font-bold text-[#29241E]">Thông tin tài khoản</h2>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditName(user.fullName);
                      setEditPhone(user.phone);
                      setIsEditingProfile(true);
                    }}
                    className="text-xs"
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-[#5A4033] mb-1">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A4033] mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Lưu thay đổi
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6]">
                    <span className="text-[#786C5E] block mb-1">Họ và tên:</span>
                    <strong className="text-sm text-[#29241E] font-semibold">{user.fullName}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6]">
                    <span className="text-[#786C5E] block mb-1">Email đăng ký:</span>
                    <strong className="text-sm font-mono text-[#29241E]">{user.email}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6]">
                    <span className="text-[#786C5E] block mb-1">Số điện thoại:</span>
                    <strong className="text-sm text-[#29241E] font-semibold">{user.phone}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6]">
                    <span className="text-[#786C5E] block mb-1">Ngày tham gia hệ thống:</span>
                    <strong className="text-sm text-[#29241E] font-semibold">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
                <div>
                  <h2 className="text-base font-bold text-[#29241E]">Sổ địa chỉ nhận hàng</h2>
                  <p className="text-xs text-[#786C5E]">Quản lý địa chỉ giao hàng và ghi chú vận chuyển không gian hẹp</p>
                </div>
                {!showAddAddress && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddAddress(true)}
                    className="gap-1.5 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm địa chỉ</span>
                  </Button>
                )}
              </div>

              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-3 text-xs">
                  <h3 className="font-bold text-[#29241E]">Địa chỉ giao hàng mới</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A4033] mb-1 font-medium">Người nhận *</label>
                      <input
                        type="text"
                        required
                        placeholder="Họ tên người nhận"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A4033] mb-1 font-medium">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Số điện thoại"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#5A4033] mb-1 font-medium">Địa chỉ chi tiết (Số nhà, ngõ, tên đường) *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Căn hộ 402, Ngõ 10 Tạ Quang Bửu"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A4033] mb-1 font-medium">Quận / Huyện</label>
                      <input
                        type="text"
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A4033] mb-1 font-medium">Tỉnh / Thành phố</label>
                      <input
                        type="text"
                        value={newProvince}
                        onChange={(e) => setNewProvince(e.target.value)}
                        className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#5A4033] mb-1 font-medium">Ghi chú vận chuyển (VD: Cầu thang hẹp 80cm, gác xép)</label>
                    <input
                      type="text"
                      placeholder="Ghi chú giúp shipper mang vác vừa cửa"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-white border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-[#29241E]"
                    />
                  </div>

                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="rounded border-[#D3C7B7] text-[#5B7065] focus:ring-0"
                    />
                    <span className="text-[#5A4033]">Đặt làm địa chỉ nhận hàng mặc định</span>
                  </label>

                  <div className="flex items-center gap-2 pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Lưu địa chỉ
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddAddress(false)}>
                      Hủy
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border transition-all ${
                      addr.isDefault
                        ? "bg-[#FAF8F5] border-[#5B7065] shadow-xs"
                        : "bg-white border-[#E7E0D6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#29241E]">{addr.recipientName}</strong>
                          <span className="text-[#786C5E] font-mono">{addr.phone}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5B7065] text-white">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-[#5A4033]">
                          {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                        {addr.notes && (
                          <p className="text-[11px] text-[#786C5E] italic">
                            Lưu ý: {addr.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-[#786C5E] hover:text-red-600 p-1 rounded transition-colors"
                        title="Xóa địa chỉ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Orders */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-[#E7E0D6]">
                <h2 className="text-base font-bold text-[#29241E]">Lịch sử đơn hàng của bạn</h2>
                <p className="text-xs text-[#786C5E]">Theo dõi trạng thái và kiểm tra kích thước lắp đặt kiện hàng</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#786C5E] space-y-2">
                  <Package className="w-10 h-10 mx-auto text-[#D3C7B7]" />
                  <p className="text-xs">Bạn chưa có đơn hàng nào.</p>
                  <Link href="/catalog">
                    <Button variant="primary" size="sm" className="mt-2 text-xs">
                      Khám phá danh mục
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E7E0D6] text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#29241E]">#{ord.orderCode}</span>
                          <span className="text-[#786C5E]">
                            {new Date(ord.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0ED] text-[#5B7065] uppercase">
                            {ord.orderStatus}
                          </span>
                          <strong className="text-sm font-bold text-[#29241E]">
                            {formatVND(ord.totalVnd)}
                          </strong>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#5A4033]">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>
                              {it.quantity}x {it.productName}
                            </span>
                            <span className="font-mono text-[#786C5E]">
                              {formatVND(it.unitPriceVnd * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {refundSubmittedOrders[ord.id] && (
                        <div className="p-2.5 rounded-lg bg-[#EBF0ED] border border-[#C5D3CC] text-[11px] text-[#5B7065] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Đã ghi nhận yêu cầu đổi trả: <strong>{refundSubmittedOrders[ord.id]}</strong> (Hệ thống sẽ liên hệ thu hồi kiện hàng).</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2">
                        {!refundSubmittedOrders[ord.id] && (
                          <button
                            type="button"
                            onClick={() => setRefundOrderId(ord.id)}
                            className="text-[11px] text-[#786C5E] hover:text-[#5B7065] hover:underline flex items-center gap-1 font-medium"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Yêu cầu đổi trả demo (U038)</span>
                          </button>
                        )}
                        <Link href={`/orders/${ord.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                            <span>Theo dõi lộ trình</span>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>

                      {/* Return / Refund Modal */}
                      {refundOrderId === ord.id && (
                        <div className="p-3.5 rounded-xl bg-white border border-[#D3C7B7] space-y-2.5 shadow-sm text-xs animate-in fade-in">
                          <div className="flex items-center justify-between pb-1 border-b border-[#E7E0D6]">
                            <strong className="text-[#29241E] font-bold flex items-center gap-1.5">
                              <RotateCcw className="w-3.5 h-3.5 text-[#5B7065]" />
                              <span>Đăng ký đổi trả demo cho đơn #{ord.orderCode}</span>
                            </strong>
                            <button
                              type="button"
                              onClick={() => setRefundOrderId(null)}
                              className="text-[#786C5E] hover:text-[#29241E] text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-[11px] text-[#786C5E]">
                            Chính sách 30 ngày đổi trả miễn phí nếu nội thất không vừa vặn với kích thước thực tế căn phòng.
                          </p>
                          <div>
                            <label className="block text-[#5A4033] mb-1 font-medium">Lý do yêu cầu đổi trả *</label>
                            <select
                              value={refundReason}
                              onChange={(e) => setRefundReason(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-2.5 py-1.5 text-xs text-[#29241E]"
                            >
                              <option>Kích thước không vừa khe tường sau khi đo lại</option>
                              <option>Chủ nhà siết quy định, cần đổi sang mẫu hoàn toàn không khoan đục</option>
                              <option>Muốn đổi sang màu sắc / chất liệu gỗ khác</option>
                              <option>Sản phẩm bị xước xát trong lúc vận chuyển</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setRefundOrderId(null)}
                              className="text-xs h-7"
                            >
                              Hủy
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setRefundSubmittedOrders((prev) => ({ ...prev, [ord.id]: refundReason }));
                                setRefundOrderId(null);
                              }}
                              className="text-xs h-7"
                            >
                              Gửi yêu cầu đổi trả
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Security Sandbox */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-md">
              <div className="pb-3 border-b border-[#E7E0D6]">
                <h2 className="text-base font-bold text-[#29241E]">Bảo mật & Sandbox</h2>
                <p className="text-xs text-[#786C5E]">Môi trường thử nghiệm an toàn, không gửi email thực tế</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#29241E]">
                  <Shield className="w-4 h-4 text-[#5B7065]" />
                  <span>Khôi phục mật khẩu demo (U022 Sandbox)</span>
                </div>
                <p className="text-[#5A4033]">
                  Thử nghiệm quy trình gửi mã reset mật khẩu. Hệ thống sẽ mô phỏng việc sinh token xác thực an toàn.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestReset}
                  className="text-xs"
                >
                  Gửi yêu cầu reset tới {user.email}
                </Button>

                {resetStatus && (
                  <div className="p-2.5 rounded-lg bg-[#EBF0ED] border border-[#C5D3CC] text-[#5B7065] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resetStatus}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
