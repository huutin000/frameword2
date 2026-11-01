import type { LucideIcon } from "lucide-react";
import type { DemoOrder, InventoryBalance } from "@/types/commerce";

export interface KpiMetric {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  colorClass: string;
}

export type { DemoOrder, InventoryBalance };

