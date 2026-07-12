import { StoreLayout } from "@/components/layout/store-layout";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getActiveDeliveryLocations } from "@/lib/delivery-locations";

export const revalidate = 60;

export default async function CheckoutPage() {
  const locations = await getActiveDeliveryLocations();

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
          Checkout
        </h1>
        <CheckoutForm locations={locations} />
      </div>
    </StoreLayout>
  );
}
