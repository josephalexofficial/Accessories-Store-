"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCart } from "@/store/cart";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Paystack redirects here after payment (success or cancel).
 * We verify the reference server-side before trusting the payment.
 */
export function CheckoutCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCart((s) => s.clearCart);

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref") || "";

    if (!reference) {
      setStatus("failed");
      setMessage("Missing payment reference. If you paid, contact support with your email.");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data.success && data.orderNumber) {
          clearCart();
          setOrderNumber(data.orderNumber);
          setStatus("success");
          setMessage("Payment successful. Redirecting to order tracking…");
          window.setTimeout(() => {
            router.replace(`/track-order?order=${encodeURIComponent(data.orderNumber)}`);
          }, 1200);
          return;
        }

        setOrderNumber(
          typeof data.orderNumber === "string" ? data.orderNumber : null
        );
        setStatus("failed");
        setMessage(
          "Payment was not completed. You can try again from checkout or track the order if it was created."
        );
      } catch {
        if (cancelled) return;
        setStatus("failed");
        setMessage("Could not confirm payment. Please try again shortly.");
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart, router]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {status === "loading" ? (
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      ) : status === "success" ? (
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      ) : (
        <XCircle className="h-10 w-10 text-red-500" />
      )}

      <h1 className="mt-4 text-xl font-bold text-ink">
        {status === "loading"
          ? "Confirming payment"
          : status === "success"
            ? "Payment confirmed"
            : "Payment not completed"}
      </h1>
      <p className="mt-2 text-sm text-muted">{message}</p>

      {orderNumber ? (
        <p className="mt-3 font-mono text-sm font-semibold text-brand">
          {orderNumber}
        </p>
      ) : null}

      {status === "failed" ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/checkout" className={cn(buttonVariants())}>
            Back to checkout
          </Link>
          {orderNumber ? (
            <Link
              href={`/track-order?order=${encodeURIComponent(orderNumber)}`}
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Track order
            </Link>
          ) : (
            <Link
              href="/track-order"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Track order
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
