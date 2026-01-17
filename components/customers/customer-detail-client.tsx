"use client";

import { useRouter } from "next/navigation";
import { CustomerDetail } from "@/components/customers/customer-detail";

interface CustomerDetailClientProps {
  id: number;
}

export function CustomerDetailClient({ id }: CustomerDetailClientProps) {
  const router = useRouter();

  return (
    <CustomerDetail
      id={id}
      onNavigate={(view) => {
        if (view === "list") {
          router.push("/customers");
          return;
        }
        router.push("/customers");
      }}
    />
  );
}
