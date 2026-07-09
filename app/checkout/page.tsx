import { StoreLayout } from "@/components/layout/store-layout";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default function CheckoutPage() {
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
          Checkout
        </h1>
        <CheckoutForm />
      </div>
    </StoreLayout>
  );
}
