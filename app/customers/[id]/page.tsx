import { CustomerDetailClient } from "@/components/customers/customer-detail-client";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params
}: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
      <CustomerDetailClient id={id} />
    </main>
  );
}
