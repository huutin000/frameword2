"use client";

import React, { useState } from "react";
import { useRoomProfile } from "../context/room-profile-context";
import { ROOM_PRESETS, type RoomProfile, type RoomPreset } from "../types";
import {
  Home,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function RoomProfileView() {
  const {
    profiles,
    activeProfile,
    isHydrated,
    setActiveProfileId,
    saveProfile,
    deleteProfile,
    applyPreset,
  } = useRoomProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRoomType, setFormRoomType] = useState<RoomProfile["roomType"]>("studio");
  const [formWidthMm, setFormWidthMm] = useState(3500);
  const [formDepthMm, setFormDepthMm] = useState(3400);
  const [formHeightMm, setFormHeightMm] = useState(2600);
  const [formFreeWidthMm, setFormFreeWidthMm] = useState(2400);
  const [formFreeDepthMm, setFormFreeDepthMm] = useState(2000);
  const [formFreeHeightMm, setFormFreeHeightMm] = useState(2600);
  const [formIsRented, setFormIsRented] = useState(true);
  const [formNoDrill, setFormNoDrill] = useState(true);
  const [formBudget, setFormBudget] = useState(15000000);
  const [formNotes, setFormNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormName("Phòng mới của tôi");
    setFormRoomType("studio");
    setFormWidthMm(3600);
    setFormDepthMm(3200);
    setFormHeightMm(2600);
    setFormFreeWidthMm(2500);
    setFormFreeDepthMm(2000);
    setFormFreeHeightMm(2600);
    setFormIsRented(true);
    setFormNoDrill(true);
    setFormBudget(15000000);
    setFormNotes("");
    setIsEditing(true);
  };

  const openEditModal = (p: RoomProfile) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormRoomType(p.roomType);
    setFormWidthMm(p.widthMm);
    setFormDepthMm(p.depthMm);
    setFormHeightMm(p.heightMm);
    setFormFreeWidthMm(p.freeWidthMm);
    setFormFreeDepthMm(p.freeDepthMm);
    setFormFreeHeightMm(p.freeHeightMm);
    setFormIsRented(p.isRented);
    setFormNoDrill(p.noDrillRequired);
    setFormBudget(p.targetBudgetVnd || 15000000);
    setFormNotes(p.notes || "");
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Vui lòng nhập tên phòng.");
      return;
    }
    if (formWidthMm < 500 || formDepthMm < 500 || formHeightMm < 1500) {
      alert("Kích thước phòng không hợp lệ (tối thiểu 500mm x 500mm x 1500mm).");
      return;
    }
    if (formFreeWidthMm > formWidthMm || formFreeDepthMm > formDepthMm) {
      alert("Khoảng trống khả dụng không thể lớn hơn kích thước phủ bì của phòng.");
      return;
    }

    saveProfile({
      id: editingId || undefined,
      name: formName.trim(),
      roomType: formRoomType,
      widthMm: Number(formWidthMm),
      depthMm: Number(formDepthMm),
      heightMm: Number(formHeightMm),
      freeWidthMm: Number(formFreeWidthMm),
      freeDepthMm: Number(formFreeDepthMm),
      freeHeightMm: Number(formFreeHeightMm),
      isRented: Boolean(formIsRented),
      noDrillRequired: Boolean(formNoDrill),
      targetBudgetVnd: Number(formBudget),
      notes: formNotes.trim(),
    });

    setIsEditing(false);
    showToast(editingId ? "Đã cập nhật hồ sơ phòng thành công!" : "Đã tạo hồ sơ phòng mới!");
  };

  const handleApplyPreset = (preset: RoomPreset) => {
    applyPreset(preset);
    showToast(`Đã áp dụng mẫu không gian "${preset.name}"!`);
  };

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-[#7A7265]">
        Đang tải hồ sơ không gian của bạn...
      </div>
    );
  }

  const roomAreaM2 = ((activeProfile.widthMm * activeProfile.depthMm) / 1_000_000).toFixed(1);
  const freeAreaM2 = ((activeProfile.freeWidthMm * activeProfile.freeDepthMm) / 1_000_000).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#29241E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#5A4033] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#85A392]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#E7E0D6]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B7065] uppercase tracking-wider">
            <Home className="w-4 h-4" />
            <span>Small Living™ Personal Room Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#29241E] mt-1">
            Hồ Sơ Không Gian Của Bạn
          </h1>
          <p className="text-sm text-[#7A7265] mt-1 max-w-2xl">
            Lưu trữ số đo phòng chính xác (Dài x Rộng x Cao và khoảng trống khả dụng). Thuật toán SpaceFit™ sẽ tự động so khớp từng món đồ nội thất với phòng của bạn trước khi quyết định mua.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B7065] text-white font-semibold text-sm hover:bg-[#4A5D53] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phòng Mới</span>
        </button>
      </div>

      {/* Active Room Hero Card */}
      <div className="my-8 bg-white border-2 border-[#5B7065] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#5B7065] text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>Đang Áp Dụng So Khớp</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#29241E]">
                {activeProfile.name}
              </h2>
              {activeProfile.noDrillRequired && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF9EB] text-[#8C6D1F] border border-[#E8D4A2]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Cấm khoan tường</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#7A7265] mt-1.5">
              {activeProfile.notes || "Chưa có ghi chú quy định không gian."}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#5A4033]">
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E7E0D6]">
                Diện tích tổng: <strong>{roomAreaM2} m²</strong> ({activeProfile.widthMm} × {activeProfile.depthMm} mm)
              </div>
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E7E0D6]">
                Khoảng trống đặt đồ: <strong>{freeAreaM2} m²</strong> ({activeProfile.freeWidthMm} × {activeProfile.freeDepthMm} mm)
              </div>
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E7E0D6]">
                Chiều cao trần: <strong>{activeProfile.freeHeightMm} mm</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openEditModal(activeProfile)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] text-xs font-bold text-[#29241E] hover:bg-[#F2ECE1] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa số đo</span>
            </button>

            <Link
              href="/planner"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#29241E] text-white text-xs font-bold hover:bg-[#1E1A16] transition-colors shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mở 2D Room Planner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Preset Library Section */}
      <div className="my-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#29241E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C1623C]" />
              <span>Mẫu Không Gian Phổ Biến 2026</span>
            </h3>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Chọn nhanh cấu hình phòng có sẵn để thử nghiệm các tính năng SpaceFit và Giải pháp combo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROOM_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white border border-[#E7E0D6] rounded-xl p-5 hover:border-[#5B7065] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#5B7065] border border-[#E7E0D6]">
                    {preset.badge}
                  </span>
                  {preset.noDrillRequired && (
                    <span className="text-[10px] font-bold text-[#8C6D1F]">
                      Không khoan
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#29241E] group-hover:text-[#5B7065] transition-colors">
                  {preset.name}
                </h4>

                <p className="text-xs text-[#7A7265] mt-1.5 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>

                <div className="mt-3 pt-3 border-t border-[#E7E0D6] space-y-1 text-[11px] text-[#5A4033] font-mono">
                  <div>Phủ bì: {preset.widthMm} × {preset.depthMm} mm</div>
                  <div>Trống: {preset.freeWidthMm} × {preset.freeDepthMm} mm</div>
                  <div>Trần: {preset.heightMm} mm</div>
                </div>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                className="mt-4 w-full py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#5B7065] hover:text-white text-xs font-bold text-[#29241E] transition-colors flex items-center justify-center gap-1.5 border border-[#E7E0D6]"
              >
                <span>Sử dụng mẫu này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Room Profiles Grid */}
      <div className="my-10">
        <h3 className="text-lg font-bold text-[#29241E] mb-4">
          Danh Sách Không Gian Đã Lưu ({profiles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile.id;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isActive
                    ? "border-2 border-[#5B7065] shadow-md ring-2 ring-[#5B7065]/10"
                    : "border-[#E7E0D6] hover:border-[#A8A196] shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#29241E]">{p.name}</h4>
                    <span className="text-[11px] text-[#7A7265]">
                      {p.roomType === "studio" && "Căn hộ Studio"}
                      {p.roomType === "rented_room" && "Phòng trọ thuê"}
                      {p.roomType === "kitchen_corner" && "Góc bếp"}
                      {p.roomType === "workspace_corner" && "Góc làm việc"}
                      {p.roomType === "bedroom" && "Phòng ngủ"}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF4F0] text-[#2D5A43] border border-[#B7D5C4]">
                      Đang chọn
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveProfileId(p.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] hover:bg-[#E7E0D6] text-[#29241E] transition-colors"
                    >
                      Chọn phòng này
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-[#5A4033] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7E0D6]">
                  <div className="flex justify-between">
                    <span className="text-[#7A7265]">Kích thước:</span>
                    <strong className="font-mono">{p.widthMm} × {p.depthMm} × {p.heightMm} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7265]">Khoảng trống:</span>
                    <strong className="font-mono">{p.freeWidthMm} × {p.freeDepthMm} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7265]">Quy định khoan:</span>
                    <strong>{p.noDrillRequired ? "Cấm khoan tường" : "Được khoan"}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#E7E0D6]">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-[#7A7265] hover:text-[#29241E] hover:bg-[#FAF7F2] transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={() => deleteProfile(p.id)}
                      className="p-1.5 rounded-lg text-[#9E2A2B] hover:bg-[#FDF2F2] transition-colors"
                      title="Xóa phòng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Edit / Create */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E0D6] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E0D6]">
              <h3 className="text-xl font-bold text-[#29241E]">
                {editingId ? "Chỉnh Sửa Hồ Sơ Không Gian" : "Tạo Hồ Sơ Không Gian Mới"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#7A7265] hover:text-[#29241E] text-sm font-bold"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#29241E] uppercase tracking-wider mb-1">
                  Tên phòng / Không gian *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CC] text-sm text-[#29241E] focus:outline-hidden focus:ring-2 focus:ring-[#5B7065]"
                  placeholder="Ví dụ: Phòng trọ Mễ Trì 15m2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#29241E] uppercase tracking-wider mb-1">
                    Loại phòng
                  </label>
                  <select
                    value={formRoomType}
                    onChange={(e) => setFormRoomType(e.target.value as RoomProfile["roomType"])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CC] text-sm text-[#29241E] focus:outline-hidden focus:ring-2 focus:ring-[#5B7065]"
                  >
                    <option value="studio">Căn hộ Studio</option>
                    <option value="rented_room">Phòng trọ thuê</option>
                    <option value="workspace_corner">Góc làm việc mini</option>
                    <option value="kitchen_corner">Góc bếp</option>
                    <option value="bedroom">Phòng ngủ nhỏ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#29241E] uppercase tracking-wider mb-1">
                    Ngân sách dự tính (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    step={500000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CC] text-sm text-[#29241E] focus:outline-hidden focus:ring-2 focus:ring-[#5B7065]"
                  />
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7E0D6] space-y-3">
                <span className="block text-xs font-bold text-[#5B7065] uppercase tracking-wider">
                  Kích thước phủ bì tổng phòng (mm)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#7A7265] mb-0.5">Dài / Ngang (mm)</label>
                    <input
                      type="number"
                      required
                      value={formWidthMm}
                      onChange={(e) => setFormWidthMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#DED7CC] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A7265] mb-0.5">Sâu / Rộng (mm)</label>
                    <input
                      type="number"
                      required
                      value={formDepthMm}
                      onChange={(e) => setFormDepthMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#DED7CC] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A7265] mb-0.5">Cao trần (mm)</label>
                    <input
                      type="number"
                      required
                      value={formHeightMm}
                      onChange={(e) => setFormHeightMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#DED7CC] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                </div>
              </div>

              {/* Free Usable Dimensions */}
              <div className="bg-[#EEF4F0] p-4 rounded-2xl border border-[#B7D5C4] space-y-3">
                <span className="block text-xs font-bold text-[#2D5A43] uppercase tracking-wider">
                  Khoảng trống thực tế có thể đặt đồ (mm)
                </span>
                <p className="text-[11px] text-[#5B7065] leading-normal">
                  Trừ đi lối mở cửa chính, cửa sổ và đường đi bộ để thuật toán kiểm tra chính xác.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#5B7065] mb-0.5">Trống ngang (mm)</label>
                    <input
                      type="number"
                      required
                      value={formFreeWidthMm}
                      onChange={(e) => setFormFreeWidthMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#B7D5C4] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#5B7065] mb-0.5">Trống sâu (mm)</label>
                    <input
                      type="number"
                      required
                      value={formFreeDepthMm}
                      onChange={(e) => setFormFreeDepthMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#B7D5C4] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#5B7065] mb-0.5">Trần khả dụng (mm)</label>
                    <input
                      type="number"
                      required
                      value={formFreeHeightMm}
                      onChange={(e) => setFormFreeHeightMm(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#B7D5C4] text-xs font-mono text-[#29241E]"
                    />
                  </div>
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNoDrill}
                    onChange={(e) => setFormNoDrill(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B7065] focus:ring-[#5B7065]"
                  />
                  <span className="text-xs font-semibold text-[#29241E]">
                    Chủ nhà / Quy định cấm khoan đục tường (Bắt buộc dùng đồ hít, dán hoặc đứng sàn)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsRented}
                    onChange={(e) => setFormIsRented(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B7065] focus:ring-[#5B7065]"
                  />
                  <span className="text-xs font-semibold text-[#29241E]">
                    Phòng trọ / Căn hộ thuê (Ưu tiên sản phẩm tháo lắp dễ vận chuyển)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#29241E] uppercase tracking-wider mb-1">
                  Ghi chú riêng
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CC] text-xs text-[#29241E] focus:outline-hidden focus:ring-2 focus:ring-[#5B7065]"
                  placeholder="Ví dụ: Ổ cắm điện ở góc trái, có phào chỉ chân tường 50mm..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E0D6]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A7265] hover:text-[#29241E]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5B7065] text-white text-xs font-bold hover:bg-[#4A5D53] shadow-xs"
                >
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
