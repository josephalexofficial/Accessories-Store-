import { StoreLayout } from "@/components/layout/store-layout";
import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
          Shopping Cart
        </h1>
        <CartContent />
      </div>
    </StoreLayout>
  );
}
