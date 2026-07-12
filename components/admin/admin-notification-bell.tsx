"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  ShoppingCart,
  MapPin,
  Shield,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string | null;
  actorEmail: string | null;
  createdAt: string;
  read: boolean;
};

function iconForType(type: string) {
  if (type.startsWith("PRODUCT")) return Package;
  if (type.startsWith("LOCATION")) return MapPin;
  if (type.startsWith("ADMIN")) return Shield;
  return ShoppingCart;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function fetchNotifications(): Promise<{
  items: NotificationItem[];
  unreadCount: number;
}> {
  try {
    const res = await fetch("/api/admin/notifications", { cache: "no-store" });
    if (!res.ok) {
      return { items: [], unreadCount: 0 };
    }
    const data = await res.json().catch(() => ({}));
    return {
      items: Array.isArray(data.items) ? data.items : [],
      unreadCount: Number(data.unreadCount ?? 0),
    };
  } catch {
    return { items: [], unreadCount: 0 };
  }
}

async function patchNotifications(body: {
  notificationId?: string;
  markAll?: boolean;
}) {
  const res = await fetch("/api/admin/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update notification");
}

export function AdminNotificationBell({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await fetchNotifications();
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } catch {
      // Treat load failures as an empty inbox — never show a scary error for “no notifications”.
      setItems([]);
      setUnreadCount(0);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const id = window.setInterval(() => {
      void loadNotifications(true);
    }, 30000);
    return () => window.clearInterval(id);
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSelectedId(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSelectedId(null);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function markAsRead(item: NotificationItem) {
    if (item.read) return;
    setBusyId(item.id);
    try {
      await patchNotifications({ notificationId: item.id });
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, read: true } : row))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      /* keep optimistic UI calm if mark-read fails */
    } finally {
      setBusyId(null);
    }
  }

  async function markAllRead() {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await patchNotifications({ markAll: true });
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      /* keep optimistic UI calm if mark-all fails */
    } finally {
      setMarkingAll(false);
    }
  }

  async function openNotification(item: NotificationItem) {
    setSelectedId(item.id);
    await markAsRead(item);
  }

  async function openRelatedPage(item: NotificationItem) {
    await markAsRead(item);
    setOpen(false);
    setSelectedId(null);
    if (item.href) router.push(item.href);
  }

  const isDark = variant === "dark";
  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            setSelectedId(null);
            void loadNotifications();
          }
        }}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          isDark
            ? "bg-white/10 text-white hover:bg-white/15"
            : "border border-border bg-canvas text-ink-muted hover:border-brand/40 hover:text-brand",
          open && (isDark ? "bg-white/20" : "border-brand text-brand")
        )}
        aria-label={
          unreadCount > 0
            ? `Open notifications, ${unreadCount} unread`
            : "Open notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="h-[1.15rem] w-[1.15rem]" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className={cn(
            "z-50 flex max-h-[min(34rem,70dvh)] w-[min(24rem,calc(100vw-1.25rem))] flex-col overflow-hidden rounded-2xl border border-border bg-canvas shadow-[0_18px_48px_rgba(0,0,0,0.14)]",
            "fixed left-3 right-3 top-[4.25rem] mx-auto md:absolute md:left-auto md:right-0 md:top-auto md:mx-0 md:mt-2",
            isDark && "md:left-0 md:right-auto"
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">Notifications</p>
              <p className="text-xs text-ink-subtle">
                {unreadCount > 0
                  ? `${unreadCount} unread · tap to read`
                  : "You're all caught up"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  disabled={markingAll}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint disabled:opacity-60"
                >
                  {markingAll ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="h-3.5 w-3.5" />
                  )}
                  Mark all read
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSelectedId(null);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-surface hover:text-ink"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {selected ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="border-b border-border bg-surface/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  ← Back to list
                </button>
              </div>
              <div className="space-y-4 px-4 py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      selected.read
                        ? "bg-surface text-ink-muted"
                        : "bg-brand text-white"
                    )}
                  >
                    {(() => {
                      const Icon = iconForType(selected.type);
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-ink">
                        {selected.title}
                      </h3>
                      {!selected.read ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink-subtle">
                      {timeAgo(selected.createdAt)}
                      {selected.actorEmail ? ` · by ${selected.actorEmail}` : ""}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-ink-muted">
                  {selected.message}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {!selected.read ? (
                    <button
                      type="button"
                      onClick={() => void markAsRead(selected)}
                      disabled={busyId === selected.id}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-ink hover:bg-surface disabled:opacity-60"
                    >
                      {busyId === selected.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Mark as read
                    </button>
                  ) : (
                    <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-surface px-3 text-xs font-semibold text-ink-subtle">
                      <Check className="h-3.5 w-3.5" />
                      Read
                    </span>
                  )}
                  {selected.href ? (
                    <button
                      type="button"
                      onClick={() => void openRelatedPage(selected)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-hover"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open related page
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-ink-subtle">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading notifications…
                </div>
              ) : items.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-ink-subtle">
                  No notifications yet.
                </div>
              ) : (
                <ul>
                  {items.map((item) => {
                    const Icon = iconForType(item.type);
                    return (
                      <li
                        key={item.id}
                        className="border-b border-border/70 last:border-0"
                      >
                        <div
                          className={cn(
                            "flex gap-2 px-3 py-2.5",
                            !item.read && "bg-brand-tint/40"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => void openNotification(item)}
                            className="flex min-w-0 flex-1 gap-3 rounded-xl px-1 py-1 text-left transition-colors hover:bg-brand-tint/60"
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                                item.read
                                  ? "bg-surface text-ink-muted"
                                  : "bg-brand text-white"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-2">
                                <span className="text-sm font-semibold text-ink">
                                  {item.title}
                                </span>
                                <span className="flex shrink-0 items-center gap-1.5">
                                  {!item.read ? (
                                    <span className="h-2 w-2 rounded-full bg-brand" />
                                  ) : null}
                                  <span className="text-[11px] text-ink-subtle">
                                    {timeAgo(item.createdAt)}
                                  </span>
                                </span>
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-ink-muted">
                                {item.message}
                              </span>
                              <span className="mt-1 inline-flex text-[11px] font-semibold text-brand">
                                Open to read →
                              </span>
                            </span>
                          </button>

                          <div className="flex shrink-0 flex-col gap-1 pt-1">
                            {!item.read ? (
                              <button
                                type="button"
                                title="Mark as read"
                                aria-label={`Mark ${item.title} as read`}
                                onClick={() => void markAsRead(item)}
                                disabled={busyId === item.id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:border-brand/40 hover:text-brand disabled:opacity-60"
                              >
                                {busyId === item.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                              </button>
                            ) : null}
                            {item.href ? (
                              <button
                                type="button"
                                title="Open related page"
                                aria-label={`Open page for ${item.title}`}
                                onClick={() => void openRelatedPage(item)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:border-brand/40 hover:text-brand"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <div className="border-t border-border bg-surface/70 px-4 py-2.5 text-center">
            <Link
              href="/admin/notifications"
              onClick={() => {
                setOpen(false);
                setSelectedId(null);
              }}
              className="text-xs font-semibold text-brand hover:underline"
            >
              See all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
