import { Check, Circle, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE_STEPS,
  timelineStepState,
  type OrderStatusValue,
} from "@/lib/order-status";

export function OrderStatusTimeline({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  if (status === "CANCELLED") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
          compact && "px-3 py-2.5 text-xs"
        )}
      >
        <PackageX className={cn("shrink-0", compact ? "h-4 w-4" : "h-5 w-5")} />
        <div>
          <p className="font-semibold">Cancelled</p>
          <p className="text-red-600/80">This order is no longer in progress.</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {ORDER_TIMELINE_STEPS.map((step, index) => {
        const state = timelineStepState(status, step);
        const isLast = index === ORDER_TIMELINE_STEPS.length - 1;
        return (
          <li
            key={step}
            className="relative flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:px-1"
          >
            <div className="relative flex items-center sm:w-full sm:justify-center">
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  state === "complete" && "border-brand bg-brand text-white",
                  state === "current" && "border-brand bg-brand-tint text-brand",
                  state === "upcoming" &&
                    "border-border bg-canvas text-ink-subtle"
                )}
              >
                {state === "complete" ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <Circle
                    className={cn(
                      "h-2.5 w-2.5 fill-current",
                      state === "current" ? "text-brand" : "text-ink-subtle"
                    )}
                  />
                )}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "absolute left-8 top-4 hidden h-px w-[calc(100%-2rem)] sm:block",
                    state === "complete" ? "bg-brand" : "bg-border"
                  )}
                  aria-hidden
                />
              ) : null}
              {!isLast ? (
                <span
                  className={cn(
                    "absolute left-4 top-8 h-[calc(100%+0.5rem)] w-px sm:hidden",
                    state === "complete" ? "bg-brand" : "bg-border"
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
            <p
              className={cn(
                "pb-5 text-sm font-semibold sm:pb-0 sm:pt-2 sm:text-center",
                state === "upcoming" ? "text-ink-subtle" : "text-ink",
                compact && "text-xs"
              )}
            >
              {ORDER_STATUS_LABELS[step as OrderStatusValue]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
