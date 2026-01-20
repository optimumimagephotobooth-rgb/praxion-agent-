"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ParticleBackground({ className }: { className?: string }) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        id: index,
        size: Math.random() * 4 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        alpha: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      })),
    []
  );

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${particle.alpha}), transparent)`,
            animation: `float-particle ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.alpha
          }}
        />
      ))}
    </div>
  );
}

export function GradientMeshBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-600/10 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-transparent to-cyan-600/10 blur-3xl animate-[pulse_10s_ease-in-out_infinite] [animation-delay:2s]" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-600/10 to-purple-600/10 blur-3xl animate-[pulse_12s_ease-in-out_infinite] [animation-delay:4s]" />
    </div>
  );
}

export function RippleButton({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(event);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
            width: "0",
            height: "0",
            animation: "ripple 0.6s linear"
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function MagneticButton({
  children,
  strength = 0.15,
  scaleOnHover = 1.05,
  glowOnHover = true,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
  scaleOnHover?: number;
  glowOnHover?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "success";
}) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const boundsRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });

  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white",
    secondary:
      "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-slate-200",
    ghost: "text-slate-300 hover:text-white border border-transparent",
    success: "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white"
  };

  React.useEffect(() => {
    const updateBounds = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        boundsRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const { x, y, width, height } = boundsRef.current;
    const distanceX = event.clientX - x;
    const distanceY = event.clientY - y;
    const translateX = distanceX * strength;
    const translateY = distanceY * strength;
    const rotateY = (distanceX / width) * 3;
    const rotateX = -(distanceY / height) * 3;

    buttonRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`;

    if (glowOnHover) {
      const shadowX = (distanceX / width) * 10;
      const shadowY = (distanceY / height) * 10;
      buttonRef.current.style.boxShadow = `${shadowX}px ${shadowY}px 20px 5px rgba(139, 92, 246, 0.2), 0 0 30px rgba(6, 182, 212, 0.1)`;
    }
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform =
      "translate(0, 0) rotateX(0) rotateY(0) scale(1)";
    buttonRef.current.style.transition =
      "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease";

    if (glowOnHover) {
      buttonRef.current.style.boxShadow = "0 10px 25px rgba(139, 92, 246, 0.15)";
    }
  };

  const handleMouseEnter = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transition = "transform 0.2s ease-out, box-shadow 0.2s ease-out";
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg",
        variantClasses[variant],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-70" />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
}

export function MagneticCard({
  children,
  strength = 0.08,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  strength?: number;
}) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    const translateX = distanceX * strength;
    const translateY = distanceY * strength;
    const rotateY = (distanceX / rect.width) * 2;
    const rotateX = -(distanceY / rect.height) * 2;

    cardRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const layers = cardRef.current.querySelectorAll<HTMLElement>(".parallax-layer");
    layers.forEach((layer, index) => {
      const depth = Number(layer.dataset.depth) || (index + 1) * 0.1;
      layer.style.transform = `translate(${translateX * depth}px, ${translateY * depth}px)`;
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "translate(0, 0) rotateX(0) rotateY(0)";
    cardRef.current.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";

    const layers = cardRef.current.querySelectorAll<HTMLElement>(".parallax-layer");
    layers.forEach((layer) => {
      layer.style.transform = "translate(0, 0)";
      layer.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn("will-change-transform transition-transform duration-300 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="space-y-4 p-6">
          <div className="h-4 w-3/4 rounded bg-slate-700/50" />
          <div className="h-3 w-1/2 rounded bg-slate-700/50" />
          <div className="h-3 w-2/3 rounded bg-slate-700/50" />
        </div>
      </div>
    </div>
  );
}

export function OrnamentalSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-cyan-500 border-t-purple-500 [animation-duration:1.5s]" />
      <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-emerald-500 border-l-cyan-500 [animation-direction:reverse] [animation-duration:2s]" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
    </div>
  );
}

export function StaggeredList<T extends { id?: string; content: React.ReactNode }>({
  items,
  animationType = "fadeInUp",
  staggerDelay = 0.05,
  triggerOnView = true,
  className
}: {
  items: T[];
  animationType?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn";
  staggerDelay?: number;
  triggerOnView?: boolean;
  className?: string;
}) {
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const animationConfig = {
    fadeInUp: {
      enter: "opacity-0 translate-y-6",
      active: "animate-fadeInUp"
    },
    fadeInLeft: {
      enter: "opacity-0 -translate-x-6",
      active: "animate-fadeInLeft"
    },
    fadeInRight: {
      enter: "opacity-0 translate-x-6",
      active: "animate-fadeInRight"
    },
    scaleIn: {
      enter: "opacity-0 scale-95",
      active: "animate-scaleIn"
    }
  };

  React.useEffect(() => {
    if (!triggerOnView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const listItems = entry.target.querySelectorAll<HTMLElement>(".stagger-item");
          listItems.forEach((item, index) => {
            window.setTimeout(() => {
              item.classList.add("animate-enter");
              item.classList.add(animationConfig[animationType].active);
            }, index * staggerDelay * 1000);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => observer.disconnect();
  }, [animationType, staggerDelay, triggerOnView]);

  return (
    <div ref={listRef} className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const delayStyle = triggerOnView
          ? undefined
          : { animationDelay: `${index * staggerDelay}s` };

        return (
          <div
            key={item.id ?? index}
            className={cn(
              "stagger-item transition-all duration-700 ease-out will-change-transform",
              animationConfig[animationType].enter,
              !triggerOnView && animationConfig[animationType].active,
              !triggerOnView && "animate-enter"
            )}
            style={delayStyle}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}

export function StaggeredListItem({
  icon,
  title,
  description,
  status = "default",
  isInteractive = true
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  status?: "default" | "active" | "success" | "warning";
  isInteractive?: boolean;
}) {
  const statusColors = {
    default: "border-slate-700/50 hover:border-purple-500/30",
    active: "border-purple-500/50 shadow-purple-500/10",
    success: "border-emerald-500/50 shadow-emerald-500/10",
    warning: "border-amber-500/50 shadow-amber-500/10"
  };

  return (
    <div
      className={cn(
        "group rounded-2xl border bg-gradient-to-br from-slate-900/70 to-slate-900/50 p-6 backdrop-blur-sm shadow-lg transition-all duration-500 ease-out",
        statusColors[status],
        isInteractive && "cursor-pointer hover:scale-[1.02] hover:shadow-xl"
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 p-3 transition-transform duration-500 group-hover:scale-110">
            <div className="text-xl">{icon}</div>
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-slate-400 transition-colors group-hover:text-slate-300">
              {description}
            </p>
          )}
        </div>

        {status !== "default" && (
          <div
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all duration-500 group-hover:scale-110",
              status === "active" && "bg-purple-500/20 text-purple-300",
              status === "success" && "bg-emerald-500/20 text-emerald-300",
              status === "warning" && "bg-amber-500/20 text-amber-300"
            )}
          >
            {status.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

export function MorphingTransition({ isActive }: { isActive: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className={cn(
          "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transition-all duration-1000 ease-in-out",
          isActive ? "scale-x-100" : "scale-x-0"
        )}
      />
    </div>
  );
}

export function ProgressRing({
  progress = 75,
  size = 160,
  strokeWidth = 10,
  trackColor = "rgba(30, 41, 59, 0.5)",
  gradientStart = "#8B5CF6",
  gradientEnd = "#06B6D4",
  showValue = true,
  valueSize = "lg",
  label,
  subLabel,
  animationSpeed = 1000,
  showAnimation = true,
  variant = "default",
  children
}: {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  showValue?: boolean;
  valueSize?: "sm" | "md" | "lg" | "xl";
  label?: string;
  subLabel?: string;
  animationSpeed?: number;
  showAnimation?: boolean;
  variant?: "default" | "success" | "warning" | "danger" | "premium" | "secondary";
  children?: React.ReactNode;
}) {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);
  const valueSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
  };

  const variantConfig = {
    default: {
      track: "stroke-slate-800/50",
      gradient: [gradientStart, gradientEnd],
      glow: "shadow-purple-500/20"
    },
    success: {
      track: "stroke-emerald-900/30",
      gradient: ["#10B981", "#06B6D4"],
      glow: "shadow-emerald-500/20"
    },
    warning: {
      track: "stroke-amber-900/30",
      gradient: ["#F59E0B", "#EC4899"],
      glow: "shadow-amber-500/20"
    },
    danger: {
      track: "stroke-red-900/30",
      gradient: ["#EF4444", "#F97316"],
      glow: "shadow-red-500/20"
    },
    premium: {
      track: "stroke-purple-900/30",
      gradient: ["#8B5CF6", "#EC4899", "#06B6D4"],
      glow: "shadow-purple-500/30"
    },
    secondary: {
      track: "stroke-slate-800/50",
      gradient: ["#94A3B8", "#64748B"],
      glow: "shadow-slate-500/20"
    }
  } as const;

  const config = variantConfig[variant];

  React.useEffect(() => {
    if (!showAnimation) {
      setAnimatedProgress(progress);
      return;
    }
    const duration = animationSpeed;
    const startTime = Date.now();
    const startValue = animatedProgress;
    const endValue = progress;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const percentage = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      setAnimatedProgress(Math.round(currentValue));
      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [progress, showAnimation, animationSpeed, animatedProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  const id = React.useId();

  return (
    <div className="relative inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse [animation-duration:3s]",
            config.glow
          )}
        />
        <svg width={size} height={size} className="-rotate-90 transform">
          <defs>
            <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id={`${id}-progress`} x1="0%" y1="0%" x2="100%" y2="0%">
              {config.gradient.map((color, index) => (
                <stop
                  key={color}
                  offset={`${(index / (config.gradient.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={cn("fill-transparent", config.track)}
            stroke={trackColor}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={`url(#${id}-progress)`}
            style={{
              transition: showAnimation
                ? `stroke-dashoffset ${animationSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                : "none"
            }}
          />
          {showAnimation && animatedProgress > 0 && (
            <g>
              {Array.from({ length: Math.floor(animatedProgress / 10) }).map((_, i) => {
                const angle = (i * 36 * Math.PI) / 180;
                const x = size / 2 + radius * Math.cos(angle);
                const y = size / 2 + radius * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                );
              })}
            </g>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue ? (
            <>
              <div
                className={cn(
                  "bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-bold text-transparent",
                  valueSizeClasses[valueSize]
                )}
              >
                {animatedProgress}%
              </div>
              {label && <div className="mt-2 text-sm text-slate-400">{label}</div>}
            </>
          ) : (
            children
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              className={cn(
                "h-1 w-1 rounded-full",
                animatedProgress >= mark ? "bg-cyan-500" : "bg-slate-700"
              )}
            />
          ))}
        </div>
      </div>
      {subLabel && <div className="mt-4 text-sm text-slate-400">{subLabel}</div>}
    </div>
  );
}

export function ProgressRingGroup({
  rings,
  columns = 3
}: {
  rings: Array<
    {
      title: string;
      description: string;
      action?: string;
      icon?: React.ComponentType<{ className?: string }>;
    } & React.ComponentProps<typeof ProgressRing>
  >;
  columns?: 1 | 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-8",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {rings.map((ring, index) => (
        <div
          key={`${ring.title}-${index}`}
          className="stagger-item translate-y-6 opacity-0 animate-fadeInUp transition-all duration-700 ease-out"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/70 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/30">
            <div className="flex flex-col items-center">
              {ring.icon && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-gradient-to-br from-purple-600/20 to-cyan-600/20">
                  <ring.icon className="h-5 w-5 text-cyan-300" />
                </div>
              )}
              <ProgressRing {...ring} />
              <div className="mt-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-slate-100">{ring.title}</h3>
                <p className="text-sm text-slate-400">{ring.description}</p>
              </div>
              {ring.action && (
                <button className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-purple-500/50 hover:text-white">
                  {ring.action}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnimatedBarChart({
  data
}: {
  data: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="group relative flex-1"
          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
        >
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-cyan-600 transition-all duration-300 group-hover:opacity-90 animate-[growUp_0.6s_ease-out_backwards]"
            style={
              {
                "--target-height": `${item.value}%`,
                height: `${item.value}%`,
                maxHeight: "100%"
              } as React.CSSProperties
            }
          />
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.label}: {item.value}%
          </div>
        </div>
      ))}
    </div>
  );
}

export function ElegantToast({
  message,
  type = "info"
}: {
  message: string;
  type?: "info" | "success" | "warning";
}) {
  const typeConfig = {
    info: {
      bg: "bg-gradient-to-r from-slate-800 to-slate-900",
      border: "border-cyan-500/30",
      icon: "💡"
    },
    success: {
      bg: "bg-gradient-to-r from-emerald-900/50 to-emerald-800/30",
      border: "border-emerald-500/30",
      icon: "✅"
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-900/50 to-amber-800/30",
      border: "border-amber-500/30",
      icon: "⚠️"
    }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed right-6 top-6 z-50 max-w-sm animate-[slideInRight_0.4s_ease-out] rounded-xl border p-4 backdrop-blur-xl shadow-2xl shadow-purple-900/20">
      <div className={cn("rounded-xl border p-4", config.bg, config.border)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <span className="text-slate-200">{message}</span>
        </div>
        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-slate-700/50">
          <div className="h-full animate-[shrink_4s_linear] bg-gradient-to-r from-cyan-500 to-purple-500" />
        </div>
      </div>
    </div>
  );
}
