import React from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventoryBalance } from "@/types/commerce";

export interface InventoryAlertCardProps {
  alerts: InventoryBalance[];
}

export function InventoryAlertCard({ alerts }: InventoryAlertCardProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E0D6] p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3EFEA]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#B85D43]" />
          <h2 className="text-sm font-bold text-[#29241E]">Cảnh báo tồn kho</h2>
        </div>
        <span className="text-[11px] font-bold text-[#B85D43] bg-[#F9EBE7] px-2 py-0.5 rounded-full">
          {alerts.length} mã
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((item) => (
          <div
            key={item.sku}
            className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-mono text-[#786C5E]">{item.sku}</span>
              <Badge variant="error" className="text-[10px]">
                Còn {item.availableStock} cái
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-[#29241E] leading-snug">{item.productName}</h4>
            <div className="text-[10px] text-[#786C5E]">Kích thước: {item.dimensions}</div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full text-xs">
        <span>Mở sổ cái quản lý kho tồn</span>
      </Button>
    </div>
  );
}

