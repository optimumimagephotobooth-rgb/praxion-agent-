import * as React from "react";
import { cn } from "@/lib/utils";

type GlowIntensity = "low" | "medium" | "high";

const glowIntensity: Record<GlowIntensity, string> = {
  low: "shadow-purple-500/10 shadow-cyan-500/5",
  medium: "shadow-purple-500/20 shadow-cyan-500/10",
  high: "shadow-purple-500/30 shadow-cyan-500/15"
};

export function N8nGlassCard({
  children,
  intensity = "medium",
  hasAmbientGlow = true,
  className
}: {
  children: React.ReactNode;
  intensity?: GlowIntensity;
  hasAmbientGlow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-700/40",
        "bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/70",
        "backdrop-blur-xl transition-all duration-500 hover:border-purple-500/40 hover:shadow-xl",
        glowIntensity[intensity],
        hasAmbientGlow && "animate-gentle-pulse",
        className
      )}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 animate-ambient-glow" />
      </div>
      <div className="absolute left-0 top-0 h-16 w-16 -translate-x-8 -translate-y-8">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-xl" />
      </div>
      <div className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-xl" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px animate-data-stream opacity-50" />
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}

type NodeType = "default" | "trigger" | "action" | "data";
type NodeStatus = "idle" | "active" | "processing" | "success";

export function N8nNode({
  title,
  status = "idle",
  type = "default"
}: {
  title: string;
  status?: NodeStatus;
  type?: NodeType;
}) {
  const typeConfig: Record<NodeType, { bg: string; border: string; icon: string; color: string }> =
    {
      default: {
        bg: "bg-gradient-to-br from-slate-800 to-slate-900",
        border: "border-purple-500/30",
        icon: "⚡",
        color: "text-purple-400"
      },
      trigger: {
        bg: "bg-gradient-to-br from-purple-900/30 to-purple-800/20",
        border: "border-purple-400/40",
        icon: "▶",
        color: "text-purple-300"
      },
      action: {
        bg: "bg-gradient-to-br from-cyan-900/30 to-cyan-800/20",
        border: "border-cyan-400/40",
        icon: "↯",
        color: "text-cyan-300"
      },
      data: {
        bg: "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20",
        border: "border-emerald-400/40",
        icon: "⭮",
        color: "text-emerald-300"
      }
    };

  const statusConfig: Record<NodeStatus, string> = {
    idle: "opacity-100",
    active: "animate-node-glow opacity-100",
    processing: "animate-pulse opacity-90",
    success: "animate-pulse opacity-100"
  };

  const config = typeConfig[type];

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        config.bg,
        config.border,
        statusConfig[status]
      )}
    >
      <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-70 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100 animate-ambient-glow" />
      <div
        className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-70 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100 animate-ambient-glow"
        style={{ animationDelay: "1000ms" }}
      />
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-transform duration-300 group-hover:scale-110",
            config.bg,
            config.border,
            status === "active" && "animate-ambient-glow"
          )}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className={cn("font-medium", config.color)}>{title}</div>
          <div className="mt-1 text-xs text-slate-400">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute right-3 top-3 h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400",
          status === "active" ? "animate-pulse" : "opacity-50"
        )}
      />
    </div>
  );
}

export function N8nPipeline({
  steps
}: {
  steps: Array<{
    id: string | number;
    title: string;
    status: string;
    active?: boolean;
    icon: React.ReactNode;
  }>;
}) {
  return (
    <div className="relative p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/50 [background-image:linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="relative z-10 flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 flex-col items-center">
            {index < steps.length - 1 && (
              <div className="relative mx-4 h-0.5 flex-1 -translate-y-6 overflow-hidden bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30">
                <div className="absolute inset-y-0 w-8 animate-[shimmer_2s_infinite_linear] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
              </div>
            )}
            <div
              className={cn(
                "group relative flex h-16 w-16 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-110",
                step.active
                  ? "border-purple-500/40 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 animate-ambient-glow"
                  : "border-slate-700/50 bg-slate-800/50"
              )}
            >
              {step.icon}
              {step.active && (
                <div className="absolute inset-0 animate-spin rounded-xl border-2 border-transparent border-r-cyan-400 border-t-purple-400 opacity-50 [animation-duration:3s]" />
              )}
            </div>
            <div className="mt-3 text-center">
              <div
                className={cn(
                  "text-sm font-medium",
                  step.active ? "text-cyan-300" : "text-slate-400"
                )}
              >
                {step.title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{step.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function N8nStatusIndicator({
  status = "idle",
  size = "md"
}: {
  status?: "idle" | "active" | "processing" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6"
  };

  const statusConfig = {
    idle: {
      bg: "bg-gradient-to-br from-slate-500 to-slate-600",
      animation: ""
    },
    active: {
      bg: "bg-gradient-to-br from-emerald-500 to-cyan-500",
      animation: "animate-ambient-glow"
    },
    processing: {
      bg: "bg-gradient-to-br from-cyan-500 to-purple-500",
      animation: "animate-pulse animate-ambient-glow"
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      animation: "animate-pulse [animation-duration:2s]"
    },
    error: {
      bg: "bg-gradient-to-br from-red-500 to-pink-500",
      animation: "animate-pulse [animation-duration:1s]"
    }
  };

  const config = statusConfig[status];

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-md opacity-30",
          config.bg,
          config.animation
        )}
      />
      <div
        className={cn(
          "relative rounded-full shadow-lg",
          sizeClasses[size],
          config.bg,
          config.animation
        )}
      />
      {["active", "processing"].includes(status) && (
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-current opacity-0 [animation-duration:3s]" />
      )}
    </div>
  );
}

export function N8nButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const baseClasses =
    "group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white shadow-lg animate-gentle-pulse hover:from-purple-700 hover:via-purple-600 hover:to-cyan-600",
    secondary:
      "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-slate-200 hover:border-purple-500/50 hover:shadow-purple-500/20",
    ghost: "text-slate-300 hover:bg-slate-800/50 hover:text-white"
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-70" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
