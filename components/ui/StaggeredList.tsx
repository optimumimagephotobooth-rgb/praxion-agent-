"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type StaggeredItem = {
  id?: string | number;
  content?: React.ReactNode;
  [key: string]: unknown;
};

export function StaggeredList<T extends StaggeredItem>({
  items,
  animationDelay = 0.1,
  className,
  children
}: {
  items: T[];
  animationDelay?: number;
  className?: string;
  children?: (item: T) => React.ReactNode;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const elements = entry.target.querySelectorAll<HTMLElement>(".stagger-item");
          elements.forEach((element, index) => {
            window.setTimeout(() => {
              element.classList.add("animate-enter");
              element.classList.add("animate-fadeIn");
            }, index * animationDelay * 1000);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animationDelay]);

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="stagger-item opacity-0 translate-y-6 transition-all duration-700 ease-out"
          style={{ animationDelay: `${index * animationDelay}s`, willChange: "transform, opacity" }}
        >
          {children ? children(item) : item.content}
        </div>
      ))}
    </div>
  );
}

export function StaggeredGrid<T extends StaggeredItem>({
  items,
  columns = 3,
  animationDelay = 0.1,
  className,
  children
}: {
  items: T[];
  columns?: 1 | 2 | 3 | 4;
  animationDelay?: number;
  className?: string;
  children?: (item: T) => React.ReactNode;
}) {
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  } as const;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const elements = entry.target.querySelectorAll<HTMLElement>(".stagger-item");
          elements.forEach((element, index) => {
            window.setTimeout(() => {
              element.classList.add("animate-enter");
              element.classList.add("animate-fadeIn");
            }, index * animationDelay * 1000);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, [animationDelay]);

  return (
    <div ref={gridRef} className={cn("grid gap-4", gridColumns[columns], className)}>
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="stagger-item opacity-0 translate-y-6 transition-all duration-700 ease-out"
          style={{ animationDelay: `${index * animationDelay}s`, willChange: "transform, opacity" }}
        >
          {children ? children(item) : item.content}
        </div>
      ))}
    </div>
  );
}
