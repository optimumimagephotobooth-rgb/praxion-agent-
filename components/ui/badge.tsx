import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "destructive";
};

const variants = {
  default: "bg-[#3B82F6]/10 text-[#3B82F6]",
  success: "bg-[#10B981]/10 text-[#10B981]",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  destructive: "bg-[#EF4444]/10 text-[#EF4444]"
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
