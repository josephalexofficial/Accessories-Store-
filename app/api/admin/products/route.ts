import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function bustProductCache() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/deals");
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
      imageUrl: body.imageUrl,
      specType: body.specType ?? "KEY_VALUE",
      specifications: body.specifications ?? [],
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/deals");

  return NextResponse.json(product, { status: 201 });
}
