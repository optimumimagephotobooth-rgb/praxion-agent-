import { CustomerTableSkeleton } from "@/components/customer-table";
import { ReadinessChecklistSkeleton } from "@/components/readiness-checklist";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[1392px] flex-col gap-6 px-6 py-8">
      <CustomerTableSkeleton />
      <ReadinessChecklistSkeleton />
    </main>
  );
}
