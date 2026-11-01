import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F3EFEA] text-[#29241E] border border-[#D3C7B7]",
        sage: "bg-[#EBF0ED] text-[#5B7065] border border-[#C5D3CC]",
        walnut: "bg-[#F5EFEB] text-[#5A4033] border border-[#DFD1C7]",
        terracotta: "bg-[#F9EBE7] text-[#B85D43] border border-[#EACEC6]",
        nodrill: "bg-[#EBF0ED] text-[#2E6F40] border border-[#BDE0C8] font-bold",
        dimensions: "bg-[#FAF8F5] text-[#786C5E] border border-[#E7E0D6] font-mono text-[11px]",
        warning: "bg-[#FFF8E6] text-[#B87A1E] border border-[#FDE0A2]",
        error: "bg-[#FDF2F2] text-[#A83232] border border-[#F8B4B4]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
