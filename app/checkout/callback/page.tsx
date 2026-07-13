import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { CheckoutCallbackClient } from "@/components/checkout/checkout-callback-client";

export default function CheckoutCallbackPage() {
  return (
    <StoreLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-muted">
            Confirming your payment…
          </div>
        }
      >
        <CheckoutCallbackClient />
      </Suspense>
    </StoreLayout>
  );
}
