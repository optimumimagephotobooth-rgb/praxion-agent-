"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChecklistItem {
  id: string;
  label: string;
  complete: boolean;
}

interface ReadinessChecklistProps {
  title: string;
  description: string;
  items: ChecklistItem[];
  onPrimaryAction?: () => void;
}

export function ReadinessChecklist({
  title,
  description,
  items,
  onPrimaryAction
}: ReadinessChecklistProps) {
  const completed = items.filter((item) => item.complete).length;
  const total = items.length;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-figma-body text-slate-500">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {completed} of {total} completed
          </span>
          <span className="font-medium text-[#10B981]">Ready</span>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3",
                item.complete ? "bg-[#10B981]/5" : "bg-white"
              )}
            >
              <span className="text-sm text-slate-700">{item.label}</span>
              <span
                className={cn(
                  "text-xs font-medium",
                  item.complete ? "text-[#10B981]" : "text-slate-400"
                )}
              >
                {item.complete ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={onPrimaryAction}>
          Continue Setup
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReadinessChecklistSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
