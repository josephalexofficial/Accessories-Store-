import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/super-admin";

function emptyPayload() {
  return NextResponse.json({ items: [], unreadCount: 0 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email.trim().toLowerCase();
  const superAdmin = isSuperAdmin(email);

  try {
    if (!("adminNotification" in prisma)) {
      return emptyPayload();
    }

    const notifications = await prisma.adminNotification.findMany({
      where: superAdmin ? undefined : { audience: "ALL_ADMINS" },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        reads: {
          where: { adminEmail: email },
          select: { id: true },
        },
      },
    });

    const items = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      href: n.href,
      actorEmail: n.actorEmail,
      createdAt: n.createdAt.toISOString(),
      read: n.reads.length > 0,
    }));

    return NextResponse.json({
      items,
      unreadCount: items.filter((item) => !item.read).length,
    });
  } catch (error) {
    console.error("Load admin notifications failed:", error);
    // Prefer an empty inbox over an error banner when nothing is available yet.
    return emptyPayload();
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email.trim().toLowerCase();
  const body = await request.json().catch(() => ({}));
  const notificationId =
    typeof body.notificationId === "string" ? body.notificationId : null;
  const markAll = body.markAll === true;

  try {
    if (!("adminNotification" in prisma)) {
      return NextResponse.json({ success: true });
    }

    if (markAll) {
      const superAdmin = isSuperAdmin(email);
      const unread = await prisma.adminNotification.findMany({
        where: {
          ...(superAdmin ? {} : { audience: "ALL_ADMINS" }),
          reads: { none: { adminEmail: email } },
        },
        select: { id: true },
        take: 100,
      });

      if (unread.length > 0) {
        await prisma.adminNotificationRead.createMany({
          data: unread.map((n) => ({
            notificationId: n.id,
            adminEmail: email,
          })),
          skipDuplicates: true,
        });
      }

      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "notificationId required" }, { status: 400 });
    }

    await prisma.adminNotificationRead.upsert({
      where: {
        notificationId_adminEmail: {
          notificationId,
          adminEmail: email,
        },
      },
      create: { notificationId, adminEmail: email },
      update: { readAt: new Date() },
    });

    return NextResponse.json({ success: true, notificationId, read: true });
  } catch (error) {
    console.error("Update admin notifications failed:", error);
    return NextResponse.json({ success: true });
  }
}
