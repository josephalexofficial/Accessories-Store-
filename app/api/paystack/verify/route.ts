import { NextResponse } from "next/server";
import {
  markOrderPaidFromPaystack,
  markOrderPaymentFailed,
} from "@/lib/paystack-orders";

/**
 * Verify a Paystack transaction after the customer returns from checkout.
 * Query: ?reference=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = String(searchParams.get("reference") ?? "").trim();

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const result = await markOrderPaidFromPaystack(reference);

    if (!result.ok) {
      if (result.reason === "not_success") {
        await markOrderPaymentFailed(reference);
      }
      return NextResponse.json(
        {
          success: false,
          reason: result.reason,
          orderNumber: result.orderNumber,
        },
        { status: 402 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyPaid: result.alreadyPaid,
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    console.error("Paystack verify failed:", error);
    return NextResponse.json(
      { error: "Could not verify payment" },
      { status: 500 }
    );
  }
}
