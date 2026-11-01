import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7065] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary: "bg-[#5B7065] text-white hover:bg-[#4A5D53] active:bg-[#3D4D44] shadow-xs",
        secondary: "bg-[#F3EFEA] text-[#29241E] hover:bg-[#E7E0D6] border border-[#D3C7B7]",
        outline: "border border-[#D3C7B7] bg-transparent text-[#29241E] hover:bg-[#F3EFEA]",
        walnut: "bg-[#5A4033] text-white hover:bg-[#432F25] active:bg-[#35241D] shadow-xs",
        terracotta: "bg-[#B85D43] text-white hover:bg-[#9B4E38] shadow-xs",
        ghost: "hover:bg-[#F3EFEA] text-[#29241E]",
        destructive: "bg-[#A83232] text-white hover:bg-[#8B2828]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
