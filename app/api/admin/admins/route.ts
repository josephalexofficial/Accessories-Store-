import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/super-admin";
import { notifySuperAdminOfStaffAction } from "@/lib/admin-notifications";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session.user?.email)) {
    return NextResponse.json(
      { error: "Only the super admin can add other admins" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { email, password: hashed } });
  revalidateTag("admin-team", "max");

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session.user.email)) {
    return NextResponse.json(
      { error: "Only the super admin can remove admins" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const id = String(body.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "Admin id required" }, { status: 400 });
  }

  const target = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  if (isSuperAdmin(target.email)) {
    return NextResponse.json(
      { error: "The super admin account cannot be deleted" },
      { status: 403 }
    );
  }

  if (target.email === session.user.email.trim().toLowerCase()) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 403 }
    );
  }

  await prisma.admin.delete({ where: { id: target.id } });
  revalidateTag("admin-team", "max");

  await notifySuperAdminOfStaffAction({
    type: "ADMIN_DELETED",
    title: "Admin removed",
    message: `${target.email} was removed from the admin team.`,
    href: "/admin/admins",
    actorEmail: session.user.email,
  });

  return NextResponse.json({ success: true });
}
