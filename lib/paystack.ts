import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { getAuthBaseUrl } from "@/lib/auth-url";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAYSTACK CONFIG (Test → Live switch)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TEST MODE (current / development):
 *   PAYSTACK_SECRET_KEY=sk_test_...
 *   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
 *
 * LIVE MODE (when Paystack activates your business + till settlements):
 *   1. In Paystack dashboard, switch Test → Live
 *   2. Copy Live Secret + Public keys
 *   3. Replace the env values on Vercel (Production) AND local .env:
 *        PAYSTACK_SECRET_KEY=sk_live_...
 *        NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
 *   4. Set webhook to:
 *        https://whimsey-accessories-store.vercel.app/api/paystack/webhook
 *   5. Redeploy Vercel
 *
 * Never commit real secret keys to git. Never expose sk_ keys to the browser.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PAYSTACK_API = "https://api.paystack.co";

export function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing PAYSTACK_SECRET_KEY. Add sk_test_... (or sk_live_... when going live)."
    );
  }
  return key;
}

/** Optional public key — used if we add Paystack.js popup later */
export function getPaystackPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() || null;
}

export function isPaystackTestMode(): boolean {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim() ?? "";
  return key.startsWith("sk_test_");
}

/** Public site origin for Paystack callback_url */
export function getPaystackCallbackUrl(requestUrl?: string): string {
  const fromRequest = requestUrl ? new URL(requestUrl).origin : "";
  const base = getAuthBaseUrl(fromRequest || undefined);
  return `${base}/checkout/callback`;
}

export function amountToKobo(amountKes: number): number {
  // Paystack expects the smallest currency unit (kobo for NGN; same *100 for KES)
  return Math.round(amountKes * 100);
}

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string | null;
    gateway_response?: string;
    customer?: { email?: string };
    metadata?: Record<string, unknown>;
  };
};

async function paystackFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const secret = getPaystackSecretKey();
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = (await res.json()) as T & { status?: boolean; message?: string };
  return json;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountKes: number;
  reference: string;
  callbackUrl: string;
  orderNumber: string;
  customerName: string;
}) {
  const body = {
    email: input.email,
    amount: amountToKobo(input.amountKes),
    reference: input.reference,
    callback_url: input.callbackUrl,
    // Kenya storefront — change only if Paystack account currency differs
    currency: "KES",
    metadata: {
      orderNumber: input.orderNumber,
      customerName: input.customerName,
      // Helps identify test vs live charges in Paystack dashboard
      source: "whimsey-accessories",
    },
  };

  const result = await paystackFetch<PaystackInitializeResponse>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  if (!result.status || !result.data?.authorization_url) {
    throw new Error(result.message || "Paystack initialize failed");
  }

  return result.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const result = await paystackFetch<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );

  if (!result.status || !result.data) {
    throw new Error(result.message || "Paystack verify failed");
  }

  return result.data;
}

/**
 * Validate Paystack webhook signature (x-paystack-signature).
 * Uses the secret key as HMAC key (Paystack standard).
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;
  const secret = getPaystackSecretKey();
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");

  try {
    const a = Buffer.from(hash, "utf8");
    const b = Buffer.from(signatureHeader, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Build a unique Paystack reference from our order number */
export function buildPaystackReference(orderNumber: string): string {
  // Paystack references should be unique; append a short stamp for retries
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `${orderNumber}-${stamp}`;
}
