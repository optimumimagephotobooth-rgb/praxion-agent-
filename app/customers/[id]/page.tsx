import { CustomerDetailClient } from "@/components/customers/customer-detail-client";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  if (Number.isNaN(customerId)) {
    return (
      <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
        <div className="text-sm text-gray-500">Invalid customer ID.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
      <CustomerDetailClient id={customerId} />
    </main>
  );
}
