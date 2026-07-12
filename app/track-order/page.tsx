import { StoreLayout } from "@/components/layout/store-layout";
import { TrackOrderForm } from "@/components/track-order/track-order-form";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const initialOrderNumber = String(params.order ?? "").trim();

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <TrackOrderForm initialOrderNumber={initialOrderNumber} />
      </div>
    </StoreLayout>
  );
}
