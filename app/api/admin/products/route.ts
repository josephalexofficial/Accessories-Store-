import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifySuperAdminOfStaffAction } from "@/lib/admin-notifications";

function bustProductCache() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/deals");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidateTag("products", "max");
  revalidateTag("admin-products", "max");
  revalidateTag("admin-dashboard", "max");
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      title: body.title,
      brand: body.brand,
      slug: body.slug,
      category: body.category,
      price: body.price,
      salePrice: body.salePrice,
      isSale: body.isSale ?? false,
      stockStatus: body.stockStatus ?? "IN_STOCK",
      imageUrl: body.imageUrl,
      specType: body.specType ?? "KEY_VALUE",
      specifications: body.specifications ?? [],
    },
  });

  bustProductCache();

  await notifySuperAdminOfStaffAction({
    type: "PRODUCT_CREATED",
    title: "Product added",
    message: `${product.title} was added to ${product.category}.`,
    href: "/admin/products",
    actorEmail: session.user?.email,
  });

  return NextResponse.json(product, { status: 201 });
}
