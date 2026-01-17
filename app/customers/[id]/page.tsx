import { CustomerDetailClient } from "@/components/customers/customer-detail-client";

interface CustomerDetailPageProps {
  params: { id: string };
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return (
      <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
        <div className="text-sm text-gray-500">Invalid customer ID.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
      <CustomerDetailClient id={id} />
    </main>
  );
}
