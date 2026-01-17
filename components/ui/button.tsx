import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md";
};

const baseStyles =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
};

const sizes = {
  sm: "h-8 px-3",
  md: "h-9 px-4"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
