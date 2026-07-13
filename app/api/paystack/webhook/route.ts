import { NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import {
  markOrderPaidFromPaystack,
  markOrderPaymentFailed,
} from "@/lib/paystack-orders";

/**
 * Paystack server-to-server webhook.
 *
 * Dashboard (Test and Live each have their own URL field):
 *   https://whimsey-accessories-store.vercel.app/api/paystack/webhook
 *
 * When going live: set the same path under Live → API Keys & Webhooks.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: string; status?: string };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(event.data?.reference ?? "").trim();
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  try {
    if (event.event === "charge.success") {
      await markOrderPaidFromPaystack(reference);
    } else if (
      event.event === "charge.failed" ||
      event.data?.status === "failed"
    ) {
      await markOrderPaymentFailed(reference);
    }
  } catch (error) {
    console.error("Paystack webhook handling failed:", error);
    // Return 500 so Paystack retries
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
