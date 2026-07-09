import { NextResponse } from "next/server";
import { trackWhatsAppClick } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, page } = body as { productId?: string; page?: string };

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    await trackWhatsAppClick(productId, page);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
