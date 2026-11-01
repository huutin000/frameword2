"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  ShoppingBag,
  Tag,
  Palette,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
  Users,
  Compass,
  Inbox,
  Lock,
} from "lucide-react";
import { useAdminRole } from "@/features/admin/hooks/use-admin-role";

const ADMIN_NAVIGATION = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Sản phẩm & Biến thể", href: "/admin/products", icon: Package },
  { name: "Danh mục phòng", href: "/admin/categories", icon: Layers },
  { name: "Kho & Sổ cái tồn", href: "/admin/inventory", icon: Warehouse },
  { name: "Đơn hàng Demo", href: "/admin/orders", icon: ShoppingBag },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Khuyến mãi & Mã giảm", href: "/admin/promotions", icon: Tag },
  { name: "Mẫu combo & Giải pháp", href: "/admin/solutions", icon: Palette },
  { name: "Kiểm duyệt đánh giá", href: "/admin/reviews", icon: MessageSquare },
  { name: "Hộp thư tư vấn", href: "/admin/support", icon: Inbox },
  { name: "Báo cáo SpaceFit", href: "/admin/spacefit-reports", icon: Compass },
  { name: "Nhật ký quản trị", href: "/admin/audit-logs", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { canNavigate } = useAdminRole();

  return (
    <aside className="hidden md:flex w-64 bg-[#29241E] text-[#FAF8F5] flex-col justify-between shrink-0 min-h-screen border-r border-[#3E372E]">
      <div>
        {/* Admin Brand Header */}
        <div className="p-5 border-b border-[#3E372E] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5B7065] flex items-center justify-center font-bold text-white shadow-xs">
            SL
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white">Small Living</div>
            <div className="text-[10px] text-[#D3C7B7] uppercase tracking-wider font-semibold">Backoffice Admin</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {ADMIN_NAVIGATION.map((item) => {
            const isActive = pathname === item.href;
            const isAllowed = canNavigate(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={!isAllowed ? "Khu vực bị hạn chế quyền truy cập theo vai trò (A034/A035)" : undefined}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  !isAllowed
                    ? "opacity-40 hover:opacity-75 text-[#D3C7B7]"
                    : isActive
                    ? "bg-[#5B7065] text-white font-semibold shadow-xs"
                    : "text-[#D3C7B7] hover:bg-[#3E372E] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {!isAllowed && (
                  <Lock data-testid="role-lock-icon" className="w-3 h-3 text-[#D3C7B7]/80 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-[#3E372E] space-y-2">
        <div className="px-3 py-2 rounded-lg bg-[#3E372E]/50 text-[11px] text-[#D3C7B7] flex items-center justify-between">
          <span>Phiên bản:</span>
          <span className="font-mono text-white font-semibold">2026.1 (LTS)</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D3C7B7] hover:text-white hover:bg-[#3E372E] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang Storefront</span>
        </Link>
      </div>
    </aside>
  );
}

