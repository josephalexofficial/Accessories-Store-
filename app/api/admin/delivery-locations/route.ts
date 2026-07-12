import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function bustLocationCache() {
  revalidateTag("delivery-locations", "max");
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locations = await prisma.deliveryLocation.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    locations.map((location) => ({
      id: location.id,
      name: location.name,
      fee: Number(location.fee),
      isActive: location.isActive,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const fee = Number(body.fee);

  if (!name) {
    return NextResponse.json({ error: "Location name is required" }, { status: 400 });
  }

  if (!Number.isFinite(fee) || fee < 0) {
    return NextResponse.json({ error: "Valid fee is required" }, { status: 400 });
  }

  const existing = await prisma.deliveryLocation.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json(
      { error: "A location with this name already exists" },
      { status: 409 }
    );
  }

  const location = await prisma.deliveryLocation.create({
    data: {
      name,
      fee,
      isActive: body.isActive !== false,
    },
  });

  bustLocationCache();

  return NextResponse.json(
    {
      id: location.id,
      name: location.name,
      fee: Number(location.fee),
      isActive: location.isActive,
    },
    { status: 201 }
  );
}
