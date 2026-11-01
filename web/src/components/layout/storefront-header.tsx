"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Heart,
  Compass,
  Menu,
  X,
  Box,
  ShieldCheck,
  Scale,
  User,
} from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { NotificationCenter } from "@/features/notifications/components/notification-center";
import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";
import { formatVND } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ROOM_NAV = [
  { name: "Phòng trọ / Studio", href: "/catalog?room=studio" },
  { name: "Phòng ngủ", href: "/catalog?room=bedroom" },
  { name: "Góc làm việc mini", href: "/catalog?room=workspace" },
  { name: "Nhà bếp nhỏ", href: "/catalog?room=kitchen" },
  { name: "Ban công & Giặt phơi", href: "/catalog?room=balcony" },
];

const SIGNATURE_NAV = [
  { name: "Shop The Room", href: "/shop-the-room", highlight: true },
  { name: "Giải Pháp Combo", href: "/solutions", highlight: false },
  { name: "2D Room Planner", href: "/planner", highlight: false },
  { name: "Hồ Sơ Không Gian", href: "/room-profile", highlight: false },
];

const PROBLEM_NAV = [
  {
    name: "Không khoan tường",
    href: "/catalog?problem=no-drill",
    highlight: true,
  },
  { name: "Phòng hẹp dưới 15m²", href: "/catalog?problem=tight-space" },
  { name: "Góc chết & Kẽ hẹp", href: "/catalog?problem=dead-corner" },
  { name: "Gấp gọn đa năng", href: "/catalog?problem=foldable" },
];

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function StorefrontHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const { summary, isHydrated } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const cartCount = isHydrated ? summary.itemCount : 0;

  const cleanQ = removeVietnameseTones(searchQuery.trim());
  const suggestions =
    cleanQ.length >= 2
      ? SAMPLE_PRODUCTS.filter(
          (p) =>
            removeVietnameseTones(p.title).includes(cleanQ) ||
            removeVietnameseTones(p.dimensions).includes(cleanQ) ||
            removeVietnameseTones(p.category).includes(cleanQ)
        ).slice(0, 4)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
      router.push(`/catalog/${suggestions[activeSuggestionIndex].id}`);
      setShowSuggestions(false);
      return;
    }
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E0D6]">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 focus-visible:ring-2 focus-visible:ring-[#5B7065] rounded"
        >
          <Image
            src="/brand/small-living-logo.svg"
            alt="Small Living — Không Gian Tinh Gọn 2026"
            width={200}
            height={46}
            priority
            className="h-7 sm:h-9 w-auto max-w-[125px] sm:max-w-none"
          />
        </Link>

        {/* Global Search Bar with Suggestions (U004) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls="search-suggestions-list"
              aria-label="Tìm kiếm sản phẩm theo tên hoặc kích thước mm"
              placeholder="Tìm theo kích thước (vd: kệ 20cm, bàn gấp)..."
              className="w-full bg-[#FFFFFF] border border-[#D3C7B7] rounded-lg pl-9 pr-4 py-2 text-sm text-[#29241E] placeholder-[#786C5E] focus:outline-none focus:border-[#5B7065] focus:ring-1 focus:ring-[#5B7065] transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-[#786C5E] absolute left-3 top-1/2 -translate-y-1/2" />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="search-suggestions-list"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E7E0D6] rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-[#E7E0D6] text-xs animate-in fade-in"
              >
                {suggestions.map((item, idx) => (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={activeSuggestionIndex === idx}
                    onMouseEnter={() => setActiveSuggestionIndex(idx)}
                    onClick={() => {
                      router.push(`/catalog/${item.id}`);
                      setShowSuggestions(false);
                    }}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      activeSuggestionIndex === idx
                        ? "bg-[#FAF8F5] text-[#5B7065]"
                        : "text-[#29241E]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="relative w-8 h-8 rounded bg-[#FAF8F5] shrink-0 overflow-hidden border border-[#E7E0D6]">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="truncate">
                        <strong className="block truncate font-semibold">
                          {item.title}
                        </strong>
                        <span className="font-mono text-[10px] text-[#786C5E]">
                          {item.dimensions}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#5B7065] shrink-0 ml-2">
                      {formatVND(item.priceVnd)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Quick SpaceFit CTA */}
          <Link
            href="/planner"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF0ED] hover:bg-[#DCE5E0] text-[#5B7065] text-xs font-semibold border border-[#C5D3CC] transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Phòng của bạn</span>
          </Link>

          {/* 2D/3D Planner */}
          <Link
            href="/planner"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#5A4033] text-xs font-semibold border border-[#D3C7B7] transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>2D/3D Planner</span>
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="p-2 text-[#786C5E] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded-md transition-colors hidden sm:inline-flex"
            title="So sánh sản phẩm"
          >
            <Scale className="w-5 h-5" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="p-1.5 sm:p-2 text-[#786C5E] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded-md transition-colors relative hidden sm:inline-flex"
            title="Sản phẩm đã lưu"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {isHydrated && wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#A05C52] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Notifications Center (U041) */}
          <NotificationCenter />

          {/* User Account */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="p-1.5 sm:p-2 text-[#786C5E] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded-md transition-colors flex items-center gap-1.5"
            title={
              isAuthenticated
                ? `Tài khoản: ${user?.fullName}`
                : "Đăng nhập tài khoản"
            }
          >
            {isAuthenticated ? (
              <div className="w-6 h-6 rounded-full bg-[#5B7065] text-white flex items-center justify-center text-xs font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            ) : (
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="hidden xl:inline text-xs font-medium text-[#5A4033]">
              {isAuthenticated
                ? user?.fullName?.split(" ").slice(-1)[0]
                : "Đăng nhập"}
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 bg-[#5B7065] text-white hover:bg-[#4A5D53] rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="bg-[#FAF8F5] text-[#5B7065] text-xs font-bold rounded-full min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 flex items-center justify-center transition-transform">
              {cartCount}
            </span>
          </Link>

          {/* Admin Backoffice Entry */}
          <Link
            href="/admin"
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#786C5E] hover:text-[#5A4033] border border-[#D3C7B7] rounded hover:bg-[#F3EFEA] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A4033]" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 text-[#29241E] hover:bg-[#F3EFEA] rounded-md cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Categories Bar & Small Living Spaces */}
      <div className="hidden md:block bg-[#F3EFEA]/80 border-t border-[#E7E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
          {/* Signature Small Living Tools */}
          <div className="flex items-center space-x-1 py-1.5">
            <span className="text-[#5B7065] text-[11px] uppercase tracking-wider font-black mr-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#C1623C]" />
              <span>Không gian:</span>
            </span>
            {SIGNATURE_NAV.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  tool.highlight
                    ? "bg-[#5B7065] text-white hover:bg-[#4A5D53]"
                    : "text-[#29241E] hover:bg-[#E7E0D6]"
                }`}
              >
                {tool.name}
              </Link>
            ))}
          </div>

          {/* Rooms */}
          <div className="flex items-center space-x-1 py-1.5 border-l border-[#D3C7B7] pl-3">
            <span className="text-[#786C5E] text-[11px] uppercase tracking-wider font-semibold mr-1">
              Phòng:
            </span>
            {ROOM_NAV.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-2 py-1 rounded text-[#29241E] hover:bg-[#E7E0D6] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Problems */}
          <div className="flex items-center space-x-1 py-1.5 border-l border-[#D3C7B7] pl-3">
            <span className="text-[#786C5E] text-[11px] uppercase tracking-wider font-semibold mr-1">
              Vấn đề:
            </span>
            {PROBLEM_NAV.map((prob) => (
              <Link
                key={prob.name}
                href={prob.href}
                className={`px-2 py-1 rounded transition-colors ${
                  prob.highlight
                    ? "bg-[#EBF0ED] text-[#2E6F40] font-semibold hover:bg-[#DCE5E0]"
                    : "text-[#29241E] hover:bg-[#E7E0D6]"
                }`}
              >
                {prob.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-t border-[#E7E0D6] px-4 pt-4 pb-6 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#5B7065] uppercase tracking-wider">
              Tính năng quy hoạch không gian
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SIGNATURE_NAV.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-[#FAF7F2] border border-[#E7E0D6] rounded text-xs font-bold text-[#29241E] hover:bg-[#E7E0D6]"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#786C5E] uppercase tracking-wider">
              Theo loại phòng
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_NAV.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-[#FFFFFF] border border-[#E7E0D6] rounded text-sm text-[#29241E] hover:bg-[#F3EFEA]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#786C5E] uppercase tracking-wider">
              Vấn đề không gian
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PROBLEM_NAV.map((prob) => (
                <Link
                  key={prob.name}
                  href={prob.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-[#FFFFFF] border border-[#E7E0D6] rounded text-sm text-[#29241E] hover:bg-[#F3EFEA]"
                >
                  {prob.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E0D6] flex flex-col gap-2">
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-white text-[#29241E] border border-[#D3C7B7] rounded-lg text-sm font-medium"
            >
              <User className="w-4 h-4 text-[#5B7065]" />
              <span>
                {isAuthenticated
                  ? `Tài khoản (${user?.fullName})`
                  : "Đăng nhập tài khoản"}
              </span>
            </Link>
            <Link
              href="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5B7065] text-white rounded-lg text-sm font-medium"
            >
              <Box className="w-4 h-4" />
              <span>Mở 2D / 3D Room Planner</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#F3EFEA] text-[#5A4033] border border-[#D3C7B7] rounded-lg text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Chuyển sang Admin Backoffice</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
