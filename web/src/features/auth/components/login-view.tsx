"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LogIn, Sparkles, UserCheck } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LoginView() {
  const router = useRouter();
  const { login, demoCustomer, demoAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      if (email.trim().toLowerCase() === demoAdmin.email) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setError(res.error || "Đăng nhập thất bại");
    }
  };

  const handleFillDemo = (type: "customer" | "admin") => {
    if (type === "customer") {
      setEmail(demoCustomer.email);
      setPassword("password123");
    } else {
      setEmail(demoAdmin.email);
      setPassword("admin123");
    }
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#5B7065] text-white flex items-center justify-center mx-auto shadow-xs">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#29241E]">Đăng nhập Small Living</h1>
        <p className="text-xs text-[#786C5E]">
          Truy cập hệ thống quản lý không gian và đơn hàng cá nhân
        </p>
      </div>

      {/* Preset demo credentials */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#29241E]">
          <Sparkles className="w-3.5 h-3.5 text-[#5B7065]" />
          <span>Chọn tài khoản trải nghiệm một chạm:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleFillDemo("customer")}
            className="p-2.5 rounded-lg border border-[#D3C7B7] bg-white hover:border-[#5B7065] hover:bg-[#FAF8F5] text-left transition-all"
          >
            <strong className="block text-[#29241E]">Khách hàng</strong>
            <span className="text-[10px] text-[#786C5E]">demo.customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo("admin")}
            className="p-2.5 rounded-lg border border-[#D3C7B7] bg-white hover:border-[#5B7065] hover:bg-[#FAF8F5] text-left transition-all"
          >
            <strong className="block text-[#29241E]">Quản trị viên</strong>
            <span className="text-[10px] text-[#786C5E]">admin@smallliving</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E7E0D6] rounded-2xl p-6 shadow-xs space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#5A4033] mb-1">Email đăng nhập</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[#5A4033]">Mật khẩu</label>
            <Link href="/account" className="text-[11px] text-[#5B7065] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#FAF8F5] border border-[#D3C7B7] rounded-lg px-3 py-2 text-xs text-[#29241E] focus:outline-none focus:border-[#5B7065]"
          />
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full text-xs font-bold gap-2">
          <UserCheck className="w-4 h-4" />
          <span>Đăng nhập hệ thống</span>
        </Button>

        <div className="pt-2 text-center text-xs text-[#786C5E] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B7065]" />
          <span>Phiên làm việc bảo mật & lưu cục bộ</span>
        </div>
      </form>
    </div>
  );
}

