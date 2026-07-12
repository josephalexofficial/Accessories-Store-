import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifySuperAdminOfStaffAction } from "@/lib/admin-notifications";
import { slugify } from "@/lib/utils";

const STOCK_STATUSES = new Set(["IN_STOCK", "LOW_STOCK", "SOLD_OUT"]);
const SPEC_TYPES = new Set(["KEY_VALUE", "BULLET_LIST"]);

function bustProductCache(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/deals");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  if (slug) revalidatePath(`/products/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/products/${previousSlug}`);
  }
  revalidateTag("products", "max");
  revalidateTag("admin-products", "max");
  revalidateTag("admin-dashboard", "max");
}

function parseProductBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  const brand = String(body.brand ?? "").trim();
  const category = String(body.category ?? "").trim();
  const price = Number(body.price);
  const isSale = Boolean(body.isSale);
  const salePriceRaw = body.salePrice;
  const salePrice =
    isSale && salePriceRaw != null && salePriceRaw !== ""
      ? Number(salePriceRaw)
      : null;
  const stockStatus = String(body.stockStatus ?? "IN_STOCK");
  const specType = String(body.specType ?? "KEY_VALUE");
  const imageUrlRaw = body.imageUrl;
  const imageUrl =
    typeof imageUrlRaw === "string" && imageUrlRaw.trim()
      ? imageUrlRaw.trim()
      : null;
  const slugFromBody =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(title);

  if (!title || !brand || !category) {
    return { error: "Title, brand, and category are required" as const };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Valid base price is required" as const };
  }
  if (isSale && (salePrice == null || !Number.isFinite(salePrice) || salePrice < 0)) {
    return { error: "Valid sale price is required for deals" as const };
  }
  if (!STOCK_STATUSES.has(stockStatus)) {
    return { error: "Invalid stock status" as const };
  }
  if (!SPEC_TYPES.has(specType)) {
    return { error: "Invalid specification type" as const };
  }

  return {
    data: {
      title,
      brand,
      slug: slugFromBody,
      category,
      price,
      isSale,
      salePrice,
      stockStatus: stockStatus as "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT",
      imageUrl,
      specType: specType as "KEY_VALUE" | "BULLET_LIST",
      specifications: body.specifications ?? [],
    },
  };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = parseProductBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const slugTaken = await prisma.product.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id },
    },
    select: { id: true },
  });
  if (slugTaken) {
    return NextResponse.json(
      { error: "Another product already uses a similar title/slug" },
      { status: 409 }
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    bustProductCache(product.slug, existing.slug);

    await notifySuperAdminOfStaffAction({
      type: "PRODUCT_UPDATED",
      title: "Product updated",
      message: `${product.title} was edited.`,
      href: "/admin/products",
      actorEmail: session.user?.email,
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { title: true, slug: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });
  bustProductCache(existing.slug);

  await notifySuperAdminOfStaffAction({
    type: "PRODUCT_DELETED",
    title: "Product deleted",
    message: `${existing.title} was removed from the catalog.`,
    href: "/admin/products",
    actorEmail: session.user?.email,
  });

  return NextResponse.json({ success: true });
}
