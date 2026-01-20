"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  progress = 75,
  size = 80,
  strokeWidth = 8,
  trackColor = "rgba(30, 41, 59, 0.5)",
  progressColor = "#3B82F6",
  showValue = true,
  label,
  className
}: {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  showValue?: boolean;
  label?: string;
  className?: string;
}) {
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    let animationFrame = 0;
    let startTime: number | undefined;
    const duration = 1500;
    const target = Math.max(0, Math.min(progress, 100));

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percentage = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      const currentProgress = easeOutCubic * target;
      setAnimatedProgress(Math.round(currentProgress));

      if (percentage < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={cn("progress-ring inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90 transform" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="transition-colors duration-300"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            className="progress-circle transition-all duration-1000 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 1.5s ease-in-out"
            }}
          />
        </svg>

        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-100">{animatedProgress}%</span>
          </div>
        )}
      </div>

      {label && <div className="mt-2 text-center text-sm text-slate-400">{label}</div>}
    </div>
  );
}

export function ProgressRingGroup({
  items,
  columns = 4,
  className
}: {
  items: Array<{
    progress: number;
    title: string;
    description?: string;
    color?: string;
    size?: number;
    label?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4"
  } as const;

  return (
    <div className={cn("grid gap-6", gridColumns[columns], className)}>
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className="stagger-item translate-y-6 opacity-0 text-center transition-all duration-700 ease-out animate-enter animate-fadeIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="rounded-xl glass-card p-4">
            <ProgressRing
              progress={item.progress}
              size={item.size ?? 80}
              progressColor={item.color ?? "#3B82F6"}
              label={item.label}
              showValue
            />
            <div className="mt-3">
              <div className="text-sm font-medium text-slate-100">{item.title}</div>
              {item.description && (
                <div className="mt-1 text-xs text-slate-400">{item.description}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
