import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md";
};

const baseStyles =
  "btn-base inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

const variants = {
  default: "bg-primary text-white hover:bg-primary-hover hover:shadow-lg",
  outline:
    "border border-slate-600/70 bg-slate-900/40 text-slate-100 hover:border-secondary hover:bg-slate-900/70 border-transition"
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
