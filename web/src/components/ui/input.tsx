import React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#D3C7B7] bg-[#FFFFFF] px-3 py-2 text-sm text-[#29241E] placeholder:text-[#786C5E] focus-visible:outline-none focus-visible:border-[#5B7065] focus-visible:ring-1 focus-visible:ring-[#5B7065] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
