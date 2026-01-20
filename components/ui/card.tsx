import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "muted";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
}

const cardVariants: Record<CardVariant, string> = {
  default: "border-slate-700/60 bg-slate-900/70 backdrop-blur-sm",
  muted: "border-slate-700/50 bg-slate-800/40 backdrop-blur-sm"
};

export function Card({
  className,
  variant = "default",
  hover = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border",
        cardVariants[variant],
        hover && "card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-100", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400", className)} {...props} />
  );
}
