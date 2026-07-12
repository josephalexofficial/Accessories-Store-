import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifySuperAdminOfStaffAction } from "@/lib/admin-notifications";

function bustLocationCache() {
  revalidateTag("delivery-locations", "max");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const fee = Number(body.fee);

  if (!name) {
    return NextResponse.json({ error: "Location name is required" }, { status: 400 });
  }

  if (!Number.isFinite(fee) || fee < 0) {
    return NextResponse.json({ error: "Valid fee is required" }, { status: 400 });
  }

  const duplicate = await prisma.deliveryLocation.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "A location with this name already exists" },
      { status: 409 }
    );
  }

  try {
    const location = await prisma.deliveryLocation.update({
      where: { id },
      data: {
        name,
        fee,
        isActive: body.isActive !== false,
      },
    });

    bustLocationCache();

    await notifySuperAdminOfStaffAction({
      type: "LOCATION_UPDATED",
      title: "Delivery location updated",
      message: `${location.name} was edited (Ksh ${Number(location.fee).toLocaleString()}).`,
      href: "/admin/locations",
      actorEmail: session.user?.email,
    });

    return NextResponse.json({
      id: location.id,
      name: location.name,
      fee: Number(location.fee),
      isActive: location.isActive,
    });
  } catch {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const location = await prisma.deliveryLocation.delete({ where: { id } });
    bustLocationCache();

    await notifySuperAdminOfStaffAction({
      type: "LOCATION_DELETED",
      title: "Delivery location deleted",
      message: `${location.name} was removed from delivery towns.`,
      href: "/admin/locations",
      actorEmail: session.user?.email,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }
}
