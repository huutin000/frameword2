import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";
import { RoleSwitcher } from "@/features/admin/components/role-switcher";

export function AdminHeader() {
  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E7E0D6] px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h2 className="text-xs sm:text-sm font-bold text-[#29241E] truncate">Khu vực Quản trị</h2>
        <Badge variant="terracotta" className="text-[10px] hidden sm:inline-flex">
          Demo Environment
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* ACL Multi-Role Switcher for Evaluators (A034 / A035) */}
        <RoleSwitcher />

        <Link
          href="/"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#5B7065] bg-[#EBF0ED] hover:bg-[#DCE5E0] rounded-lg border border-[#C5D3CC] font-medium transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Về cửa hàng</span>
        </Link>
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E7E0D6] text-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5B7065] text-white flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-[#29241E]">System Admin</div>
            <div className="text-[10px] text-[#786C5E]">admin@smallliving.local</div>
          </div>
        </div>
      </div>
    </header>
  );
}

