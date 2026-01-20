"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RippleButton, StaggeredList, StaggeredListItem } from "@/components/effects";

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
    <Card className="glass-card w-full">
      <CardHeader className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        <p className="text-figma-body text-slate-400">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            {completed} of {total} completed
          </span>
          <span className="font-medium text-emerald-400">Ready</span>
        </div>
        <StaggeredList
          items={items.map((item) => ({
            id: item.id,
            content: (
              <StaggeredListItem
                title={item.label}
                description={item.complete ? "Completed" : "Pending review"}
                status={item.complete ? "success" : "warning"}
                icon={item.complete ? "✅" : "⏳"}
                isInteractive={false}
              />
            )
          }))}
          animationType="fadeInUp"
          staggerDelay={0.08}
          triggerOnView
        />
        <RippleButton className="w-full" onClick={onPrimaryAction}>
          Continue Setup
        </RippleButton>
      </CardContent>
    </Card>
  );
}

export function ReadinessChecklistSkeleton() {
  return (
    <Card className="glass-card w-full">
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
