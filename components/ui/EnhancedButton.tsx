"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type EnhancedButtonVariant = "primary" | "secondary" | "success" | "ghost";

export type EnhancedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: EnhancedButtonVariant;
  magnetic?: boolean;
};

export function EnhancedButton({
  children,
  variant = "primary",
  className,
  magnetic = true,
  onMouseMove,
  onMouseLeave,
  type,
  ...props
}: EnhancedButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const variantClasses: Record<EnhancedButtonVariant, string> = {
    primary: "bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white",
    secondary:
      "border border-slate-700/50 bg-slate-900/40 text-slate-100 hover:border-cyan-500/50 hover:bg-slate-900/70",
    success: "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800/50"
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(event);
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceX = x - centerX;
    const distanceY = y - centerY;
    const strength = 0.15;
    const translateX = distanceX * strength;
    const translateY = distanceY * strength;

    buttonRef.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
    buttonRef.current.style.transition = "transform 0.2s ease-out";
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event);
    if (!magnetic || !buttonRef.current) return;

    buttonRef.current.style.transform = "translate(0, 0) scale(1)";
    buttonRef.current.style.transition =
      "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
        magnetic && "magnetic-btn",
        variantClasses[variant],
        className
      )}
      type={type ?? "button"}
      onMouseMove={magnetic ? handleMouseMove : onMouseMove}
      onMouseLeave={magnetic ? handleMouseLeave : onMouseLeave}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
