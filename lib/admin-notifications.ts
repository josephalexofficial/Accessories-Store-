import "server-only";
import type {
  AdminNotificationAudience,
  AdminNotificationType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/super-admin";

type CreateNotificationInput = {
  type: AdminNotificationType;
  audience: AdminNotificationAudience;
  title: string;
  message: string;
  href?: string;
  actorEmail?: string | null;
};

async function createNotification(input: CreateNotificationInput) {
  try {
    await prisma.adminNotification.create({
      data: {
        type: input.type,
        audience: input.audience,
        title: input.title,
        message: input.message,
        href: input.href ?? null,
        actorEmail: input.actorEmail?.trim().toLowerCase() || null,
      },
    });
  } catch (error) {
    console.error("Failed to create admin notification:", error);
  }
}

/** New orders / store priorities — visible to every admin. */
export async function notifyAllAdmins(input: Omit<CreateNotificationInput, "audience">) {
  await createNotification({ ...input, audience: "ALL_ADMINS" });
}

/**
 * Staff activity alerts — super admin only.
 * Skips when the actor is the super admin (no self-noise).
 */
export async function notifySuperAdminOfStaffAction(
  input: Omit<CreateNotificationInput, "audience"> & { actorEmail?: string | null }
) {
  if (isSuperAdmin(input.actorEmail)) return;
  await createNotification({ ...input, audience: "SUPER_ADMIN_ONLY" });
}

export async function notifyNewOrder(order: {
  orderNumber: string;
  firstName: string;
  lastName: string;
  total: number;
}) {
  await notifyAllAdmins({
    type: "NEW_ORDER",
    title: "New order received",
    message: `${order.firstName} ${order.lastName} placed ${order.orderNumber} · Ksh ${Math.round(order.total).toLocaleString()}`,
    href: "/admin/orders",
  });
}
