"use client";

import { useRouter } from "next/navigation";
import { CustomerList } from "@/components/customers/customer-list";

export function CustomerListClient() {
  const router = useRouter();

  return (
    <CustomerList
      onNavigate={(view, id) => {
        if (view === "detail" && id) {
          router.push(`/customers/${id}`);
          return;
        }
        router.push("/customers");
      }}
    />
  );
}
