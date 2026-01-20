"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ParticleBackground } from "@/components/effects";

type LightingIntensity = "subtle" | "medium" | "intense";
type LightingTheme = "default" | "purple" | "cyan" | "emerald";
type LightingBlur = "small" | "medium" | "large";

const themes = {
  default: {
    primary: { r: 139, g: 92, b: 246 },
    secondary: { r: 6, g: 182, b: 212 },
    tertiary: { r: 16, g: 185, b: 129 }
  },
  purple: {
    primary: { r: 139, g: 92, b: 246 },
    secondary: { r: 167, g: 139, b: 250 },
    tertiary: { r: 196, g: 181, b: 253 }
  },
  cyan: {
    primary: { r: 6, g: 182, b: 212 },
    secondary: { r: 34, g: 211, b: 238 },
    tertiary: { r: 103, g: 232, b: 249 }
  },
  emerald: {
    primary: { r: 16, g: 185, b: 129 },
    secondary: { r: 52, g: 211, b: 153 },
    tertiary: { r: 110, g: 231, b: 183 }
  }
};

const intensities: Record<LightingIntensity, number> = {
  subtle: 0.15,
  medium: 0.25,
  intense: 0.4
};

const blurSizes: Record<LightingBlur, string> = {
  small: "blur-2xl",
  medium: "blur-3xl",
  large: "blur-[100px]"
};

export function AmbientLighting({
  intensity = "medium",
  colorTheme = "default",
  animated = true,
  blurSize = "large",
  className
}: {
  intensity?: LightingIntensity;
  colorTheme?: LightingTheme;
  animated?: boolean;
  blurSize?: LightingBlur;
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!animated || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = themes[colorTheme];
    const opacity = intensities[intensity];
    let time = 0;

    const lights = [
      { x: 0.3, y: 0.3, radius: 0.4, color: theme.primary, speed: 0.0003 },
      { x: 0.7, y: 0.7, radius: 0.5, color: theme.secondary, speed: 0.0002 },
      { x: 0.5, y: 0.8, radius: 0.3, color: theme.tertiary, speed: 0.0004 }
    ];

    const draw = () => {
      const { width, height } = canvas;
      if (!width || !height) return;

      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "rgba(15, 23, 42, 0.2)");
      background.addColorStop(1, "rgba(2, 6, 23, 0.1)");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      lights.forEach((light) => {
        const centerX = width * light.x + Math.sin(time * light.speed) * width * 0.05;
        const centerY = height * light.y + Math.cos(time * light.speed) * height * 0.05;
        const radius = width * light.radius;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(
          0,
          `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, ${opacity})`
        );
        gradient.addColorStop(
          0.7,
          `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, ${opacity * 0.3})`
        );
        gradient.addColorStop(
          1,
          `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 0)`
        );
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      time += 1;
      animationRef.current = window.requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    draw();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated, colorTheme, intensity]);

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      {animated && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
      {!animated && (
        <>
          <div
            className={cn(
              "absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 animate-pulse [animation-duration:8s]",
              blurSizes[blurSize]
            )}
          />
          <div
            className={cn(
              "absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 animate-pulse [animation-duration:10s] [animation-delay:2s]",
              blurSizes[blurSize]
            )}
          />
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/15 to-emerald-600/15 animate-pulse [animation-duration:12s] [animation-delay:4s]",
              blurSizes[blurSize]
            )}
          />
        </>
      )}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIj48L2ZlVHVyYnVsZW5jZT48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIj48L2ZlQ29sb3JNYXRyaXg+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-10" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] [background-size:80px_80px]" />
    </div>
  );
}

export function N8nBackgroundLighting() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -right-1/4 top-0 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-purple-600/20 via-purple-600/10 to-cyan-600/15 blur-[150px] animate-ambient-pulse"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        className="absolute -left-1/4 bottom-0 h-1/2 w-1/2 rounded-full bg-gradient-to-tr from-cyan-600/15 via-emerald-600/10 to-emerald-600/20 blur-[150px] animate-ambient-pulse-slow [animation-delay:3s]"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-600/25 to-transparent blur-[100px] animate-gentle-drift"
        style={{ willChange: "transform, opacity" }}
      />
      <div className="hidden md:block">
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-slate-950/30 [background-image:linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />
    </div>
  );
}

export function OptimizedLighting() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none animate-ambient-pulse-slow"
        style={{ willChange: "transform, opacity" }}
      />
      <N8nBackgroundLighting />
    </>
  );
}
