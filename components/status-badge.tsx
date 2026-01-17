"use client";

import { Badge } from "@/components/ui/badge";

export type CustomerStatus = "Active" | "Pending" | "Inactive";

interface StatusBadgeProps {
  status: CustomerStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = status === "Active" ? "success" : "default";

  return <Badge variant={variant}>{status}</Badge>;
}
