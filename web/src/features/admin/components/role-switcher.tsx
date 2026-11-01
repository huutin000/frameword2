"use client";

import React, { useState } from "react";
import { Shield, ChevronDown, Check, UserCheck } from "lucide-react";
import { ROLE_DEFINITIONS } from "../utils/permissions";
import { useAdminRole } from "../hooks/use-admin-role";

export function RoleSwitcher() {
  const { role, setRole, roleDefinition } = useAdminRole();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList = Object.values(ROLE_DEFINITIONS);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#D3C7B7] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Shield className="w-3.5 h-3.5 text-[#5B7065]" />
        <div className="text-left hidden sm:block">
          <div className="font-bold text-[#29241E] leading-none">{roleDefinition.title}</div>
          <div className="text-[9px] text-[#786C5E] mt-0.5">ACL Multi-Role</div>
        </div>
        <ChevronDown className="w-3 h-3 text-[#786C5E]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="listbox"
            className="absolute right-0 mt-2 w-72 bg-white border border-[#E7E0D6] rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-1"
          >
            <div className="px-3 py-2 border-b border-[#F3EFEA] text-[11px] font-semibold text-[#786C5E] flex items-center justify-between">
              <span>Chuyển đổi vai trò thẩm định</span>
              <span className="text-[9px] bg-[#EBF0ED] text-[#2E6F40] px-1.5 py-0.5 rounded font-mono">
                A034/A035
              </span>
            </div>

            {rolesList.map((r) => {
              const isSelected = r.id === role;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors ${
                    isSelected
                      ? "bg-[#5B7065]/10 text-[#29241E] font-medium"
                      : "hover:bg-[#FAF8F5] text-[#5A4033]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-[#5B7065] text-white"
                        : "bg-[#FAF8F5] text-[#786C5E] border border-[#D3C7B7]"
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#29241E] truncate">{r.title}</span>
                      <span className="text-[10px] text-[#786C5E] shrink-0 font-mono">
                        {r.permissions.length} quyền
                      </span>
                    </div>
                    <div className="text-[10px] text-[#786C5E] line-clamp-1 mt-0.5">
                      {r.vietnameseTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

