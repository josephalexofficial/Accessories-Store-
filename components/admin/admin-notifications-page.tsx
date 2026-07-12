"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCheck,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/components/admin/admin-notification-bell";

function iconForType(type: string) {
  if (type.startsWith("PRODUCT")) return Package;
  if (type.startsWith("LOCATION")) return MapPin;
  if (type.startsWith("ADMIN")) return Shield;
  return ShoppingCart;
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminNotificationsPageClient() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        setUnreadCount(0);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data.items) ? data.items : []);
      setUnreadCount(Number(data.unreadCount ?? 0));
    } catch {
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markAsRead(item: NotificationItem) {
    if (item.read) return;
    setBusyId(item.id);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: item.id }),
      });
      if (!res.ok) throw new Error("mark failed");
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, read: true } : row))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      /* keep UI calm if mark-read fails */
    } finally {
      setBusyId(null);
    }
  }

  async function markAllRead() {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (!res.ok) throw new Error("mark all failed");
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      /* keep UI calm if mark-all fails */
    } finally {
      setMarkingAll(false);
    }
  }

  async function openRelated(item: NotificationItem) {
    await markAsRead(item);
    if (item.href) router.push(item.href);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-brand md:text-2xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "All caught up"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => void markAllRead()}
              disabled={markingAll}
            >
              {markingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark all as read
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => void load()}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-canvas shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications…
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-muted">
            No notifications yet. New orders and important updates will appear
            here.
          </div>
        ) : (
          <ul>
            {items.map((item) => {
              const Icon = iconForType(item.type);
              const expanded = expandedId === item.id;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "border-b border-border last:border-0",
                    !item.read && "bg-brand-tint/30"
                  )}
                >
                  <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedId(expanded ? null : item.id);
                        void markAsRead(item);
                      }}
                      className="flex min-w-0 flex-1 gap-3 text-left"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          item.read
                            ? "bg-surface text-ink-muted"
                            : "bg-brand text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-ink">
                            {item.title}
                          </span>
                          {!item.read ? (
                            <Badge variant="default">Unread</Badge>
                          ) : (
                            <Badge variant="muted">Read</Badge>
                          )}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-sm text-ink-muted",
                            !expanded && "line-clamp-2"
                          )}
                        >
                          {item.message}
                        </span>
                        <span className="mt-2 block text-xs text-ink-subtle">
                          {formatWhen(item.createdAt)}
                          {item.actorEmail ? ` · by ${item.actorEmail}` : ""}
                        </span>
                        <span className="mt-1 inline-flex text-[11px] font-semibold text-brand md:hidden">
                          {expanded ? "Tap to collapse" : "Tap to read fully"}
                        </span>
                      </span>
                    </button>

                    <div className="flex shrink-0 flex-wrap gap-2 md:pt-0.5">
                      {!item.read ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busyId === item.id}
                          onClick={() => void markAsRead(item)}
                        >
                          {busyId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Mark as read
                        </Button>
                      ) : null}
                      {item.href ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => void openRelated(item)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-center text-xs text-muted">
        Tip: use the bell in the admin header for quick access.{" "}
        <Link href="/admin/dashboard" className="font-semibold text-brand hover:underline">
          Back to overview
        </Link>
      </p>
    </div>
  );
}
