import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
}

const variants: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700"
};

export function Toast({
  className,
  variant = "success",
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
