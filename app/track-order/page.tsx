import { StoreLayout } from "@/components/layout/store-layout";
import { TrackOrderForm } from "@/components/track-order/track-order-form";

export default function TrackOrderPage() {
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <TrackOrderForm />
      </div>
    </StoreLayout>
  );
}
