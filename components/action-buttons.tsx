"use client";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
}

export function ActionButtons({ onView, onEdit }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={onView}>
        View
      </Button>
      <Button size="sm" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}
